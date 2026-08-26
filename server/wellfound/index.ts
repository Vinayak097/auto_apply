import { jobSearchResultsX } from "./operations/jobSearchResults";
import { buildJobSearchFilter } from "./parser";





const axios = require('axios');
let data = JSON.stringify({
  "operationName": "JobSearchPage",
  "variables": {
    "location": "temp until we fetch from location",
    "userId": "19616624"
  },
  "extensions": {
    "operationId": "tfe/4832374e4950b2762c913ea6af33741781f80929c12faaebdfbd423f02b918a2"
  }
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://wellfound.com/graphql',
  headers: { 
    'accept': '*/*', 
    'accept-language': 'en-US,en;q=0.9,mr;q=0.8', 
    'apollographql-client-name': 'talent-web', 
    'content-type': 'application/json', 
    'origin': 'https://wellfound.com', 
    'priority': 'u=1, i', 
    'referer': 'https://wellfound.com/jobs', 
    'sec-ch-device-memory': '8', 
    'sec-ch-ua': '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"', 
    'sec-ch-ua-arch': '"x86"', 
    'sec-ch-ua-full-version-list': '"Not=A?Brand";v="99.0.0.0", "Google Chrome";v="151.0.7922.174", "Chromium";v="151.0.7922.174"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-model': '""', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'same-origin', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 
    'x-angellist-dd-client-referrer-resource': '/jobs', 
    'x-apollo-operation-name': 'JobSearchPage', 
    'x-apollo-signature': '1787736719-SDqD9vt7O%2FOobXpZ2Z%2B7tOb8oslyfS39zpIybg%2Byoeo%3D', 
    'x-requested-with': 'XMLHttpRequest', 
    'x-wf-cfp': '90d9e126cb676f6d842598f62b8f6441', 
    'Cookie': 'wellfound_default_consent=1|implied-full; ajs_anonymous_id=9a99c417-3b52-4813-b3d5-bad99e53df69; ajs_user_id=17126287; rl_anonymous_id=RS_ENC_v3_IjlhOTljNDE3LTNiNTItNDgxMy1iM2Q1LWJhZDk5ZTUzZGY2OSI%3D; rl_page_init_referrer=RS_ENC_v3_IiRkaXJlY3Qi; _wellfound=41b7d5dfcd878840488e541f1bea9b70.i; rl_user_id=RS_ENC_v3_IjE5NjE2NjI0Ig%3D%3D; datadome=aY_iBHVu31k1a9PzhT~Mmbn0m_QLE81TUZIRCpQgscXIdd8kDfDcV3gANSK8IIHAoY99Ttit3F9bQ3TgtnjOwig52E8gMdDAvH5s8kQICG5mt3I_R1c2_DovozVp9CBm; _iidt=TyvSO10aAsTf7lJapewEoNELROI/UDH0caJR4iLVei8D56Xeov7CeMjpjC6uEJlsEXjDQeZtXpMLDA==; _vid_t=6ONFk98dAiBBsUknqCYYNZ1MQNIJsu9X2eDEMRI1UyTVy9SWCbNiq96aJdP9NTvvev4nJYAYcBuQkQ==; cf_clearance=G1VReeYQSLR2w20F_Kq7JyOVeiZGOsecrv3m6QX2.9k-1787736698-1.2.1.1-ddZWBYNDXNHqxauF0aIN52fAgpicwkduzyCcyIsI5WOOlBjaUL2Jqrczu3rl0VhAJaBAC15sEUVNKoxW3M9TaB6Gskx4tm8fS2pm3I6RqI4pOR0rnYUoOxlHOlvfFYUyTi2CcBjGHK1C.m5ThrePlTZMYYs3_oOmeY0qzaMIWGcWZxNDrC4XAOc9fpYpPp2PDmGS.wDGNac6BQTLdMlYen4Am6wqugNF.rtTMOsWXD0XSa5Q1HrCU5zu7hN8kIT5NYsKpIbeb7izLAnd42boEYz0x6ZAFpwv7Mp.91REg7XJA9CPLxGQyWxrJFVQpvBJb0UOxO4XTmu7u6di7gSa341LLYXDt1aHkWuVp082aqc; TAsessionID=d71024f2-3165-48ed-b7d2-240bcb0d6742|NEW; notice_behavior=implied|as; _clck=msg5gd%5E2%5Eg8x%5E1%5E2408; rl_trait=RS_ENC_v3_eyJuYW1lIjoiVmluYXkgSW5qYW11cmUiLCJmaXJzdF9uYW1lIjoiVmluYXkiLCJsYXN0X25hbWUiOiJJbmphbXVyZSIsImVtYWlsIjoidmluYXlhazc1c2NvcmVAZ21haWwuY29tIiwiZW1haWxfc3RhdHVzIjoiYWN0aXZlIiwicHJvZmlsZV91cmwiOiJodHRwczovL3dlbGxmb3VuZC5jb20vdmluYXktaW5qYW11cmUtMSIsImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTA0VDA0OjUzOjQ1LjAwMCswMDowMCIsImlzX3JlY3J1aXRlciI6ZmFsc2UsImlzX2NhbmRpZGF0ZSI6dHJ1ZSwiaXNfY2FuZGlkYXRlX3N1Y2Nlc3MiOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNfYmFubmVkIjpmYWxzZSwiY3VycmVudF9jb21wYW55IjoiRmlzaHlIdWIiLCJjYW5kaWRhdGVfcHJpbWFyeV9yb2xlIjoiRnVsbC1TdGFjayBFbmdpbmVlciIsInllYXJzX2V4cGVyaWVuY2VfaW5fcHJpbWFyeV9yb2xlIjowLCJqb2Jfc2VhcmNoX3N0YXR1cyI6ImludGVydmlld2luZyIsInByaW1hcnlfbG9jYXRpb24iOiJCYW5nYWxvcmUgVXJiYW4iLCJwcmltYXJ5X2xvY2F0aW9uX2NvdW50cnkiOiJJbmRpYSIsImNhbmRpZGF0ZV9sb2NhdGlvbl90YWdzIjpbIkJhbmdhbG9yZSBVcmJhbiJdLCJjYW5kaWRhdGVfaW50ZXJlc3RlZF9sb2NhdGlvbnMiOlsiQmVuZ2FsdXJ1IiwiQ29sb21iaWEiLCJEZWxoaSIsIkd1cmdhb24iLCJQdW5lIiwiSHlkZXJhYmFkIiwiQ2hhbmRpZ2FyaCIsIkNoZW5uYWkiLCJKYWlwdXIiLCJCYW5na29rIiwiQWhtZWRhYmFkIiwiU3VyYXQiLCJJbmRvcmUiLCJNdW1iYWkiLCJGYXJpZGFiYWQiLCJOb2lkYSIsIlB1bmphYiIsIkhpbWFjaGFsIFByYWRlc2giLCJHb2EiLCJOZXcgRGVsaGkiLCJNdXNjYXQiLCJHcmVhdGVyIE5vaWRhIiwiTHVja25vdyIsIk5hdmkgTXVtYmFpIiwiQmFuZ2Fsb3JlIFVyYmFuIiwiWW9rbmUnYW0gSWxsaXQiLCJHdXJ1Z3JhbSIsIkJlbmdhbHVydSIsIkNoZW5uYWkiLCJWaXNha2hhcGF0bmFtIl0sImNhbmRpZGF0ZV9yb2xlX3RhZ3MiOlsiRnVsbC1TdGFjayBFbmdpbmVlciIsIlNvZnR3YXJlIEVuZ2luZWVyIiwiQmFja2VuZCBFbmdpbmVlciJdLCJjYW5kaWRhdGVfcmVtb3RlX3dvcmtfcHJlZmVyZW5jZSI6ZmFsc2UsImNhbmRpZGF0ZV9kZXNpcmVkX3NhbGFyeSI6MzAwMDAsImNhbmRpZGF0ZV9kZXNpcmVkX3NhbGFyeV9jdXJyZW5jeSI6IklOUiIsImNhbmRpZGF0ZV9sYXN0X2FjdGl2ZV9hdCI6IjIwMjYtMDgtMjNUMTc6MzA6MTMuMDAwKzAwOjAwIiwiY2FuZGlkYXRlX3F1YWxpdHkiOiJpbmNvbXBsZXRlX2NhbmRpZGF0ZSIsImFsaXN0X3ByZXZpb3VzbHlfaW52aXRlZCI6ZmFsc2UsImxhc3RfbG9naW5fYXQiOiIyMDI2LTA1LTE5VDA1OjI4OjMyLjAwMCswMDowMCIsImVsaWdpYmxlX2Zvcl9hbF9lbGl0ZSI6ZmFsc2V9; _ga=GA1.1.385948418.1787736701; _clsk=1xs4sfm%5E1787736703820%5E2%5E1%5Ea.clarity.ms%2Fcollect; rl_session=RS_ENC_v3_eyJpZCI6MTc4NzczNjY5OTg0OSwiZXhwaXJlc0F0IjoxNzg3NzM4NTAzOTQyLCJ0aW1lb3V0IjoxODAwMDAwLCJhdXRvVHJhY2siOnRydWUsInNlc3Npb25TdGFydCI6ZmFsc2V9; _ga_705F94181H=GS2.1.s1787736701^$o1^$g1^$t1787736720^$j41^$l0^$h0; _mkra_stck=b676bd460eba88cad0784e62c938bfb2%3A1787748133.1296096; _wellfound=41b7d5dfcd878840488e541f1bea9b70.i'
  },
  data : data
};

axios.request(config)
.then(async(response:any) => {
  const defaultFilter =
  response.data.data.currentUser
    .jobSearchEnvironment.defaultFilterConfiguration;
    
const filterConfiguration =
  buildJobSearchFilter(defaultFilter);

console.dir(filterConfiguration, { depth: null });
const result =await jobSearchResultsX(filterConfiguration)
const jobs=result.jobs
fs.writeFileSync("jobs.json",JSON.stringify(jobs,null,2),"utf-8")
console.log("jobs : " , result.jobs)
})



.catch((error:any) => {
  console.log(error.response?.data || error.message);
});

import fs from 'fs'