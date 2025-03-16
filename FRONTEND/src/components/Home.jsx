import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
    const [user, setUser] = useState(null);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [showModal, setShowModal] = useState(false);
    const [servicMessage, setServicMessage] = useState("");
    const [selectedProvider, setSelectedProvider] = useState(null);
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

            setUser({
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

    useEffect(() => {
        axios.get("https://fixit-g4s1.onrender.com/api/v1/ServiceProvider/get_SP")
            .then(response => setServiceProviders(response.data))
            .catch(error => console.error("Error fetching service providers", error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
        navigate("/");
    };

    const handleBooking = (provider) => {
        setSelectedProvider(provider);
        setShowModal(true);
    };

    const handleSubmitBooking = () => {
        axios.post("https://fixit-g4s1.onrender.com/api/v1/booking/makeBooking", {
            userId: user.id,
            SPId: selectedProvider._id,
            service: servicMessage
        });
        axios.post("https://fixit-g4s1.onrender.com/api/v1/Mail/sendBookingMail", {
            name: user.name, to: user.email, body: `Your booking has been created with ${selectedProvider.name}. They will be coming soon.`, sp_name: selectedProvider.name
        });
        setShowModal(false);
        setServicMessage("");
    };

    const filteredProviders = serviceProviders.filter(provider => 
        provider.Occupation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-4 sm:p-6">
            {user ? (
                <>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-wrap items-center justify-between p-4 sm:p-6 bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-700"
                    >
                        <div className="flex items-center gap-4 sm:gap-6">
                            <motion.img 
                                src={user.profilePic} 
                                alt="Profile"
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-red-500 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                            />
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold">{user.name}</h2>
                                <p className="text-gray-400 text-sm sm:text-base">{user.email}</p>
                            </div>
                        </div>
                        
                        <input 
                            type="text" 
                            className="w-full sm:w-80 h-10 sm:h-12 bg-gray-800/60 text-white placeholder-gray-500 px-4 rounded-full outline-none focus:ring-2 focus:ring-red-500 transition"
                            placeholder="Search occupation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <Navbar user={user} />
                    </motion.div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map(provider => (
                                    <motion.div 
                                        key={provider._id} 
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative bg-gray-800/70 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700 transform transition hover:scale-105 hover:shadow-xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={provider.Profile_imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${provider.name}`} 
                                                alt={provider.name} 
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-red-500 shadow-md"
                                            />
                                            <div>
                                                <h3 className="text-base sm:text-lg font-semibold">{provider.name}</h3>
                                                <p className="text-gray-400 text-sm sm:text-base">{provider.Servicetype}</p>
                                                <p className="text-gray-500 text-xs sm:text-sm">{provider.Occupation}</p>
                                            </div>
                                        </div>
                                        <motion.button 
                                            onClick={() => handleBooking(provider)} 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                        >
                                            Book Now
                                        </motion.button>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400">No matching service providers found.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <p className="text-center text-lg">Loading user data...</p>
            )}
        </div>
    );
};

export default Home;