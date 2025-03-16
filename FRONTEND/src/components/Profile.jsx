import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [userId, setUserId] = useState(location.state?.userId || localStorage.getItem("userId"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    const response = await axios.post("http://localhost:8000/api/v1/user/users", { userId });
                    console.log("API Response:", response.data);
                    setUser(response.data);
                } catch (err) {
                    setError("Failed to fetch user data");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            setError("User ID not found");
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return <p className="text-white text-center mt-10 text-lg animate-pulse">Loading user data...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10 text-lg">{error}</p>;
    }

    return (
        <motion.div
            className="w-full h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Back Button */}
            <motion.button
                className="absolute top-6 left-6 flex items-center gap-2 text-red-400 hover:text-red-500 transition-all duration-300"
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowLeft size={24} />
                <span className="text-lg font-semibold">Back</span>
            </motion.button>

            {/* Profile Card */}
            <motion.div
                className="max-w-lg w-full bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg border-2 border-red-500 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Glowing Profile Frame */}
                <motion.div
                    className="relative w-36 sm:w-44 h-36 sm:h-44 rounded-full flex items-center justify-center mb-4"
                    whileHover={{
                        scale: 1.1,
                        boxShadow: "0px 0px 20px rgba(255, 0, 0, 0.8), 0px 0px 40px rgba(255, 0, 255, 0.5)",
                        borderColor: "#ff00ff",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {/* Outer Glowing Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-500"
                        animate={{
                            boxShadow: [
                                "0px 0px 15px rgba(255, 0, 0, 0.5)",
                                "0px 0px 30px rgba(255, 0, 255, 0.7)",
                                "0px 0px 15px rgba(255, 0, 0, 0.5)"
                            ],
                        }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "mirror",
                            duration: 2,
                        }}
                    />

                    {/* Profile Image */}
                    <motion.img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-32 sm:w-40 h-32 sm:h-40 rounded-full object-cover cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    />
                </motion.div>

                <motion.h2
                    className="text-2xl sm:text-3xl font-bold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {user.name}
                </motion.h2>
                <motion.p
                    className="text-gray-400 text-sm sm:text-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {user.email}
                </motion.p>
                <motion.p
                    className="text-gray-400 text-sm sm:text-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    📞 {user.phoneNumber}
                </motion.p>

                <motion.div
                    className="mt-4 border-t border-gray-700 pt-4 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <p>
                        <span className="font-semibold">📍 Address:</span> {user.address.area}, {user.address.city}, {user.address.state} - {user.address.pincode}
                    </p>
                    <p>
                        <span className="font-semibold">🕒 Joined:</span> {new Date(user.createdAt).toDateString()}
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Profile;
