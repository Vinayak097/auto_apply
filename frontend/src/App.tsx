
import './App.css'
import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Wellfound from './pages/Wellfound'

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing></Landing>}></Route>
      <Route path='/home' element={<Home></Home>}></Route>
      <Route path="wellfound" element={<Wellfound></Wellfound>}></Route>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
