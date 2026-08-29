import  express from "express";
import { JobSearchPage } from "./operations/jobSearchPage";
import { jobSearchResultsX } from "./operations/jobSearchResults";
import {pdfExtraction, resumeExtraction} from '../utils/utils'
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
    const result=await jobSearchResultsX(filterConfiguration)
    if(!result){
        res.status(400).json({message:"fialed to apply"})
    }
    if(result.status==403 ){
        res.status(403).json({message:"failed to apply pls try reset your apollo signature"})
        return 
    }
    
    const resumeExtracted= resumeExtraction();
    if(!resumeExtracted){
        res.status(200).json({message:"please upload the file"})
        return
    }
    
    res.status(200).json({message:"success" , result})
    return;
})

export default router