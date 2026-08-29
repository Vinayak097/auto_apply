import axios from "axios";
import dotenv from "dotenv";
import fs from 'fs'
dotenv.config();

const JOB_SEARCH_RESULTS_OPERATION_ID =
  "tfe/5f366cd305b4f13cf6098df75f7ff2bb92fa42b9a74cb3a3aec7bdc69c6b051e";
const WELLFOUND_APOLLO_SIGNATURE =
  "1787974503-uLI%2FYtTrjgXCoqb%2BiCfd0jV7Mad1d3CypOdSBRZbqDc%3D";
const WELLFOUND_CFP = "90d9e126cb676f6d842598f62b8f6441";

const FILTER_CONFIGURATION_OUTPUT_FIELDS = new Set([
  "__typename",
  "customRoles",
  "locations",
  "markets",
  "remoteCompanyLocations",
  "roles",
  "skills",
]);

function stripGraphqlTypenames(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripGraphqlTypenames);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "__typename")
        .map(([key, nestedValue]) => [key, stripGraphqlTypenames(nestedValue)]),
    );
  }

  return value;
}

function toFilterConfigurationInput(defaultFilter: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(defaultFilter)
      .filter(([key]) => !FILTER_CONFIGURATION_OUTPUT_FIELDS.has(key))
      .map(([key, value]) => [key, stripGraphqlTypenames(value)]),
  );
}
function extractJobs(response) {
  const edges =
    response?.data.data?.talent?.jobSearchResults?.startups?.edges ?? [];


const jobs = edges.flatMap((edge) => {
  const startup = edge.node;

  return startup.highlightedJobListings.map((job) => ({
    // =========================
    // COMPANY / STARTUP
    // =========================
    startupId: startup.startupId,
    companyId: startup.id,
    companyName: startup.name?.trim(),
    companySlug: startup.slug,
    companySize: startup.companySize,
    companyDescription: startup.highConcept,
    companyLogoUrl: startup.logoUrl,

    // =========================
    // JOB
    // =========================
    jobId: job.id,
    title: job.title,
    role: job.primaryRoleTitle,
    slug: job.slug,
    jobType: job.jobType,

    // =========================
    // JOB DESCRIPTION
    // =========================
    description: job.description,

    // =========================
    // LOCATION
    // =========================
    locations: job.locationNames,
    acceptedRemoteLocations: job.acceptedRemoteLocationNames,
    remote: job.remote,
    remoteType: job.remoteConfig?.kind,
    wfhFlexible: job.remoteConfig?.wfhFlexible,

    // =========================
    // COMPENSATION
    // =========================
    compensation: job.compensation,
    equity: job.equity,

    // =========================
    // STATUS
    // =========================
    currentUserApplied: job.currentUserApplied,
    isBookmarked: job.isBookmarked,
    autoPosted: job.autoPosted,
    reposted: job.reposted,

    // =========================
    // DATES
    // =========================
    liveStartAt: job.liveStartAt,
    lastRespondedAt: job.lastRespondedAt,

    // =========================
    // REMOTE CONFIG
    // =========================
    remoteConfig: job.remoteConfig,

    // =========================
    // COMPANY TAGS / BADGES
    // =========================
    badges: startup.badges,

    // =========================
    // COMPANY LOCATIONS
    // =========================
    companyLocations: startup.locationTaggings,

    // =========================
    // WELLFOUND IDENTIFIERS
    // =========================
    startupSearchId: startup.id,
    jobSlug: job.slug
  }));
});


  return jobs;
}
export async function jobSearchResultsX(defaultFilter: Record<string, unknown>) {
  const cookie = process.env.WELLFOUND_COOKIE;
  const userId = process.env.WELLFOUND_USER_ID;

  if (!cookie) {
    throw new Error("WELLFOUND_COOKIE is missing");
  }

  if (!userId) {
    throw new Error("WELLFOUND_USER_ID is missing");
  }

  const filterConfigurationInput = defaultFilter
  try{
  const response = await axios.request({
    method: "post",
    maxBodyLength: Infinity,
    url: "https://wellfound.com/graphql",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "apollographql-client-name": "talent-web",
      "content-type": "application/json",
      origin: "https://wellfound.com",
      referer: "https://wellfound.com/jobs",
      "sec-ch-device-memory": "8",
      "sec-ch-ua":
        '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"',
      "sec-ch-ua-arch": '"x86"',
      "sec-ch-ua-full-version-list":
        '"Not=A?Brand";v="99.0.0.0", "Google Chrome";v="151.0.7922.174", "Chromium";v="151.0.7922.174"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "same-origin",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
      "x-angellist-dd-client-referrer-resource": "/jobs",
      "x-apollo-operation-name": "JobSearchResultsX",
      "x-apollo-signature": WELLFOUND_APOLLO_SIGNATURE,
      "x-requested-with": "XMLHttpRequest",
      "x-wf-cfp": WELLFOUND_CFP,
      Cookie: cookie,
    },
    data: JSON.stringify({
      operationName: "JobSearchResultsX",
      variables: {
        filterConfigurationInput,
        userId,
      },
      extensions: {
        operationId: JOB_SEARCH_RESULTS_OPERATION_ID,
      },
    }),
  });

 
  const jobs=extractJobs(response)
  fs.writeFileSync(
    "jobs1.json",
    JSON.stringify(response.data.data.talent.jobSearchResults.startups.edges, null, 2),
    "utf-8"
  );
  const hasNextPage=response.data.data.talent.jobSearchResults.hasNextPage;
  return {
      jobs:jobs,
      hasNextPage
  };
}
catch(e){
  console.log("failed the jobsearchresultX" , e.message)
  if(e.response?.status==403){
      return {data:null,status:403}
  }
  return null
}
}
