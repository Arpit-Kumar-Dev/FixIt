import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRupeeSign, FaTools, FaUserTie, FaMoneyCheckAlt } from "react-icons/fa";
import { motion } from "framer-motion";
// Vite
const api = import.meta.env.RAZORPAY_API_KEY;

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(location.state?.userId || localStorage.getItem("userId"));
  const [bookings, setBookings] = useState([]);
  const [serviceProviders, setServiceProviders] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .post("https://fixit-g4s1.onrender.com/api/v1/booking/UserBookings", { userId })
        .then((res) => setBookings(res.data))
        .catch((err) => console.error("Error fetching bookings:", err));
    }
  }, [userId]);

  useEffect(() => {
    axios
      .get("https://fixit-g4s1.onrender.com/api/v1/ServiceProvider/get_SP")
      .then((res) => {
        const map = res.data.reduce((acc, sp) => {
          acc[sp._id] = sp;
          return acc;
        }, {});
        setServiceProviders(map);
      })
      .catch((err) => console.error("Error fetching service providers:", err));
  }, []);

  const completedBookings = bookings.filter((b) => b.status === "Completed");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (bookingId, amount) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const orderResponse = await axios.post("https://fixit-g4s1.onrender.com/api/v1/Payment/checkout", {
        amount: amount,
      });

      const { order } = orderResponse.data;

      const options = {
        key: api,
        amount: order.amount,
        currency: order.currency,
        name: "FixIt.com",
        description: "Service Payment",
        order_id: order.id,
        handler: async function (response) {
          alert("🎉 Payment Successful!");
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);

          try {
            const paymentDetails = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            };
            setPaymentDetails(paymentDetails);
            setPaymentSuccess(true);
            await axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/ChangeStatus", {
              Id:bookingId,
              status: "Paid",
            });

            setBookings((prevBookings) =>
              prevBookings.filter((booking) => booking._id !== bookingId)
            );
          } catch (err) {
            console.error("Error updating payment status:", err);
          }
        },
        prefill: {
          name: "FixIt User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Payment initiation failed.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-green-400 mb-4">
        Completed Bookings - Payments
      </h2>

      {/* Back to Home Button */}
      <div className="flex justify-start mb-6">
        <motion.button
          onClick={() => navigate("/Home")}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔙 Back to Home
        </motion.button>
      </div>

      {paymentSuccess && paymentDetails ? (
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold mb-4">Payment Successful!</h3>
          <p className="text-lg">Payment ID: {paymentDetails.paymentId}</p>
          <p className="text-lg">Order ID: {paymentDetails.orderId}</p>
          <p className="text-lg">Signature: {paymentDetails.signature}</p>
        </div>
      ) : completedBookings.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No completed bookings yet. Maybe get something fixed? 🛠️
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {completedBookings.map((booking) => {
            const provider = serviceProviders[booking.Sp_id];
            const price = provider?.price || 0;

            return (
              <motion.div
                key={booking._id}
                className="bg-gray-900 text-white p-6 rounded-xl w-80 border border-green-400 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="flex items-center gap-2 text-lg font-semibold mb-1">
                  <FaUserTie className="text-green-400" /> {provider?.name || "Unknown"}
                </p>
                <p className="flex items-center gap-2 text-green-300 mb-1">
                  <FaTools /> Service: {booking.service}
                </p>
                <p className="flex items-center gap-2 text-yellow-300 mb-4">
                  <FaRupeeSign /> Price: ₹{price}
                </p>
                <motion.button
                  onClick={() => handlePayment(booking._id, price)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 w-full justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMoneyCheckAlt /> Pay Now
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
