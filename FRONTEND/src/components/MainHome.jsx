import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion'; 
import Button from '@mui/material/Button'; 
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; 

// AWS S3 video links
const FixitVideo = 'https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg.mp4';
const FixitVideo1 = 'https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg2.mp4';
const FixitVideo2 = 'https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg3.mp4';
const FixitVideo3 = 'https://arpitdevfixit.s3.eu-north-1.amazonaws.com/images/fixitbg4.mp4';

export default function MainHome() {
  const navigate = useNavigate(); 


  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => setIsLoaded(true), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      
      {/* floating glow particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${i % 2 === 0 ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}`}></div>
          </div>
        ))}
      </div>

      {/* navbar */}
      <nav className={`absolute top-0 left-0 w-full px-10 py-6 flex justify-between items-center bg-black/30 backdrop-blur-xl z-50 border-b border-red-500/20 shadow-lg transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        
        {/* logo */}
        <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
          <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative text-5xl font-extrabold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
            FixIt<span className="text-white">.com</span>
          </div>
        </div>

        {/* links */}
        <ul className="flex gap-10 text-lg font-medium tracking-wide">
          {['Home', 'Services', 'Contact'].map((item, idx) => (
            <li
              key={idx}
              className="relative group cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 hover:bg-red-500/10"
              onClick={() => navigate('/')}
            >
              <span className="relative z-10 group-hover:text-red-400 transition-colors duration-300">
                {item}
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 group-hover:w-full transition-all duration-300"></div>
            </li>
          ))}
        </ul>

        {/* time + login */}
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-400 hidden md:block font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="relative group px-7 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            <span className="relative z-10">Login</span>
          </button>
        </div>
      </nav>

      {/* main content */}
      <main className="flex w-full h-full pt-32 px-12 gap-10 items-center">
        
        {/* left hero panel */}
        <section className={`w-1/2 space-y-10 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          
          {/* hero */}
          <div className="space-y-8">
            <h1 className="text-7xl font-black leading-tight">
              <span className="block text-white">Welcome to</span>
              <span className="block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
                FixIt.com
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 leading-relaxed max-w-xl">
              Your trusted partner for all <span className="text-red-400 font-semibold">home repair</span> and <span className="text-purple-400 font-semibold">maintenance</span> needs. 
              Connect instantly with verified professionals around you.
            </p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-8 py-8">
            {[{ number: '10K+', label: 'Happy Customers' }, { number: '500+', label: 'Service Providers' }, { number: '24/7', label: 'Support' }].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-4xl font-bold text-red-500 group-hover:scale-125 transition-transform duration-300 drop-shadow-md">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative">
            <button
              onClick={() => navigate('/Seprate')}
              className="group relative px-14 py-7 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold text-3xl rounded-3xl shadow-2xl hover:shadow-red-500/50 transition-all duration-500 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="relative flex items-center gap-5 z-10">
                <span>Get Started</span>
                <div className="text-5xl group-hover:translate-x-3 transition-transform duration-300">→</div>
              </div>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            </button>
            <div className="absolute -bottom-10 left-6 text-base text-gray-500 animate-bounce">
              Click to begin your journey
            </div>
          </div>
        </section>

        {/* right video grid */}
        <section className={`w-1/2 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
          <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[36rem] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/10 to-transparent rounded-3xl pointer-events-none z-10"></div>
            
            {[FixitVideo, FixitVideo1, FixitVideo2, FixitVideo3].map((src, i) => {
              const sizes = ['col-span-2 row-span-2','col-span-2 row-span-1','col-span-1 row-span-1','col-span-3 row-span-1'];
              return (
                <div key={i} className={`${sizes[i]} group relative overflow-hidden rounded-3xl`} style={{ animationDelay: `${i*0.3}s` }}>
                  
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-3xl border border-red-500/20 group-hover:border-red-500/50 transition-all duration-500 group-hover:scale-105 shadow-lg group-hover:shadow-red-500/30"
                  ></video>

                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl"></div>

                  
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm tracking-wide">See our platform in action • Real customer experiences</p>
          </div>
        </section>
      </main>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(90deg); }
          50% { transform: translateY(-24px) rotate(180deg); }
          75% { transform: translateY(-12
          75% { transform: translateY(-12px) rotate(270deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
