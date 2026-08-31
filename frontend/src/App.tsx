import { useState } from 'react'
import './App.css'
import { BrowserRouter , Routes , Route  } from 'react-router-dom'
import Home from './pages/Home'
function App() {
  
  


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/route  "></Route>

      </Routes></BrowserRouter>
    
      
    </>
  )
}

export default App
