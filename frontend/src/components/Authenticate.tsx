import React, { useState } from 'react'
import type { FormEvent } from 'react'
const Authenticate = () => {
    const [login,setLogin] =useState(true)

    const [name ,setName] = useState(true)
    const [email,setEmail] =useState("")
    const [password,setPassword]=useState("")
    const [repass,setRepass] =useState("")
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        console.log({
            email,
            password
        } )
    }

    return (
    <div>
        <form >
            
            <input placeholder='email ' onChange={(e)=>{setEmail(e.target.value)}}></input>
            <input placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}></input>
            <input placeholder='repass' onChange={(e)=>{setRepass(e.target.value)}}></input>
            <button type="submit"> Submit</button>

        </form>
    </div>
    )
}

export default Authenticate