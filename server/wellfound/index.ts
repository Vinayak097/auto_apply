import  express from "express";
import { JobSearchPage } from "./operations/jobSearchPage";
import { jobSearchResultsX } from "./operations/jobSearchResults";
import { resumeExtraction} from '../utils/utils'
import { JobApplicationModal } from "./operations/jobApplicationModel";
import {askGemini} from '../gemini'
import { setTimeout } from "node:timers/promises";  
import {Match} from '../db/db'  
const router =express.Router()

router.get("/location-tags", async (req, res) => {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!query) {
        res.json({ data: [] });
        return;
    }

    try {
        const response = await fetch("https://wellfound.com/graphql", {
            method: "POST",
            headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9,mr;q=0.8",
                "apollographql-client-name": "talent-web",
                "content-type": "application/json",
                origin: "https://wellfound.com",
                priority: "u=1, i",
                referer: "https://wellfound.com/jobs",
                "sec-ch-ua": '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
                "sec-ch-ua-arch": '""',
                "sec-ch-ua-bitness": '"64"',
                "sec-ch-ua-full-version": '"152.0.7977.66"',
                "sec-ch-ua-full-version-list": '"Chromium";v="152.0.7977.66", "Not?A_Brand";v="24.0.0.0", "Google Chrome";v="152.0.7977.66"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-model": '"iPhone"',
                "sec-ch-ua-platform": '"iOS"',
                "sec-ch-ua-platform-version": '"18.5"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "same-origin",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
                "x-angellist-dd-client-referrer-resource": "/jobs",
                "x-apollo-operation-name": "LocationTagAutocompleteField",
                "x-apollo-signature": process.env.WELLFOUND_APOLLO_SIGNATURE || "",
                "x-requested-with": "XMLHttpRequest",
                "x-wf-cfp": process.env.WELLFOUND_CFP || "",
                Cookie: process.env.WELLFOUND_COOKIE || "",
            },
            body: JSON.stringify({
                operationName: "LocationTagAutocompleteField",
                variables: {
                    options: { excludeIds: ["616175"] },
                    query,
                },
                extensions: {
                    operationId: "tfe/9b79e3f292313c0d3fd7afcae87ba698b6b9f0a2a9b41038763c3f2308cf5954",
                },
            }),
        });

        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error: any) {
        res.status(502).json({
            message: "Wellfound location autocomplete failed",
            details: error.message,
        });
    }
});

router.get("/skill-tags", async (req, res) => {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!query) {
        res.json({ data: [] });
        return;
    }

    try {
        const response = await fetch("https://wellfound.com/graphql", {
            method: "POST",
            headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9,mr;q=0.8",
                "apollographql-client-name": "talent-web",
                "content-type": "application/json",
                origin: "https://wellfound.com",
                priority: "u=1, i",
                referer: "https://wellfound.com/jobs",
                "sec-ch-ua": '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
                "sec-ch-ua-arch": '""',
                "sec-ch-ua-bitness": '"64"',
                "sec-ch-ua-full-version": '"152.0.7977.66"',
                "sec-ch-ua-full-version-list": '"Chromium";v="152.0.7977.66", "Not?A_Brand";v="24.0.0.0", "Google Chrome";v="152.0.7977.66"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-model": '"iPhone"',
                "sec-ch-ua-platform": '"iOS"',
                "sec-ch-ua-platform-version": '"18.5"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "same-origin",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
                "x-angellist-dd-client-referrer-resource": "/jobs",
                "x-apollo-operation-name": "SkillTagAutocompleteField",
                "x-apollo-signature": process.env.WELLFOUND_APOLLO_SIGNATURE || "",
                "x-requested-with": "XMLHttpRequest",
                "x-wf-cfp": process.env.WELLFOUND_CFP || "",
                Cookie: process.env.WELLFOUND_COOKIE || "",
            },
            body: JSON.stringify({
                operationName: "SkillTagAutocompleteField",
                variables: { query },
                extensions: {
                    operationId: "tfe/0ca44ecafb1f994f981bac26cce2aba2fcff4ec4757fd5eb2f9cf06fc9bf29bf",
                },
            }),
        });

        const result = await response.json();
        res.status(response.status).json(result);
    } catch (error: any) {
        res.status(502).json({
            message: "Wellfound skill autocomplete failed",
            details: error.message,
        });
    }
});
router.get("/check", (req,res)=>{
    console.log("server checking")
    res.status(200).json({message:"server wroking"})
})

router.get('/apply',async(req,res)=>{
    console.log("api hit")
    const filterConfiguration = await JobSearchPage()

    if("data" in filterConfiguration && filterConfiguration.data==null){
        if("status" in filterConfiguration && filterConfiguration.status==403){
            res.status(403).json({message:"please reset your cookiet token"})
            return
        }
        
        res.status(404).json({
            message:"failed to apply "
        })
        return 
    }
    console.log("jobsearchpage")
    const result=await jobSearchResultsX(filterConfiguration)
    if(!result){
        res.status(400).json({message:"fialed to apply"})
    }
    if(result.status==403 ){
        res.status(403).json({message:"failed to apply pls try reset your apollo signature"})
        return 
    }
    
    let jobs=[]
    
    for(let job of result.jobs){
        const jd = await JobApplicationModal(job)
        jobs.push(jd)
    }
    console.log("jobApplicationmodel")
    let scoredJobs=[]
    let system_prompt = `your assitent who checks the resume and jd and give the match score to them so i can choose to apply 
    and score them in 1 to 100 okay 
    and please match this like the all required things are passed it should at least get 90+ marks 
    and the response i want in is that 
    {jobId , score , reasonforscore}
    
    do not add extra fileds in the response 
    if u fond no jd u can give the empyt object only
    in the ans i only want object as response`
    const resumeExtracted= await resumeExtraction();
     if(!resumeExtracted){
        res.status(200).json({message:"please upload the file"})
        return
    }
    for(let jd of jobs){
        let prompt= `
    compare the jd and result and score it 
    jd:${JSON.stringify(jd?.data)} ,
    resume:${resumeExtracted}`
        
        const scored=await askGemini(prompt,system_prompt)
console.log('scored one ' , scored)
await setTimeout(11000);
        scoredJobs.push(scored)
    }

    const s = await Match.insertMany(scoredJobs)
    console.log("resumescored, and inserted in the db ")
    
    res.status(200).json({message:"success" , scoredJobs})
    return;
})

router.get("/wellfound/test" , async(req,res)=>{
    try{
        const resumeT=await  resumeExtraction()
        res.status(200).json({message:resumeT})
    }
    catch(e){
        res.status(404).json({message:e.message})
    }
    

})
export default router