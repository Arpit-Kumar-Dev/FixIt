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
        email: decoded.email || "N/A",
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      {SP ? (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
          <img
            src={SP.profilePic}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500"
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            Welcome, {SP.name} 👋
          </h1>
          <p className="text-gray-600">{SP.email}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/SPlogin");
            }}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-xl text-gray-700">Loading...</p>
      )}
    </div>
  );
}
