"use client";

import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

interface HeaderSectionProps {
  title: string;
  coverUrl: string | null;
  synopsis: string | null;
  motto: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  coverUrl,
  synopsis,
  motto,
}) => {
  const displayCover = coverUrl || "/images/manga_cover_generic.png";

  return (
    <div className="relative w-full border-4 border-zinc-950 shadow-[6px_6px_0px_#000] overflow-hidden bg-white mb-8">
      {/* Blurred cover image background */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-md opacity-25 scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${displayCover})` }}
      />
      
      {/* Half-tone overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(204,0,0,0.06)_1.5px,transparent_0)] bg-[size:10px_10px] pointer-events-none" />

      {/* Shonen Speedlines pattern */}
      <div className="absolute inset-0 bg-manga-speedlines opacity-40 pointer-events-none" />

      {/* Top Motto Bar */}
      {motto && (
        <div className="relative z-10 bg-zinc-950 text-white py-2 px-4 border-b-4 border-zinc-950 flex items-center justify-center gap-2">
          <Quote className="w-3.5 h-3.5 fill-[#CC0000] text-[#CC0000] shrink-0" />
          <span className="font-bebas text-sm md:text-base tracking-widest text-[#FFD700] uppercase text-center truncate max-w-3xl">
            &ldquo;{motto}&rdquo;
          </span>
        </div>
      )}

      {/* Main Header Content Grid */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        
        {/* Circle Cover Image Wrapper */}
        <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-zinc-950 overflow-hidden shadow-[4px_4px_0px_#000] shrink-0 bg-zinc-100 flex-none group">
          <Image
            src={displayCover}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-w-768px) 176px, 208px"
            priority
            unoptimized={displayCover.startsWith("http")}
          />
          {/* Internal circle overlay */}
          <div className="absolute inset-0 rounded-full border border-black/10 pointer-events-none" />
        </div>

        {/* Title and Description */}
        <div className="flex-grow text-center md:text-left flex flex-col justify-center">
          <span className="self-center md:self-start bg-[#CC0000] text-white font-bebas text-xs font-bold tracking-widest px-2.5 py-0.5 border-2 border-zinc-950 shadow-[2px_2px_0px_#000] uppercase mb-3">
            Manga Overview
          </span>
          <h1 className="font-bebas text-4xl md:text-6xl font-black tracking-wider text-zinc-950 uppercase leading-none mb-4 select-all">
            {title}
          </h1>
          
          <div className="border-t-2 border-dashed border-zinc-300 pt-4 mt-2">
            <h3 className="font-bebas text-lg font-bold text-zinc-950 tracking-wider mb-1.5 uppercase">
              Synopsis
            </h3>
            <p className="text-sm text-zinc-700 leading-relaxed font-sans font-medium max-w-4xl whitespace-pre-line text-justify md:text-left">
              {synopsis || "No description available for this series."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
