"use client";

import React from "react";
import Image from "next/image";

const LeafSwirl = () => (
  <svg 
    className="w-3.5 h-3.5" 
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

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#070709] border-t border-white/5 py-8 md:py-10 overflow-hidden z-20">
      {/* Background Nakama Silhouette stretched to fit the whole footer background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/footer_nakama.png"
          alt="Nakama silhouettes"
          fill
          className="object-cover object-bottom opacity-45 mix-blend-screen"
          priority
        />
      </div>

      <div className="relative w-full max-w-[1480px] mx-auto px-6 md:px-12 z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Brand Slogan and Social Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div>
            <h4 className="font-bebas text-lg tracking-wider text-white/50 font-medium leading-none mb-1">
              MORE THAN A TRACKER,
            </h4>
            <h3 className="font-bebas text-2xl sm:text-3xl tracking-widest text-[#FF6B00] italic font-bold transform -skew-x-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              IT&apos;S YOUR NAKAMA!
            </h3>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Globe */}
              <a href="#" aria-label="Website">
                <svg className="w-4.5 h-4.5 text-white/40 hover:text-[#FF6B00] transition-colors cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
              {/* Android */}
              <a href="#" aria-label="Android app">
                <svg className="w-4.5 h-4.5 text-white/40 hover:text-[#FF6B00] transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.5 11c-.8 0-1.5-.7-1.5-1.5S16.7 8 17.5 8s1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm-11 0c-.8 0-1.5-.7-1.5-1.5S5.7 8 6.5 8s1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm11.3-4.3l1.3-2.3c.1-.2 0-.5-.2-.6-.2-.1-.5 0-.6.2l-1.3 2.3C15.8 5.7 14 5 12 5s-3.8.7-5 1.3L5.7 4c-.1-.2-.4-.3-.6-.2-.2.1-.3.4-.2.6l1.3 2.3C4.3 8.3 3 10.5 3 13h18c0-2.5-1.3-4.7-3.2-6.3zM12 22c4.4 0 8-3.6 8-8H4c0 4.4 3.6 8 8 8z" />
                </svg>
              </a>
              {/* Apple */}
              <a href="#" aria-label="iOS app">
                <svg className="w-4.5 h-4.5 text-white/40 hover:text-[#FF6B00] transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.7 12.4c-.1-2.4 2-3.6 2.1-3.6-1.1-1.6-2.8-1.9-3.4-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.2-.9-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.3 1.1-.1 1.6-.7 3-.7s1.8.7 2.9.6c1.2 0 2-.1 2.8-1.2.9-1.3 1.3-2.7 1.3-2.7-.1-.1-2.4-.9-2.4-3.6zM15.9 4.2c.6-.8 1-1.9.9-3-.9.1-2.1.6-2.8 1.5-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.6 2.9-1.4z" />
                </svg>
              </a>
              {/* Discord */}
              <a href="#" aria-label="Discord server">
                <svg className="w-4.5 h-4.5 text-white/40 hover:text-[#FF6B00] transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.3 5.1c-1.4-1.3-3.2-2.1-5-2.4l-.2.5c1.6.5 3.1 1.2 4.5 2.2-1.9-1-4-1.6-6.1-1.7-2.1-.1-4.2.4-6.1 1.7 1.4-1 2.9-1.7 4.5-2.2l-.2-.5c-1.8.3-3.6 1.1-5 2.4-2.8 4.1-3.5 8.2-3.1 12.2 1.9 1.4 4.3 2.2 6.7 2.3l1.4-1.7c-1.5-.4-2.8-1.2-4-2.3l.3-.2c2.6 1.2 5.5 1.8 8.4 1.8 2.9 0 5.8-.6 8.4-1.8l.3.2c-1.2 1.1-2.5 1.9-4 2.3l1.4 1.7c2.4-.1 4.8-.9 6.7-2.3.4-4-.3-8.1-3.1-12.2zM9 13.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm6 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                </svg>
              </a>
            </div>

            {/* Separator bracket */}
            <span className="text-white/20 select-none text-sm font-sans">⟩</span>

            {/* Text link */}
            <a href="#" className="text-xs font-semibold tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer uppercase">
              Join Our Community
            </a>
          </div>
        </div>

        {/* Right Side: Skewed cell-shaded CTA button */}
        <div className="z-10 flex flex-col items-center md:items-end">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group relative bg-[#FFB800] border-2 border-black text-black font-bebas text-sm font-bold tracking-widest py-2 px-6 rounded-lg shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all flex items-center gap-2.5 cursor-pointer uppercase"
          >
            <span>Start Your Journey</span>
            <div className="w-5 h-5 rounded-full bg-white/95 flex items-center justify-center text-black shadow-inner">
              <LeafSwirl />
            </div>
          </button>
          
          <span className="text-[10px] text-white/20 font-sans tracking-wide mt-3 select-none">
            © 2026 MANGATREK. ALL RIGHTS RESERVED.
          </span>
        </div>

      </div>
    </footer>
  );
};
