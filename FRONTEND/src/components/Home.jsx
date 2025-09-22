import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "./Navbar";
import { motion, AnimatePresence, color } from "framer-motion";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import IconButton from "@mui/material/IconButton";
const Home = () => {
    const [user, setUser] = useState(null);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [showModal, setShowModal] = useState(false);
    const [servicMessage, setServicMessage] = useState("");
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setRefreshKey(prevKey => prevKey + 1);
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
                pincode: decoded.pincode || "N/A", // 🔥 Added pincode here
            });
        } catch (error) {
            localStorage.removeItem("token");
            navigate("/");
        }
    }, [navigate, refreshKey]);

    useEffect(() => {
        axios.get("https://fixit-g4s1.onrender.com/api/v1/ServiceProvider/get_SP")
            .then(response => setServiceProviders(response.data))
            .catch(error => console.error("Error fetching service providers", error));
    }, [refreshKey]);

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
            name: user.name,
            to: user.email,
            body: `Your booking has been created with ${selectedProvider.name}. They will be coming soon.`,
            sp_name: selectedProvider.name
        });
        setShowModal(false);
        setServicMessage("");
    };
 
   const filteredProviders = serviceProviders.filter(provider => 
        provider.Occupation.toLowerCase().includes(searchQuery.toLowerCase())
        //  &&
        // provider.address.pincode === user?.pincode
    );
   

    return (
        <div className="min-h-screen  bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
            {user ? (
                <>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between p-6 pl-9 bg-gray-900/70 backdrop-blur-md rounded-full shadow-lg border border-gray-700"
                    >
                        <div className="flex items-center gap-6  ">
                            <motion.img 
                                src={user.profilePic} 
                                alt="Profile"
                                onClick={() => navigate("/profile", { state: { userId: user?.id } })}
                                className="w-16 h-16 rounded-full border-4 border-red-500 shadow-lg cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                            />
                            <div>
                                {/* <h1 className="text-xl font-semibold" >Wellcome</h1> */}
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                {/* <p className="text-gray-400">{user.email}</p> */}
                                {/* <p className="text-sm text-gray-500">Pincode: {user.pincode}</p> */}
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
                        <h1 
                            className="text-white text-3xl mr-10 font-bold cursor-pointer" 
                            onClick={handleLogout}
                        >
                            FixIt.com
                        </h1>
                    </motion.div>

                    <div className="mt-20 p-6 grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-4 gap-3">
                        <AnimatePresence>
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map(provider => (
                                    <motion.div 
                                        key={provider._id} 
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        
                                        // className="relative h-40 bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        {/* <div className="flex items-center gap-4">
                                            <img 
                                                src={provider.Profile_imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${provider.name}`} 
                                                alt={provider.name} 
                                                className="w-20 h-20 rounded-full border-4 border-red-500 shadow-md"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold">{provider.name}</h3>
                                                <p className="text-gray-400">{provider.Servicetype}</p>
                                                <p className="text-gray-500">{provider.Occupation}</p>
                                                <p className="text-amber-50">Price/Hr ₹{provider.price}</p>
                                            </div>
                                        </div>
                                        <motion.button 
                                            onClick={() => handleBooking(provider)} 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="absolute bottom-4 right-4 px-7 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                        >
                                            Book Now
                                        </motion.button> */}
                                        <Card sx={{ display: "flex", margin:"0px", flexDirection: "column",width:"384px", background:"rgba(31, 41, 55, 0.7) " ,color:"white",borderRadius:"13px",borderBottomLeftRadius:"55px" ,borderBottomRightRadius:"13px",transition: "all 0.1s ease","&:hover": {borderStyle: "solid",borderColor: "rgba(237, 56, 56, 1)",borderRadius: "13px",borderBottomLeftRadius:"55px",boxShadow: "0 0 15px 3px rgba(239,68,68,0.7)",}, }  }>
                                            <CardMedia component="img" alt={provider.name || "Profile image"} sx={{ height: 150, objectFit: "cover" }} image={provider.Profile_imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${provider.name}`} />
                                            <CardContent sx={{ flexGrow: 1 }}>

            <Typography gutterBottom variant="h4" component="div">
              {provider.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              {provider.Occupation || "No occupation listed"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Price/Hr: ₹{provider.price}
            </Typography>
          </CardContent>
           
          <CardActions sx={{display:"flex",justifyContent:"center",borderTopLeftRadius:"51px",backgroundColor:"red"}}>
            <IconButton sx={{
                              width: 80,
                              height: 80,
                              marginRight:"140px",
                              borderRadius: "50%",
                              background: "linear-gradient(145deg, #222b36, #1b232d)",
                              color: "white",
                              "&:hover": {
                              backgroundColor: "#d48e8eff",
                              boxShadow: "0 0 15px 3px rgba(239,68,68,0.7)",
                              border:"4px",
                              borderBlockColor:"white",
                              borderStyle:"solid"
                              },
                             }}
                             >
                                    <PersonOutlinedIcon sx={{ fontSize: "58px" }} />
                            </IconButton>
            <Button size="large" variant="contained" color="error" onClick={() => handleBooking(provider)} sx={{hight:"300px",width:"144px",borderRadius:"55px"}}>
              Book Now
            </Button>
          </CardActions>
        </Card>
        </motion.div>
        ))
                  ) : (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-gray-400 col-span-3 mt-20 text-2xl"
                                >
                                    🧹 No providers found around you. Time to DIY? 👷‍♂️
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <p className="text-center text-lg">Loading user data...</p>
            )}

        {/* booking submit pop up code downside  */}
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
                            <h2 className="text-lg font-semibold mb-2">Book {selectedProvider?.name}</h2>
                            <input 
                                type="text" 
                                value={servicMessage} 
                                onChange={(e) => setServicMessage(e.target.value)} 
                                className="w-full border p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 mb-4 "
                                placeholder="Enter booking details..."
                            />
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSubmitBooking} 
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Submit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
