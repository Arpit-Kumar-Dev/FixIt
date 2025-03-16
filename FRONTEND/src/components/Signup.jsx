import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaImage } from "react-icons/fa";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: { pincode: "", city: "", state: "", area: "" },
    });
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["pincode", "city", "state", "area"].includes(name)) {
            setFormData((prevData) => ({
                ...prevData,
                address: { ...prevData.address, [name]: value },
            }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!profileImage) {
            setError("Profile image is required.");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("phoneNumber", formData.phoneNumber);
            data.append("address", JSON.stringify(formData.address));
            data.append("file", profileImage);

            const res = await axios.post("https://fixit-g4s1.onrender.com/api/v1/user/signup", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            localStorage.setItem("token", res.data.token);
            navigate("/Homes");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 border-2 border-red-500">
                <h2 className="text-red-500 text-3xl font-bold text-center mb-4">FixIt Signup</h2>
                {error && <p className="text-red-400 text-center mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-red-500" />
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Name" 
                            className="w-full pl-10 p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3 text-red-500" />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            className="w-full pl-10 p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-red-500" />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            className="w-full pl-10 p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="relative">
                        <FaPhone className="absolute left-3 top-3 text-red-500" />
                        <input 
                            type="number" 
                            name="phoneNumber" 
                            placeholder="Phone Number" 
                            className="w-full pl-10 p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <label className="text-red-400 font-semibold">Address</label>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-red-500" />
                        <input 
                            type="text" 
                            name="pincode" 
                            placeholder="Pincode" 
                            className="w-full pl-10 p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={formData.address.pincode} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <input 
                        type="text" 
                        name="city" 
                        placeholder="City" 
                        className="w-full p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={formData.address.city} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="state" 
                        placeholder="State" 
                        className="w-full p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={formData.address.state} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="area" 
                        placeholder="Area" 
                        className="w-full p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={formData.address.area} 
                        onChange={handleChange} 
                        required 
                    />

                    <label className="text-red-400 font-semibold">Profile Picture</label>
                    <div className="relative">
                        <FaImage className="absolute left-3 top-3 text-red-500" />
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="w-full pl-10 p-2 bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            accept="image/*" 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
                    >
                        {loading ? "Signing up..." : "Signup"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
