import express from 'express'
import { User } from '../db/user'
const router = express.Router()

router.post("/login",async(req,res)=>{
    const payload= req.body
    if(!payload.email){
        res.status(400).json({success:false, message:"enter  a valid email"})

    }
    try{
    const user=await User.find({email:payload.email})
    if(!user){
        res.status(400).json({success:false,message:"login with email"})
        return
    }
    

        
    }catch(e){
        res.status(500).json({success:false,message:"Internal server error"})
        return
    }
})

export default router