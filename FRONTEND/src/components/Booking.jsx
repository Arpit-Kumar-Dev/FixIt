import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserTie, FaTools, FaClock, FaTimes, FaExchangeAlt, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(location.state?.userId || localStorage.getItem("userId"));
    const [bookings, setBookings] = useState([]);
    const [serviceProviders, setServiceProviders] = useState({});

    useEffect(() => {
        if (userId) {
            axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/UserBookings", { userId })
                .then(response => setBookings(response.data))
                .catch(error => console.error("Error fetching bookings", error));
        }
    }, [userId]);

    useEffect(() => {
        axios.get("https://fixit-g4s1.onrender.com/api/v1/ServiceProvider/get_SP")
            .then(response => {
                const providerMap = response.data.reduce((acc, provider) => {
                    acc[provider._id] = provider;
                    return acc;
                }, {});
                setServiceProviders(providerMap);
            })
            .catch(error => console.error("Error fetching service providers", error));
    }, []);

    const handleCancel = async (bookingId) => {
        try {
            await axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/DeleteBookings", { bookingId });
            setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        } catch (error) {
            console.error("Error canceling booking:", error.response?.data || error);
        }
    };

    const isDataLoaded = bookings.length > 0 && Object.keys(serviceProviders).length > 0;
    return (
        <div className="p-6 bg-gradient-to-br from-black via-gray-900 to-gray-800 min-h-screen">
            <motion.button
                className="absolute top-6 left-6 flex items-center gap-2 text-red-400 hover:text-red-500 transition-all duration-300"
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FaArrowLeft size={20} />
                <span className="text-lg font-semibold">Back</span>
            </motion.button>
            <motion.h2 
                className="text-red-500 text-3xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Your Bookings
            </motion.h2>
            {isDataLoaded ? (
                <motion.div 
                    className="flex flex-wrap gap-4 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {bookings.map((booking) => {
                        const provider = serviceProviders[booking.SPId];
                        return (
                            <motion.div 
                                key={booking._id} 
                                className="bg-gray-900 p-6 rounded-xl shadow-lg w-80 flex flex-col items-start border-2 border-red-500"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-white font-semibold flex items-center gap-2">
                                    <FaUserTie className="text-red-500" /> Service Provider: {provider ? provider.name : "Unknown"}
                                </p>
                                <p className="text-red-400 flex items-center gap-2">
                                    <FaTools /> Service: {booking.service}
                                </p>
                                <p className={`text-sm font-semibold flex items-center gap-2 ${booking.status === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
                                    <FaClock /> Status: {booking.status}
                                </p>

                                <div className="mt-4 flex gap-3">
                                    <motion.button 
                                        onClick={() => handleCancel(booking._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-2"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaTimes /> Cancel
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <motion.div 
                    className="flex flex-col items-center justify-center mt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.p 
                        className="text-gray-400 text-lg text-center mt-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        Uh-oh! Looks like you haven't booked any services yet.  
                        Your toolbox is feeling a little empty... 🧰💨  
                        Go ahead and book a service to get started! 🚀
                    </motion.p>
                </motion.div>
            )}
        </div>
    );
};
export default Booking;
