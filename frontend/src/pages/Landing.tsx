import React, { useEffect } from 'react'
import Auth from '../component/Auth'
import { useSelector } from 'react-redux'
import { redirect, useNavigate } from 'react-router-dom'

const Landing = () => {
    const user = useSelector(state=>state.user)
    const navigate=useNavigate()
    console.log("landing here setlting the user " , user)
    useEffect(()=>{ 
        if(user){


            navigate('/home')
        }
    },[user])

  return (
    <div>
        <Auth></Auth>
    </div>
  )
}

export default Landing