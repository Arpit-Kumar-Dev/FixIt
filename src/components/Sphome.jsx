import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sphome() {
  const [SP, setSP] = useState(null);
  const navigate = useNavigate();

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
        email: decoded.email || "N/A", // still kept in state if needed later
        profilePic:
          decoded.Profile_imageUrl ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${decoded.name}`,
      });
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      
      {/* 🧭 Navigation Bar */}
      <nav className="w-full px-10 py-5 flex justify-between items-center bg-black bg-opacity-50 backdrop-blur-md shadow-md z-50">
        
        {/* 🔗 Left: Profile Info + Nav Links */}
        {SP && (
          <div className="flex items-center gap-6">
            <img
              src={SP.profilePic}
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-red-500 object-cover"
            />
            <h2 className="text-2xl font-bold text-white">{SP.name}</h2>
            <ul className="flex gap-6 ml-10 text-lg font-medium">
              <li
                onClick={() => navigate("/Sphome")}
                className="cursor-pointer hover:text-red-500 transition duration-300 hover:underline underline-offset-8 decoration-red-500"
              >
                Dashboard
              </li>
              <li
                onClick={() => navigate("/SPbookings")}
                className="cursor-pointer hover:text-red-500 transition duration-300 hover:underline underline-offset-8 decoration-red-500"
              >
                Bookings
              </li>
              <li
                onClick={() => navigate("/SPprofile")}
                className="cursor-pointer hover:text-red-500 transition duration-300 hover:underline underline-offset-8 decoration-red-500"
              >
                Profile
              </li>
            </ul>
          </div>
        )}

        {/* 🚪 Right: Brand + Logout */}
        <div className="flex items-center gap-6">
          <div className="text-2xl font-extrabold text-red-500 tracking-widest">
            FixIt<span className="text-white">.com</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/SPlogin");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg transition duration-300 font-semibold"
          >
            Logout
          </button> 
        </div>
      </nav>

      {/* 🌌 Body Content Placeholder */}
      <div className="flex items-center justify-center h-[80vh] text-gray-300 text-xl">
        Welcome to your dashboard, {SP?.name || "Loading..."} 👨‍🔧
      </div>
    </div>
  );
}
