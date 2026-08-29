const axios = require('axios');


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
    'referer': 'https://wellfound.com/jobs?job_listing_slug=4634678-full-stack-engineer-founding-team-0-2-years', 
    'sec-ch-ua': '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"', 
    'sec-ch-ua-arch': '"x86"', 
    'sec-ch-ua-bitness': '"64"', 
    'sec-ch-ua-full-version': '"151.0.7922.175"', 
    'sec-ch-ua-full-version-list': '"Not=A?Brand";v="99.0.0.0", "Google Chrome";v="151.0.7922.175", "Chromium";v="151.0.7922.175"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-model': '""', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-ch-ua-platform-version': '"19.0.0"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'same-origin', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 
    'x-angellist-dd-client-referrer-resource': '/jobs', 
    'x-apollo-operation-name': 'JobApplicationModal', 
    'x-apollo-signature': '1788008516-Q53FN4GNx9TVnrVxGWqcOR578FazH4pSM%2BPqDdBcTTg%3D', 
    'x-requested-with': 'XMLHttpRequest', 
    'x-wf-cfp': '90d9e126cb676f6d842598f62b8f6441', 
    'Cookie': 'wellfound_default_consent=1|implied-full; ajs_anonymous_id=9a99c417-3b52-4813-b3d5-bad99e53df69; ajs_user_id=17126287; rl_anonymous_id=RS_ENC_v3_IjlhOTljNDE3LTNiNTItNDgxMy1iM2Q1LWJhZDk5ZTUzZGY2OSI%3D; rl_page_init_referrer=RS_ENC_v3_IiRkaXJlY3Qi; _wellfound=41b7d5dfcd878840488e541f1bea9b70.i; rl_user_id=RS_ENC_v3_IjE5NjE2NjI0Ig%3D%3D; datadome=aY_iBHVu31k1a9PzhT~Mmbn0m_QLE81TUZIRCpQgscXIdd8kDfDcV3gANSK8IIHAoY99Ttit3F9bQ3TgtnjOwig52E8gMdDAvH5s8kQICG5mt3I_R1c2_DovozVp9CBm; _ga=GA1.1.385948418.1787736701; _iidt=zTj2ZwjQvPiWw5JkqkuwDKgkLEbmm+wCBRCApvloZW1nVhfi35fo/doY6/SNNWDCHDfw9Pl8WZit2Q==; _vid_t=EkPr7uf2NeEbiv6hwJZ9BSBBqbCr9VxdLRvMjplMT/4X3/PcZpsPN+nMtQ5AraB3wcWhE6AZmZ3saw==; _clck=msg5gd%5E2%5Eg90%5E1%5E2408; TAsessionID=3125f4be-644a-464a-9c65-d72daca5261b|NEW; cf_clearance=MCXtWeUJGLfEBoqyVgNLSPo4kETcKzDmEzbLO7sHoHk-1788008380-1.2.1.1-TA8Wjykx8w9XNqLwLPhu7e7qoaVgcnkufDcinZEbrb6g8I3g1m8i2g6LVYfiwPqSsZ44K2zJWElHA2Oj2yWZPgE9x9yG65F8ZzxcRlT.AgFHPoYumQwc8vfcLoQJw07pB1gfWbBtmqwUZXtOafzWQDHRLgydihLWuHYdfsBQTza0XD8jfMLeDac_WiKUxiBL.uPJ44jbvYppYcNV9HqWmZ39qETmXzZU6XaBpM0Bcoc1qHeBS2XLJsew26FtQMJGi1x6mSUaMxVAKQD7yzjWgQAQVE_ANTWt7dr0tSh9be9jvsa2e_u5r4XSvokz4EA8G2AkiP9u0IQfG0IR05CZiXP5kjTpSAb2GXHX4RlguC6x3xUH2qHxBNt_B806fKJE.jN0BizGzjxnJdTdK4OzF.GVkg1JUNr06krCEuSM7im.3dEke6F_juusaYCFy1pg; rl_trait=RS_ENC_v3_eyJuYW1lIjoiVmluYXkgSW5qYW11cmUiLCJmaXJzdF9uYW1lIjoiVmluYXkiLCJsYXN0X25hbWUiOiJJbmphbXVyZSIsImVtYWlsIjoidmluYXlhazc1c2NvcmVAZ21haWwuY29tIiwiZW1haWxfc3RhdHVzIjoiYWN0aXZlIiwicHJvZmlsZV91cmwiOiJodHRwczovL3dlbGxmb3VuZC5jb20vdmluYXktaW5qYW11cmUtMSIsImNyZWF0ZWRfYXQiOiIyMDI1LTA1LTA0VDA0OjUzOjQ1LjAwMCswMDowMCIsImlzX3JlY3J1aXRlciI6ZmFsc2UsImlzX2NhbmRpZGF0ZSI6dHJ1ZSwiaXNfY2FuZGlkYXRlX3N1Y2Nlc3MiOnRydWUsImlzX2FkbWluIjpmYWxzZSwiaXNfYmFubmVkIjpmYWxzZSwiY3VycmVudF9jb21wYW55IjoiRmlzaHlIdWIiLCJjYW5kaWRhdGVfcHJpbWFyeV9yb2xlIjoiRnVsbC1TdGFjayBFbmdpbmVlciIsInllYXJzX2V4cGVyaWVuY2VfaW5fcHJpbWFyeV9yb2xlIjowLCJqb2Jfc2VhcmNoX3N0YXR1cyI6ImludGVydmlld2luZyIsInByaW1hcnlfbG9jYXRpb24iOiJCYW5nYWxvcmUgVXJiYW4iLCJwcmltYXJ5X2xvY2F0aW9uX2NvdW50cnkiOiJJbmRpYSIsImNhbmRpZGF0ZV9sb2NhdGlvbl90YWdzIjpbIkJhbmdhbG9yZSBVcmJhbiJdLCJjYW5kaWRhdGVfaW50ZXJlc3RlZF9sb2NhdGlvbnMiOlsiQmVuZ2FsdXJ1IiwiQ29sb21iaWEiLCJEZWxoaSIsIkd1cmdhb24iLCJQdW5lIiwiSHlkZXJhYmFkIiwiQ2hhbmRpZ2FyaCIsIkNoZW5uYWkiLCJKYWlwdXIiLCJCYW5na29rIiwiQWhtZWRhYmFkIiwiU3VyYXQiLCJJbmRvcmUiLCJNdW1iYWkiLCJGYXJpZGFiYWQiLCJOb2lkYSIsIlB1bmphYiIsIkhpbWFjaGFsIFByYWRlc2giLCJHb2EiLCJOZXcgRGVsaGkiLCJNdXNjYXQiLCJHcmVhdGVyIE5vaWRhIiwiTHVja25vdyIsIk5hdmkgTXVtYmFpIiwiQmFuZ2Fsb3JlIFVyYmFuIiwiWW9rbmUnYW0gSWxsaXQiLCJHdXJ1Z3JhbSIsIkJlbmdhbHVydSIsIkNoZW5uYWkiLCJWaXNha2hhcGF0bmFtIl0sImNhbmRpZGF0ZV9yb2xlX3RhZ3MiOlsiRnVsbC1TdGFjayBFbmdpbmVlciIsIlNvZnR3YXJlIEVuZ2luZWVyIiwiQmFja2VuZCBFbmdpbmVlciJdLCJjYW5kaWRhdGVfcmVtb3RlX3dvcmtfcHJlZmVyZW5jZSI6ZmFsc2UsImNhbmRpZGF0ZV9kZXNpcmVkX3NhbGFyeSI6MzAwMDAsImNhbmRpZGF0ZV9kZXNpcmVkX3NhbGFyeV9jdXJyZW5jeSI6IklOUiIsImNhbmRpZGF0ZV9sYXN0X2FjdGl2ZV9hdCI6IjIwMjYtMDgtMjlUMDM6MzY6MzUuMDAwKzAwOjAwIiwiY2FuZGlkYXRlX3F1YWxpdHkiOiJpbmNvbXBsZXRlX2NhbmRpZGF0ZSIsImFsaXN0X3ByZXZpb3VzbHlfaW52aXRlZCI6ZmFsc2UsImxhc3RfbG9naW5fYXQiOiIyMDI2LTA1LTE5VDA1OjI4OjMyLjAwMCswMDowMCIsImVsaWdpYmxlX2Zvcl9hbF9lbGl0ZSI6ZmFsc2V9; notice_behavior=implied|as; _clsk=19rtcdh%5E1788009065141%5E14%5E1%5Eb.clarity.ms%2Fcollect; rl_session=RS_ENC_v3_eyJhdXRvVHJhY2siOnRydWUsInRpbWVvdXQiOjE4MDAwMDAsImV4cGlyZXNBdCI6MTc4ODAxMDg2NTUwMywiaWQiOjE3ODgwMDgzODA2MzIsInNlc3Npb25TdGFydCI6ZmFsc2V9; _ga_705F94181H=GS2.1.s1788008381^$o10^$g1^$t1788009065^$j10^$l0^$h0; _mkra_stck=b676bd460eba88cad0784e62c938bfb2%3A1788018355.7498322; _wellfound=41b7d5dfcd878840488e541f1bea9b70.i'
  }

};
export async function JobApplicationModal(jobId:any){
    
    let data = JSON.stringify({
  "operationName": "JobApplicationModal",
  "variables": {
    "jobListingId": jobId.id
  },
  
  "extensions": {
    "operationId": "tfe/f4c70cbe1f045b5c06c22d1dea14819813abd702dd0b213999b3ea8c0538483c"
  }
});
config[data]=data;
    try{
        const response = await axios.request("https://wellfound.com/graphql",config)
        return response.data;
    }catch(e){
        console.log("error here " , data )
        if(e.status==403){
            return {data:null,message:"replace the token"}
        }
        return e 
    }
}

