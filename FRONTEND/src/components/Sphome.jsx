import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaClock, FaTimes, FaExchangeAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Sphome() {
  const [SP, setSP] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [otpInput, setOtpInput] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
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
      fetchBookings(spData.id);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const fetchBookings = (spId) => {
    if (spId) {
      axios
        .post("https://fixit-g4s1.onrender.com/api/v1/booking/SPBookings", {
          SPId: spId,
        })
        .then((res) => setBookings(res.data || []))
        .catch((err) => console.error("Fetch error:", err));
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/DeleteBookings", { bookingId });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  const handleChangeStatus = async (bookingId, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Confirmed" : "Pending";
    try {
      await axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/ChangeStatus", {
        Id: bookingId,
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Status change error:", error);
    }
  };

  const sendOTP = async (bookingId) => {
    try {
      await axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/sendOTP", { bookingId });
      setSelectedBookingId(bookingId);
      alert("OTP sent to customer successfully.");
    } catch (error) {
      console.error("OTP send error:", error);
    }
  };

  const verifyOTPAndMarkComplete = async () => {
    try {
      await axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/verifyOTP", {
        bookingId: selectedBookingId,
        otp: otpInput,
      });

      await axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/ChangeStatus", {
        Id: selectedBookingId,
        status: "Completed",
      });

      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBookingId ? { ...b, status: "Completed" } : b
        )
      );
      setOtpInput("");
      setSelectedBookingId(null);
      alert("Booking marked as completed.");
    } catch (error) {
      alert("OTP verification failed. Please try again.");
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
              <li onClick={() => navigate("/Sphome")} className="cursor-pointer hover:text-red-500 hover:underline">
                Dashboard
              </li>
              <li onClick={() => navigate("/SPbookings")} className="cursor-pointer hover:text-red-500 hover:underline">
                Bookings
              </li>
              <li onClick={() => navigate("/SPprofile")} className="cursor-pointer hover:text-red-500 hover:underline">
                Profile
              </li>
            </ul>
          </div>
        )}
        <div className="flex items-center gap-6">
          <div className="text-2xl font-extrabold text-red-500 tracking-widest">FixIt<span className="text-white">.com</span></div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/SPlogin");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-10">
        <h2 className="text-3xl font-bold text-red-500 mb-6">Your Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings found. But don’t worry—fortune favors the consistent 🤝</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold text-white">Service: {booking.service}</h3>
                <p className="text-gray-400">Booking ID: {booking._id}</p>
                <p className="text-gray-400">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
                <p className={`font-bold ${booking.status === "Pending" ? "text-yellow-400" : booking.status === "Confirmed" ? "text-green-400" : "text-blue-400"}`}>
                  <FaClock className="inline-block mr-2" />
                  Status: {booking.status}
                </p>

                <div className="text-sm text-gray-300 mt-2">
                  <p><strong>Customer:</strong> {booking.customer?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {booking.customer?.email || "N/A"}</p>
                  <p><strong>Phone:</strong> {booking.customer?.phone || "N/A"}</p>
                  {booking.customer?.address?.length > 0 && (
                    <>
                      <p><strong>Area:</strong> {booking.customer.address[0].area}</p>
                      <p><strong>City:</strong> {booking.customer.address[0].city}</p>
                      <p><strong>State:</strong> {booking.customer.address[0].state}</p>
                      <p><strong>Pincode:</strong> {booking.customer.address[0].pincode}</p>
                    </>
                  )}
                </div>

                <div className="mt-2 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTimes /> Cancel
                    </motion.button>

                    <motion.button
                      onClick={() => handleChangeStatus(booking._id, booking.status)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1 rounded-md flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExchangeAlt /> Change Status
                    </motion.button>
                  </div>
                  {booking.status === "Confirmed" && (
                    <>
                      <input
                        type="text"
                        value={selectedBookingId === booking._id ? otpInput : ""}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="Enter OTP"
                        className="mt-2 px-3 py-1 text-black rounded-md w-full"
                      />
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => sendOTP(booking._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Send OTP
                        </motion.button>

                        <motion.button
                          onClick={verifyOTPAndMarkComplete}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={selectedBookingId !== booking._id}
                        >
                          <FaCheckCircle /> Mark Completed
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}