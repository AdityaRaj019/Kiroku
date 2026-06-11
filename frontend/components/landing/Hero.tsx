"use client";

import React from "react";
import Image from "next/image";



export const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#0A0A0C] overflow-hidden flex flex-col items-center justify-end pb-2 md:pb-3 p-0 m-0">
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
      <div className="relative w-full max-w-4xl mx-auto px-4 md:px-12 pt-0 pb-0 flex flex-col items-center text-center space-y-0 z-20">
        {/* Main Title Banner text */}
        <div className="space-y-0 w-full flex flex-col items-center text-center">
          <Image
            src="/images/hero_text.png"
            alt="TRACK. NEVER MISS. STAY AHEAD."
            width={850}
            height={298}
            className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[720px] lg:max-w-[850px] h-auto object-contain select-none animate-fade-in-up filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
            style={{ height: "auto" }}
            draggable="false"
            priority
          />
          <p className="text-base sm:text-lg md:text-xl font-medium text-white max-w-2xl mx-auto tracking-wide font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
            Your Ultimate Manga & Anime Tracker
          </p>
        </div>

        {/* Mini Checklist Horizontal Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 max-w-3xl text-xs sm:text-sm md:text-base text-white font-semibold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-leaf-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              <path strokeLinecap="round" stroke="#FFB800" strokeWidth="1.5" d="M6 8h3M6 11h3M6 14h3M15 8h3M15 11h3M15 14h3" />
            </svg>
            <span>Track Everything</span>
          </div>
          <span className="hidden sm:inline text-white/15">|</span>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-leaf-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              <path strokeLinecap="round" stroke="#FFB800" strokeWidth="2" d="M19 5c.5.5.8 1.2.8 2M22 6c0-.5-.3-1-.8-1.5" />
            </svg>
            <span>Never Miss Out</span>
          </div>
          <span className="hidden sm:inline text-white/15">|</span>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-leaf-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Get Notified</span>
          </div>
          <span className="hidden sm:inline text-white/15">|</span>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-leaf-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Stay Ahead</span>
          </div>
        </div>

        {/* Action Button */}
        <div 
          onClick={() => {
            const el = document.getElementById("features");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="relative group pt-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200"
        >
          <div className="w-[300px] sm:w-[360px]">
            <Image
              src="/images/hero_btn.png"
              alt="Start Your Journey"
              width={360}
              height={100}
              className="w-full h-auto object-contain select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              style={{ height: "auto" }}
              draggable="false"
              priority
            />
          </div>
        </div>
      </div>

      {/* Distress Border Border Bottom decor (manga line style) */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-shonen-orange via-white to-shonen-orange opacity-40 z-20" />
    </section>
  );
};
