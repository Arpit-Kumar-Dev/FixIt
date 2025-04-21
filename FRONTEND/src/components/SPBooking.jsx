import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SPBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const { _id } = JSON.parse(atob(token.split(".")[1])); // quick decode
      axios
        .post("https://fixit-g4s1.onrender.com/api/v1/booking/SP_completed_Bookings", { sp_id: _id })
        .then((res) => {
          setBookings(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch bookings.");
          setLoading(false);
        });
    } catch (err) {
      setError("Invalid token format.");
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Completed Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-400">No completed bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="bg-gray-800 p-4 rounded-xl shadow">
              <p><strong>Customer:</strong> {booking.customerName}</p>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Location:</strong> {booking.location}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()} - {booking.time}</p>
              <p><strong>Status:</strong> <span className="text-green-400 font-semibold">{booking.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
