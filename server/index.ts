import express from 'express'
const app =express()
import wellfoundRouter from './wellfound/index'

app.use("/wellfound",wellfoundRouter)

app.get("/healthy",(req,res)=>{
    res.status(200).json({message:"server is healthy"})
})

app.listen(3001, ()=>{
    console.log("hello")
})