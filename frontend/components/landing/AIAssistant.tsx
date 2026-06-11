"use client";

import React, { useState } from "react";
import Image from "next/image";

export const AIAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      alert(`MangaTrek AI: "Analyzing your request: '${inputValue}'..."`);
      setInputValue("");
    }
  };

  return (
    <section id="ai-assistant" className="relative bg-[#050508] border-b border-white/5 py-12 md:py-16 overflow-hidden flex flex-col items-center justify-center">
      {/* Floating animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulse-glow {
          0% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.03); }
          100% { opacity: 0.25; transform: scale(1); }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 5s ease-in-out infinite;
        }
      `}</style>

      {/* Grid line background */}
      <div className="absolute inset-0 opacity-[0.02] select-none pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] z-0" />
      
      {/* Dynamic Manga Panels Backdrop Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/ai_manga_panel_bg.png"
          alt="AI Manga panels backdrop"
          fill
          className="object-cover opacity-[0.14] mix-blend-color-dodge filter contrast-125 brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-[#050508]" />
      </div>

      {/* Purple Glowing Smoke Orbs */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-900/[0.06] blur-[130px] -top-12 left-1/3 animate-pulse-glow" />
        <div className="absolute w-[700px] h-[700px] rounded-full bg-indigo-950/[0.1] blur-[150px] -bottom-24 right-1/4 animate-pulse-glow" style={{ animationDelay: "2.5s" }} />
      </div>

      <div className="relative w-full max-w-[1480px] mx-auto px-6 md:px-12 z-20">
        
        {/* 2-Column Grid (Left: AI Assistant Div, Right: Smartphone mockup notification) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          
          {/* LEFT COLUMN: AI Assistant Div (Purple Theme Blended Perfectly, Exactly like screenshot) */}
          <div className="col-span-12 lg:col-span-8 bg-[#0E0E12]/80 border border-purple-900/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md relative overflow-hidden">
            
            {/* Purple radial backdrop glow inside card */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06)_0%,transparent_75%)] pointer-events-none z-10" />

            {/* Header Title inside the card */}
            <div className="mb-6 z-20 flex flex-col">
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-purple-400 font-bold italic transform -skew-x-3 drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]">
                AI ASSISTANT
              </h2>
              <p className="text-sm text-white/90 font-sans tracking-wide">
                Your Personal Manga Guide
              </p>
            </div>

            {/* Core Interaction Area (Centered layouts with increased dimensions) */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 w-full z-20 flex-grow">
              
              {/* Left Column: Sasuke Uchiha (Scale-increased) */}
              <div className="relative flex flex-col items-center w-[180px] md:w-[210px] shrink-0 self-center md:self-end">
                
                {/* Speech Bubble (Cream bg, dark border, tail pointing down-left) */}
                <div className="absolute -top-12 left-[125px] bg-[#F5EBE1] border border-[#1A1713] text-[#1F1B16] text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-2xl rounded-bl-none shadow-md whitespace-nowrap z-30 flex items-center select-none">
                  <span>何を知りたい？</span>
                  {/* Speech bubble tail */}
                  <span className="absolute bottom-[-6px] left-[15px] w-3 h-3 bg-[#F5EBE1] border-r border-b border-[#1A1713] transform rotate-45 z-10" />
                </div>

                {/* Adult Sasuke Portrait */}
                <div className="relative w-[180px] h-[240px] md:w-[210px] md:h-[280px] pointer-events-none select-none">
                  <Image
                    src="/images/adult_sasuke.png"
                    alt="Adult Sasuke Uchiha"
                    fill
                    className="object-contain filter drop-shadow-[0_8px_20px_rgba(168,85,247,0.25)]"
                    priority
                  />
                </div>
              </div>

              {/* Center Column: Prompts Box & Input bar (Centered & Increased Width) */}
              <div className="flex-grow w-full max-w-[620px] flex flex-col justify-end">
                
                {/* Prompt Box with thin purple border */}
                <div className="bg-[#0A0A0C]/65 border border-purple-900/50 rounded-2xl p-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] z-10 w-full font-sans text-xs sm:text-sm text-white/90">
                  <p className="text-white/60 mb-2 leading-relaxed">
                    {"Ask anything about manga, anime, characters, arcs, or recommendations."}
                  </p>
                  <ul className="space-y-1.5 text-white/90 font-medium">
                    <li className="flex items-center gap-1 cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setInputValue("What happened in this chapter?")}>
                      <span>•</span>
                      <span>What happened in this chapter?</span>
                    </li>
                    <li className="flex items-center gap-1 cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setInputValue("Who is the strongest character in One Piece?")}>
                      <span>•</span>
                      <span>Who is the strongest character in One Piece?</span>
                    </li>
                    <li className="flex items-center gap-1 cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setInputValue("Recommend me a manga like Naruto!")}>
                      <span>•</span>
                      <span>Recommend me a manga like Naruto!</span>
                    </li>
                    <li className="flex items-center gap-1 cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setInputValue("Tell me about upcoming anime releases.")}>
                      <span>•</span>
                      <span>Tell me about upcoming anime releases.</span>
                    </li>
                  </ul>
                </div>

                {/* Input Bar capsule with purple border */}
                <form onSubmit={handleSend} className="w-full mt-4 bg-[#0A0A0C] border-2 border-purple-600/40 rounded-full pl-5 pr-1.5 py-1.5 flex items-center shadow-[0_0_15px_rgba(168,85,247,0.15)] focus-within:border-purple-500/80 transition-all z-20">
                  <input
                    type="text"
                    placeholder="Ask MangaTrek AI..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-transparent border-none text-white text-xs sm:text-sm focus:outline-none flex-grow placeholder-white/20 pr-3 font-sans"
                  />
                  <button 
                    type="submit"
                    className="p-2.5 bg-[#5D3E9E] hover:bg-[#6D4EA7] text-white rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>

              </div>

              {/* Right Column: Bot Mascot (Scale-increased & positioned on the right) */}
              <div className="relative flex flex-col items-center w-[165px] md:w-[195px] shrink-0 self-center md:self-end">
                <div className="relative w-[165px] h-[165px] md:w-[195px] md:h-[195px] pointer-events-none select-none animate-float-slow">
                  <Image
                    src="/images/bot_screens.png"
                    alt="Mascot with screens"
                    fill
                    className="object-contain filter drop-shadow-[0_8px_20px_rgba(168,85,247,0.3)]"
                    priority
                  />
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Phone Notification Section */}
          <div className="col-span-12 lg:col-span-4 flex justify-center items-center">
            
            {/* Smartphone Container */}
            <div className="relative w-[250px] h-[430px] bg-[#0A0A0C] border-[4px] border-zinc-800 rounded-[38px] p-4 flex flex-col justify-between shadow-[0_25px_45px_rgba(0,0,0,0.95)] overflow-hidden z-20">
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-b-xl z-30" />
              
              {/* Status Bar */}
              <div className="flex justify-between items-center text-[9px] text-white/50 font-sans font-semibold px-2 pt-1 z-20">
                <span>9:21</span>
                {/* Ninja Headband Icon */}
                <svg className="w-3.5 h-3.5 text-purple-500/70" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M15 50 Q50 30 85 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <path d="M30 43 Q50 20 70 43 Z" />
                </svg>
              </div>

              {/* Notification Box content */}
              <div className="flex-grow flex flex-col justify-center py-6">
                <div className="bg-[#121216] border border-purple-900/30 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-2xl relative">
                  
                  {/* Ping alert light */}
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-500 animate-ping" />

                  {/* Notification Header */}
                  <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[9px] font-bold text-white/70 tracking-widest uppercase">MangaTrek</span>
                  </div>

                  {/* Body Text */}
                  <div>
                    <h4 className="font-bebas text-xs tracking-wider text-purple-400 font-bold leading-none mb-1">
                      NEW CHAPTER ALERT!
                    </h4>
                    <p className="text-[10px] text-white/80 font-medium font-sans leading-snug">
                      One Piece Chapter 1116 is out now!
                    </p>
                  </div>

                  {/* Cover Artwork Preview */}
                  <div className="relative w-full h-[110px] rounded-lg overflow-hidden bg-zinc-900">
                    <Image
                      src="/images/feat_luffy.png"
                      alt="Luffy preview notification"
                      fill
                      className="object-cover object-top"
                      sizes="180px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Call to action read button */}
                  <button className="w-full bg-[#1A1A22] hover:bg-purple-950 border border-purple-500/20 text-white font-bebas text-[10px] tracking-widest py-1.5 rounded-lg transition-colors cursor-pointer uppercase font-bold">
                    READ NOW
                  </button>
                </div>
              </div>

              {/* Bottom Phone Dock menu */}
              <div className="flex justify-around items-center border-t border-white/5 pt-2 pb-1 text-white/40">
                <svg className="w-4 h-4 cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="relative cursor-pointer group">
                  <svg className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-purple-600 border border-[#0A0A0C] text-[7px] text-white font-bold flex items-center justify-center rounded-full animate-bounce">
                    1
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
