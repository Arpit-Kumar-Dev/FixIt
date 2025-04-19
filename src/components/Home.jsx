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
    const [refreshKey, setRefreshKey] = useState(0); // 🔹 New state for forcing re-render
    const navigate = useNavigate();

    useEffect(() => {
        setRefreshKey((prevKey) => prevKey + 1); // 🔹 Update state to trigger effect
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/SPLogin");
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
    }, [navigate, refreshKey]); // 🔹 Depend on refreshKey to re-run on refresh

    useEffect(() => {
        axios.get("https://fixit-g4s1.onrender.com/api/v1/ServiceProvider/get_SP")
            .then(response => setServiceProviders(response.data))
            .catch(error => console.error("Error fetching service providers", error));
    }, [refreshKey]); // 🔹 Re-fetch data when refreshed

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
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
            {user ? (
                <>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between p-6 bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-700"
                    >
                        <div className="flex items-center gap-6">
                            <motion.img 
                                src={user.profilePic} 
                                alt="Profile"
                                onClick={()=>{navigate("/profile",{ state: { userId: user?.id } })}}
                                className="w-16 h-16 rounded-full border-4 border-red-500 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <input 
                            type="text" 
                            className="w-80 h-12 bg-gray-800/60 text-white placeholder-gray-500 px-4 rounded-full outline-none focus:ring-2 focus:ring-red-500 transition"
                            placeholder="Search occupation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Navbar user={user} />
                        <h1 className="text-white text-3xl mr-10 font-bold cursor-pointer" onClick={handleLogout}>FixIt.com</h1>
                    </motion.div>

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map(provider => (
                                    <motion.div 
                                        key={provider._id} 
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative h-40 bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={provider.Profile_imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${provider.name}`} 
                                                alt={provider.name} 
                                                className="w-20 h-20 rounded-full border-4 border-red-500 shadow-md"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold">{provider.name}</h3>
                                                <p className="text-gray-400">{provider.Servicetype}</p>
                                                <p className="text-gray-500">{provider.Occupation}</p>
                                                <p className="text-amber-50">Price/Hr {provider.price}</p>
                                            </div>
                                        </div>
                                        <motion.button 
                                            onClick={() => handleBooking(provider)} 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="absolute bottom-4 right-4 px-7 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
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

            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-gray-900 p-6 rounded-2xl shadow-xl w-96"
                        >
                            <h2 className="text-lg font-semibold">Book {selectedProvider?.name}</h2>
                            <input 
                                type="text" 
                                value={servicMessage} 
                                onChange={(e) => setServicMessage(e.target.value)} 
                                className="w-full border p-3 mt-2 rounded-lg bg-gray-800 text-white placeholder-gray-500"
                                placeholder="Enter booking details..."
                            />
                            <div className="flex justify-end mt-4">
                                <button onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">Cancel</button>
                                <button onClick={handleSubmitBooking} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Submit</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
