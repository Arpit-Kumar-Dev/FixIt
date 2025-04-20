import React from 'react'
import { useNavigate } from 'react-router-dom'
const FixitVideo = 'https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg.mp4'
const FixitVideo1 = 'https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg2.mp4'
const FixitVideo2 ='https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg3.mp4'
const FixitVideo3 = 'https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg4.mp4'

export default function MainHome() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden">

      {/* 🚀 Navigation Bar */}
      <div className="absolute top-0 left-0 w-full border-b-3 border-red-700 px-10 py-5 flex justify-between items-center bg-black bg-opacity-40 backdrop-blur-md z-50 shadow-md">
        <div className="text-3xl font-extrabold text-red-500 tracking-wide">
          FixIt<span className="text-white">.com</span>
        </div>
        <ul className="flex gap-10 text-lg font-medium">
          {['Home', 'Services', 'Contact'].map((item, idx) => (
            <li
              key={idx}
              className="hover:text-red-500 transition duration-300 cursor-pointer hover:underline underline-offset-8 decoration-red-500"
              onClick={() => navigate('/')}
            >
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate('/login')}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg transition duration-300 font-semibold"
        >
          Login
        </button>
      </div>

      {/* 🔥 Main Content */}
      <div className="flex w-full h-full pt-24 px-10 gap-6 items-center">
        
        {/* 🧱 Left Info Panel */}
        <div className="w-1/2 h-200 rounded-3xl p-8 shadow-xl backdrop-blur-lg flex flex-col justify-center">
          <h1 className="text-6xl font-extrabold text-amber-50 mb-10">
            Welcome to <span className='text-red-700'> FixIt</span>.com
          </h1>
          <div className="flex gap-6">
            <button 
              onClick={() => navigate('/signup')} 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition-all duration-300"
            >
              User
            </button>
            <button 
              onClick={() => navigate('/SPsignup')} 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-md transition-all duration-300"
            >
              Service Provider
            </button>
          </div>
        </div>

        {/* 🎥 Video Grid */}
        <div className="w-2/3 grid grid-cols-4 grid-rows-3 gap-4 h-[32rem]">
          {[FixitVideo, FixitVideo1, FixitVideo2, FixitVideo3].map((src, i) => {
            const sizes = [
              'col-span-2 row-span-2',
              'col-span-2 row-span-1',
              'col-span-1 row-span-1',
              'col-span-3 row-span-1'
            ]

            return (
              <video
                key={i}
                autoPlay
                loop
                muted
                className={`object-cover rounded-2xl w-full h-full 
                  ${sizes[i]} 
                  transition-transform duration-500 ease-in-out 
                  hover:scale-105 
                  shadow-[0_0_25px_rgba(255,0,0,0.7)] 
                  hover:shadow-[0_0_40px_rgba(255,0,0,1)] 
                  ring-2 ring-red-700 hover:ring-4 
                  hover:ring-red-500`}
              >
                <source src={src} type="video/mp4" />
              </video>
            )
          })}
        </div>

      </div>
    </div>
  )
}
