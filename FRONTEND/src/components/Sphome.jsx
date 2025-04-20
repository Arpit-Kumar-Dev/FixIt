import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Sphome() {
  const [SP, setSP] = useState(null);
  const [bookings, setBookings] = useState([]);
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

      const spData = {
        id: decoded._id || "N/A",
        name: decoded.name || "N/A",
        email: decoded.email || "N/A",
        profilePic:
          decoded.Profile_imageUrl ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${decoded.name}`,
      };

      setSP(spData);

      // 🧾 Fetch bookings for this SP
      fetchBookings(decoded._id);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const fetchBookings = async (spId) => {
    try {
      const response = await axios.post(
        "https://fixit-g4s1.onrender.com/api/v1/booking/SPBookings",
        { spId: spId } // Adjust this key according to your backend expectations
      );
      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <nav className="w-full px-10 py-5 flex justify-between items-center bg-black bg-opacity-50 backdrop-blur-md shadow-md z-50">
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

      <div className="p-10">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {booking.serviceName}
                </h3>
                <p className="text-gray-400">Client: {booking.clientName}</p>
                <p className="text-gray-400">Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p className="text-gray-400">Status: {booking.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
