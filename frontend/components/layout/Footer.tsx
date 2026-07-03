"use client";

import React from "react";
import Link from "next/link";

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.19,77.19,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C-3,41.25-8.9,73.65-6,105.32A108.36,108.36,0,0,0,26.46,122.4a80.68,80.68,0,0,0,6.07-9.92,67.6,67.6,0,0,1-10.94-5.26c.92-.67,1.81-1.37,2.65-2.1a77.1,77.1,0,0,0,78.86,0c.84.73,1.73,1.43,2.65,2.1a67.6,67.6,0,0,1-10.94,5.26,80.68,80.68,0,0,0,6.07,9.92,108.36,108.36,0,0,0,32.46-17.08C136,73.65,130.1,41.25,107.7,8.07ZM42.45,83.08c-6.3,0-11.48-5.78-11.48-12.89S36.07,57.3,42.45,57.3s11.52,5.78,11.48,12.89S48.75,83.08,42.45,83.08Zm42.24,0c-6.3,0-11.48-5.78-11.48-12.89S78.31,57.3,84.69,57.3s11.52,5.78,11.48,12.89S91,83.08,84.69,83.08Z" transform="translate(6.25 -13.23)"/>
  </svg>
);

const RedditIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.16,9.15a2,2,0,0,0-3.32-1.55,10.6,10.6,0,0,0-5.24-1.68l1.11-3.51,3,.64a1.32,1.32,0,1,0,.14-.65l-3.34-.71a.44.44,0,0,0-.51.3L7.75,6A10.66,10.66,0,0,0,2.5,7.61a2,2,0,0,0-.81,3.22,1.86,1.86,0,0,0,.21.84A10.82,10.82,0,0,0,10,13.62a10.82,10.82,0,0,0,8.1-1.95A1.86,1.86,0,0,0,17.16,9.15ZM5.38,10.75a1,1,0,1,1,1-1A1,1,0,0,1,5.38,10.75Zm7.9,2.44c-1,.94-2.88.94-3.28.94s-2.31,0-3.28-.94a.33.33,0,0,1,.45-.48c.76.72,2.15.72,2.83.72s2.07,0,2.83-.72a.33.33,0,1,1,.45.48Zm1.34-2.44a1,1,0,1,1,1-1A1,1,0,0,1,14.62,10.75Z"/>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t-4 border-zinc-950 py-8 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Section: Status indicator & Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-bebas text-2xl font-extrabold tracking-wider text-zinc-950">
              KIROKU
            </span>
            <span className="font-bebas bg-zinc-950 text-white px-2 py-0.5 text-xs font-bold tracking-widest uppercase transform rotate-[1deg] border border-zinc-950">
              CATALOG
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-sans">
            © 2026 KIROKU. ALL RIGHTS RESERVED. POWERED BY MANGADEX API.
          </p>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 pt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-600 uppercase">
              All Systems Operational
            </span>
          </div>
        </div>

        {/* Middle Section: External Community Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-zinc-950 font-bebas text-sm font-bold tracking-widest text-zinc-950 hover:bg-[#CC0000] hover:text-white transition-all shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000]"
          >
            <GithubIcon />
            <span>GITHUB</span>
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-zinc-950 font-bebas text-sm font-bold tracking-widest text-zinc-950 hover:bg-[#CC0000] hover:text-white transition-all shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000]"
          >
            <DiscordIcon />
            <span>DISCORD</span>
          </a>
          <a
            href="https://reddit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-zinc-950 font-bebas text-sm font-bold tracking-widest text-zinc-950 hover:bg-[#CC0000] hover:text-white transition-all shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000]"
          >
            <RedditIcon />
            <span>REDDIT</span>
          </a>
        </div>

        {/* Right Section: Legal/Info Link buttons */}
        <div className="flex items-center gap-4 text-xs font-semibold tracking-wider font-bebas text-lg text-zinc-600">
          <Link href="/about" className="hover:text-[#CC0000] transition-colors">
            ABOUT
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href="/terms" className="hover:text-[#CC0000] transition-colors">
            TERMS
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href="/privacy" className="hover:text-[#CC0000] transition-colors">
            PRIVACY
          </Link>
        </div>

      </div>
    </footer>
  );
};
