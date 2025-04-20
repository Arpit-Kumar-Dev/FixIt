import { useState } from 'react'
// import Login from './components/Login'
import Signup from './components/Signup'
import Booking from './components/Booking'
import Profile from './components/Profile'
import SPSignup from './components/SPSignup'
import SPLogin from './components/SPLogin'
import Sphome from './components/Sphome'
import Home from "./components/Home";
import MainHome from './components/MainHome'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
        <Routes>
            <Route path="/" element={<MainHome/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/Profile" element={<Profile/>}/>
            <Route path="/SPsignup" element={<SPSignup/>}/>
            <Route path="/SPLogin" element={<SPLogin/>}/>
            <Route path="/Sphome" element={<Sphome/>}/>
            <Route path="/bookings" element={<Booking/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    </Router>
);
}

export default App
