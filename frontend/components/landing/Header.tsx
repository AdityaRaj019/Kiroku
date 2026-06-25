"use client";

import React from "react";
import Link from "next/link";

const LeafSwirl = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="10" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M25,60 C35,75 65,75 75,55 C80,40 70,25 50,25 C30,25 25,45 35,60 C42,70 58,68 62,55 C65,45 55,38 48,42 C44,45 46,52 50,52" />
    <path d="M22,63 L12,65 L16,55 Z" fill="currentColor" />
  </svg>
);

const JollyRoger = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Crossbones */}
    <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    {/* Skull Base */}
    <circle cx="50" cy="50" r="24" fill="#0A0A0C" stroke="currentColor" strokeWidth="6" />
    {/* Eye sockets */}
    <circle cx="42" cy="48" r="4.5" fill="currentColor" />
    <circle cx="58" cy="48" r="4.5" fill="currentColor" />
    {/* Nose cavity */}
    <path d="M50 52 L47 57 H53 Z" fill="currentColor" />
    {/* Teeth */}
    <path d="M42 62 H58 M46 62 V66 M50 62 V66 M54 62 V66" stroke="currentColor" strokeWidth="3" />
    {/* Straw Hat */}
    <path d="M15 40 Q50 20 85 40" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" />
    <path d="M32 33 Q50 10 68 33 Z" fill="#FFD700" />
    <path d="M33 32 Q50 26 67 32" stroke="#E52521" strokeWidth="4" />
  </svg>
);

export const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent py-5 px-6 md:px-16 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <div className="transform transition-transform group-hover:rotate-12 duration-300">
          <JollyRoger />
        </div>
        <span className="font-bebas text-2xl tracking-wider text-white font-bold transition-colors group-hover:text-shonen-orange">
          MangaTrek
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {[
          { label: "FEATURES", id: "features" },
          { label: "RANKINGS", id: "rankings" },
          { label: "TOP MANGA", id: "top-manga" },
          { label: "AI ASSISTANT", id: "ai-assistant" },
          { label: "ABOUT", id: "about" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.id)}
            className="text-xs font-semibold tracking-widest text-white/80 hover:text-shonen-orange transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* CTA Button */}
      <Link 
        href="/manga"
        className="relative group overflow-hidden bg-gradient-to-r from-[#FF9F00] to-[#FF6B00] text-black font-bebas text-sm font-bold tracking-wider px-5 py-2 rounded-full border border-black/20 shadow-[0_4px_0_#000] hover:shadow-[0_2px_0_#000] hover:translate-y-[2px] transition-all flex items-center"
      >
        <span>GET STARTED</span>
        <div className="ml-2 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-black shadow-inner">
          <LeafSwirl className="w-3.5 h-3.5" />
        </div>
      </Link>
    </header>
  );
};
