import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate(); 
  return (
    <nav className=" p-4 mt-7  ">
      <div className="container mx-30 auto flex justify-between items-center">
        <div className="flex space-x-6">
          <button
            className="text-white text-lg hover:text-gray-200"
            onClick={() => navigate("/bookings", { state: { userId: user?.id } })} 
          >
            Bookings
          </button>
          <button
            className="text-white text-lg hover:text-gray-200"
            onClick={() => navigate("/profile",{ state: { userId: user?.id } })}
          >
            Profile
          </button>
          <button
            className="text-white text-lg  hover:text-gray-200"
            onClick={() => navigate("/payment")}
          >
            Payment
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
