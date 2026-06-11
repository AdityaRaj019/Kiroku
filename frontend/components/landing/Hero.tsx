"use client";

import React from "react";
import Image from "next/image";


const StrawHat = () => (
  <svg
    className="w-12 h-10 absolute -top-5 -right-6 rotate-[20deg] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 group-hover:rotate-[30deg] duration-300"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Brim */}
    <path
      d="M10 65 Q50 35 90 65 Q50 45 10 65 Z"
      fill="#F4C430"
      stroke="#000"
      strokeWidth="3"
    />
    {/* Crown */}
    <path
      d="M28 53 C28 20, 72 20, 72 53 Z"
      fill="#F4C430"
      stroke="#000"
      strokeWidth="3"
    />
    {/* Red Ribbon */}
    <path
      d="M28 50 Q50 42 72 50 Q72 54 72 54 Q50 46 28 54 Z"
      fill="#E52521"
      stroke="#000"
      strokeWidth="1.5"
    />
  </svg>
);

export const Hero: React.FC = () => {
  return (
    <section className="relative w-screen min-h-screen bg-[#0A0A0C] overflow-hidden flex flex-col items-center justify-end pb-12 md:pb-20 p-0 m-0">
      {/* Screen Screentone overlay for manga dot-matrix feel */}
      <div className="absolute inset-0 manga-screentone pointer-events-none opacity-15 z-0" />

      {/* The Image inside the div, set to 100% width and height, object-cover, no border, no padding, no black overlay */}
      <div className="absolute inset-0 overflow-hidden bg-[#0A0A0C] z-0">
        <Image
          src="/images/hero_banner.png"
          alt="MangaTrek Hero Banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Over the Banner */}
      <div className="relative w-full max-w-4xl mx-auto px-4 md:px-12 pt-4 pb-0 flex flex-col items-center text-center space-y-4 md:space-y-6 z-20">
        {/* Main Title Banner text */}
        <div className="space-y-2 md:space-y-3 w-full flex flex-col items-center text-center">
          <Image
            src="/images/hero_text.png"
            alt="TRACK. NEVER MISS. STAY AHEAD."
            width={850}
            height={298}
            className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[720px] lg:max-w-[850px] h-auto object-contain select-none animate-fade-in-up filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
            draggable="false"
            priority
          />
          <p className="text-sm sm:text-base md:text-lg font-medium text-white max-w-2xl mx-auto tracking-wide font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
            Your Ultimate Manga & Anime Tracker
          </p>
        </div>

        {/* Mini Checklist Horizontal Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 bg-black/60 px-4 md:px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-sm shadow-lg max-w-2xl text-[10px] sm:text-xs md:text-sm text-white font-medium tracking-wide">
          <div className="flex items-center space-x-1.5">
            <span>📖</span>
            <span>Track Everything</span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <div className="flex items-center space-x-1.5">
            <span>🔔</span>
            <span>Never Miss Out</span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <div className="flex items-center space-x-1.5">
            <span>🔔</span>
            <span>Get Notified</span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <div className="flex items-center space-x-1.5">
            <span>⚡</span>
            <span>Stay Ahead</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative group pt-1 md:pt-2">
          <button
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative bg-[#E52521] text-white font-bebas text-lg sm:text-xl md:text-2xl font-bold tracking-widest px-8 md:px-10 py-2.5 md:py-3.5 rounded-full border-2 border-white/90 hover:bg-[#c31f1c] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            START YOUR JOURNEY
            <StrawHat />
          </button>
        </div>
      </div>

      {/* Distress Border Border Bottom decor (manga line style) */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-shonen-orange via-white to-shonen-orange opacity-40 z-20" />
    </section>
  );
};
