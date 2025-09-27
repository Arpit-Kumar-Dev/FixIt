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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => setIsLoaded(true), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      
      {/* Reduced floating particles for mobile performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(window.innerWidth < 768 ? 20 : 100)].map((_, i) => (
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
            <div className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full ${i % 2 === 0 ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}`}></div>
          </div>
        ))}
      </div>

      {/* Mobile-first navbar */}
      <nav className={`absolute top-0 left-0 w-full px-4 md:px-10 py-4 md:py-6 flex justify-between items-center bg-black/30 backdrop-blur-xl z-50 border-b border-red-500/20 shadow-lg transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        
        {/* Logo - responsive sizing */}
        <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
          <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
            FixIt<span className="text-white">.com</span>
          </div>
        </div>

        {/* Desktop navigation */}
        <ul className="hidden md:flex gap-10 text-lg font-medium tracking-wide">
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

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </button>

        {/* Desktop time + login */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-sm text-gray-400 font-mono">
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

      {/* Mobile dropdown menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-red-500/20 z-40 transition-all duration-300 ${showMobileMenu ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="px-4 py-6 space-y-4">
          {['Home', 'Services', 'Contact'].map((item, idx) => (
            <div
              key={idx}
              className="block py-2 text-lg font-medium cursor-pointer hover:text-red-400 transition-colors duration-300"
              onClick={() => {
                navigate('/');
                setShowMobileMenu(false);
              }}
            >
              {item}
            </div>
          ))}
          <div className="pt-4 border-t border-red-500/20">
            <div className="text-sm text-gray-400 font-mono mb-4">
              {currentTime.toLocaleTimeString()}
            </div>
            <button
              onClick={() => {
                navigate('/login');
                setShowMobileMenu(false);
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Main content - responsive layout */}
      <main className="flex flex-col lg:flex-row w-full min-h-screen pt-20 md:pt-32 px-4 md:px-12 gap-8 lg:gap-10 items-center">
        
        {/* Hero section - mobile-first */}
        <section className={`w-full lg:w-1/2 space-y-6 md:space-y-10 text-center lg:text-left transition-all duration-1000 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          
          {/* Hero text */}
          <div className="space-y-4 md:space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="block text-white">Welcome to</span>
              <span className="block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
                FixIt.com
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Your trusted partner for all <span className="text-red-400 font-semibold">home repair</span> and <span className="text-purple-400 font-semibold">maintenance</span> needs. 
              Connect instantly with verified professionals around you.
            </p>
          </div>

          {/* Stats - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 py-6 md:py-8">
            {[{ number: '10K+', label: 'Happy Customers' }, { number: '500+', label: 'Service Providers' }, { number: '24/7', label: 'Support' }].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-2xl md:text-4xl font-bold text-red-500 group-hover:scale-125 transition-transform duration-300 drop-shadow-md">{stat.number}</div>
                <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button - responsive */}
          <div className="relative">
            <button
              onClick={() => navigate('/Seprate')}
              className="group relative px-8 md:px-14 py-4 md:py-7 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold text-xl md:text-3xl rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-red-500/50 transition-all duration-500 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="relative flex items-center gap-3 md:gap-5 z-10">
                <span>Get Started</span>
                <div className="text-2xl md:text-5xl group-hover:translate-x-3 transition-transform duration-300">→</div>
              </div>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            </button>
            <div className="absolute -bottom-8 md:-bottom-10 left-1/2 transform -translate-x-1/2 lg:left-6 lg:transform-none text-sm md:text-base text-gray-500 animate-bounce">
              Click to begin your journey
            </div>
          </div>
        </section>

        {/* Video section - responsive layout */}
        <section className={`w-full lg:w-1/2 mt-8 lg:mt-0 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
          
          {/* Mobile: Single video carousel */}
          <div className="lg:hidden space-y-4">
            <div className="relative overflow-hidden rounded-2xl">
              <video
                src={FixitVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-64 object-cover rounded-2xl border border-red-500/20 shadow-lg"
              ></video>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Mobile video thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {[FixitVideo1, FixitVideo2, FixitVideo3].map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-xl">
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-20 object-cover rounded-xl border border-red-500/20"
                  ></video>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Original grid layout */}
          <div className="hidden lg:block">
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
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-gray-400 text-xs md:text-sm tracking-wide">See our platform in action • Real customer experiences</p>
          </div>
        </section>
      </main>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(90deg); }
          50% { transform: translateY(-24px) rotate(180deg); }
          75% { transform: translateY(-12px) rotate(270deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}