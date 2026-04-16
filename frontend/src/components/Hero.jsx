import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, TrendingUp } from 'lucide-react';

export const Hero = ({ title = "Fresh Groceries Delivered Fast", subtitle = "Get quality products at your doorstep in 30-45 minutes", backgroundImage, cta1Text = "Start Shopping", cta1Action = () => {}, cta2Text = "Become a Vendor", cta2Action = () => {} }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate random bubbles on mount
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 150 + 50,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-red-500 flex items-center justify-center overflow-hidden">
      {/* Animated Bubble Background - Professional Ecommerce Design */}
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute rounded-full backdrop-blur-sm"
            style={{
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: `rgba(255, 255, 255, ${0.05 + Math.random() * 0.1})`,
              boxShadow: `inset 0 0 ${bubble.size / 4}px rgba(255,255,255,0.15)`,
              animation: `float-bubble ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay Circles */}
      <div className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        {/* Top Badge */}
        <div className="mb-8 inline-block">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 text-sm font-semibold">
            <Zap className="w-4 h-4" />
            Trusted by 50K+ Customers
          </div>
        </div>

        {/* Main Title with gradient text */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fadeIn">
          <span className="block bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 text-white/90 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          {[
            { icon: '⚡', label: 'Super Fast' },
            { icon: '🌱', label: '100% Fresh' },
            { icon: '💳', label: 'Easy Payment' }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/25 hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <p className="font-semibold text-sm">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn mb-12" style={{ animationDelay: '0.6s' }}>
          {/* Primary Button */}
          <button
            onClick={cta1Action}
            className="relative group px-10 py-4 bg-white text-orange-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-orange-300/50 hover:scale-110 transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {cta1Text}
          </button>

          {/* Secondary Button */}
          <button
            onClick={cta2Action}
            className="px-10 py-4 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            {cta2Text}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
          {[
            { value: '30-45', label: 'Min Delivery' },
            { value: '500+', label: 'Vendors' },
            { value: '98%', label: 'Satisfaction' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all"
              style={{ animationDelay: `${0.7 + idx * 0.1}s` }}
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <p className="text-white/70 text-sm font-semibold">Scroll to explore</p>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes float-bubble {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          50% { transform: translateY(-100px) translateX(50px) rotate(180deg); opacity: 0.2; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-200px) translateX(-50px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes float-bubble {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-50px); }
          }
        }
      `}</style>
    </div>
  );
};
