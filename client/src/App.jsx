import React from 'react'
import Navbar from './components/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import {Toaster} from "react-hot-toast"
const App = () => {
const isSellerpath=useLocation().pathname.includes("seller")

  return (
    <div>
   {isSellerpath ? null:<Navbar/>}
   <Toaster/>
    <div className={`${isSellerpath ? "":"px-6 md:px-16 1g:px-24 x1:px-32"}`}>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
    </div>
  )
}

export default App

