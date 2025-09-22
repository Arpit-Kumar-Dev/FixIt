import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react"; // back icon
import userCharacter from "../image/user.png";
import SPCharacter from "../image/SP.png";

export default function Separate() {
  const navigate = useNavigate();

  return (
    <div className="flex w-screen h-screen text-white overflow-hidden relative">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/70 hover:bg-slate-700/90 border border-slate-600 shadow-md transition-all duration-300 z-20"
      >
        <ArrowLeft className="w-7 h-7 text-red-500" />
        <span className="text-base font-semibold">Back</span>
      </button>

      {/* Animated background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* USER Section */}
      <div
        className="flex flex-col justify-center items-center w-1/2 h-full cursor-pointer group bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:from-red-950 hover:via-red-900 hover:to-red-950 transition-all duration-700"
        onClick={() => navigate("/login")}
      >
        <h2 className="text-9xl font-extrabold mb-16 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-red-400 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-300">
          USER
        </h2>
        <div className="relative">
          <div className="w-[30rem] h-[30rem] bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-transparent group-hover:border-red-500 rounded-3xl transition-all duration-500 shadow-2xl group-hover:shadow-red-500/50 transform group-hover:-translate-y-3 flex items-center justify-center">
            <img 
              src={userCharacter} 
              alt="User Character" 
              className="w-[20rem] h-[20rem] object-contain rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <p className="text-3xl text-gray-300 mt-12 group-hover:text-white transition-colors duration-300">
          Continue as User
        </p>
      </div>

      {/* Divider with OR */}
      <div className="flex flex-col justify-center items-center w-[3px] bg-gradient-to-b from-transparent via-red-500 to-transparent relative">
        <div className="absolute w-16 h-16 bg-red-500 rounded-full animate-ping"></div>
        <div className="absolute w-12 h-12 bg-red-500 rounded-full"></div>
        <span className="absolute px-4 py-2 bg-slate-900 text-gray-300 border border-red-500/40 rounded-full text-lg font-semibold">
          OR
        </span>
      </div>

      {/* JOIN US Section */}
      <div
        className="flex flex-col justify-center items-center w-1/2 h-full cursor-pointer group bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:from-purple-950 hover:via-purple-900 hover:to-purple-950 transition-all duration-700"
        onClick={() => navigate("/SPlogin")}
      >
        <h2 className="text-9xl font-extrabold mb-16 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:via-purple-500 group-hover:to-purple-600 transition-all duration-300">
          JOIN US
        </h2>
        <div className="relative">
          <div className="w-[30rem] h-[30rem] bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-transparent group-hover:border-purple-500 rounded-3xl transition-all duration-500 shadow-2xl group-hover:shadow-purple-500/50 transform group-hover:-translate-y-3 flex items-center justify-center">
            <img 
              src={SPCharacter} 
              alt="Service Provider Character" 
              className="w-[20rem] h-[20rem] object-contain rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <p className="text-3xl text-gray-300 mt-12 group-hover:text-white transition-colors duration-300">
          Become a Partner
        </p>
      </div>
    </div>
  );
}
