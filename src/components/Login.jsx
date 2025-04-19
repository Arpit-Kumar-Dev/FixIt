import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("https://fixit-g4s1.onrender.com/api/v1/user/login", { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/Home");
        } catch (err) {
            setError(err.response?.data?.message||"Login failed");
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="flex justify-center items-center h-screen  bg-gradient-to-br from-black via-gray-900 to-gray-800">
            <Helmet>
          <title>FixIt.com</title>
           </Helmet>
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96 border-2 border-red-500">
                <h2 className="text-3xl font-bold text-red-500 text-center mb-6">FixIt Login</h2>
                
                {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 bg-gray-800 text-white border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 bg-gray-800 text-white border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-4">Don't have an account?</p>
                <button
                    onClick={() => navigate("/signup")}
                    className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition mt-2"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Login;
