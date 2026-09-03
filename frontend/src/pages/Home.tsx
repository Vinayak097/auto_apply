import Navbar from '../component/Navbar'
import { useNavigate } from 'react-router-dom'

const applidJobs=[{name:"wellfound" ,active :true},{name:"internshall",active:false}]


const Home = () => {
  const navigate=useNavigate()
  const handleClick=(job:any)=>{
    if(!job.active) return
    navigate(`/${job.name}`)

}
  return (
    <div>
        <Navbar></Navbar>
        <p className='border'></p>
        <section className='mt-5 px-5'>
          {applidJobs.map((job)=>(
          <div onClick={()=>{handleClick(job)}}  className={`p-5 hover:cursor-pointer border m-2 border-amber-800 ${job.active? "opacity-100" : "opacity:50"} bg-amber-200`}>
              <h2>{job.name}</h2>

            </div>
          ))}

        </section>
    </div>
  )
}

export default Home