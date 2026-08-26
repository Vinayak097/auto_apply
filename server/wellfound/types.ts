/**
 * Shared domain types for the Wellfound module.
 * Import-free on purpose: every layer (client, operations, parser) relies on these.
 */

/** Filters describing one job-search request. */
export interface JobSearchQuery {
  /** Free-text role/keyword, e.g. "frontend engineer". */
  keyword: string;
  /** Optional location filter, e.g. "London". */
  location?: string;
  /** Restrict results to remote roles. */
  remote?: boolean;
  /** Minimum annual salary filter (USD-equivalent). */
  minSalary?: number;
  /** 1-based results page number. Defaults to 1. */
  pageNumber?: number;
}

/** One job listing extracted from a search-results page. */
export interface JobListing {
  /** Stable identifier used for de-duplication across pages/runs. */
  id: string;
  title: string;
  company: string;
  location: string;
  /** Salary band as displayed on the card, when present. */
  salary?: string;
  /** Skill/company-stage tags attached to the listing. */
  tags: string[];
  /** Canonical link back to the posting. */
  url: string;
  /** Relative posting date as displayed, when present (e.g. "3 days ago"). */
  postedAt?: string;
}

/** Parsed outcome of loading one search-results page. */
export interface JobSearchResults {
  query: JobSearchQuery;
  listings: JobListing[];
  /** Whether another results page follows this one. */
  hasNextPage: boolean;
}

/** A raw HTML response owned by the client layer. */
export interface RawDocument {
  url: string;
  status: number;
  html: string;
}
