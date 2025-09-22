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
import SPBooking from './components/SPBooking'
import Payment from './components/Payment'
import Seprate from './components/Seprate'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
function App() {
  

  return (
    <Router>
        <Routes>
            <Route path="/" element={<MainHome/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/Seprate" element={<Seprate/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/Profile" element={<Profile/>}/>
            <Route path="/SPsignup" element={<SPSignup/>}/>
            <Route path="/SPLogin" element={<SPLogin/>}/>
            <Route path="/Sphome" element={<Sphome/>}/>
            <Route path="/Spcompletedbooking" element={<SPBooking/>}/>
            <Route path="/bookings" element={<Booking/>}/>
            <Route path="/Payment" element={<Payment/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    </Router>
);
}

export default App
