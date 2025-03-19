import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'
export default function Sphome() {

    const[SP,setSP]=useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }

            setSP({
                id: decoded._id || "N/A",
                name: decoded.name || "N/A",
                email: decoded.email || "N/A",
                profilePic: decoded.imageURL || `https://api.dicebear.com/7.x/initials/svg?seed=${decoded.name}`,
            });
        } catch (error) {
            localStorage.removeItem("token");
            navigate("/");
        }
    }, [navigate]);
  return (
    <>   
        <h1>welcome {SP.name}</h1>
        <img src={SP.imageURL} alt="" />
         
    
    </>
  )
}
