import  express from "express";
import { JobSearchPage } from "./operations/jobSearchPage";
import { jobSearchResultsX } from "./operations/jobSearchResults";
import { resumeExtraction} from '../utils/utils'
import { JobApplicationModal } from "./operations/jobApplicationModel";
import {askGemini} from '../gemini'
const router =express.Router()
router.get("/check", (req,res)=>{
    console.log("server checking")
    res.status(200).json({message:"server wroking"})
})

router.get('/apply',async(req,res)=>{
    console.log("api hit")
    const filterConfiguration = await JobSearchPage()

    if(filterConfiguration.data!=undefined &&filterConfiguration.data==null){
        if(filterConfiguration.status==403){
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
    {jobId , score , reasonforscore}`
    const resumeExtracted= resumeExtraction();
     if(!resumeExtracted){
        res.status(200).json({message:"please upload the file"})
        return
    }
    for(let jd of jobs){
        let prompt= `
    compare the jd and result and score it 
    jd:${jd} ,
    resume:${resumeExtracted}`
        
        const scored=askGemini(prompt,system_prompt)
        scoredJobs.push(scored)
    }
    console.log("resumescored ")
    
    

    
   
    
    res.status(200).json({message:"success" , scoredJobs})
    return;
})

export default router