"use client";

import React from "react";
import Image from "next/image";

// Custom dynamic theme overlay SVGs for each manga
const StrawHatIcon = () => (
  <svg className="w-10 h-10 text-white/15 group-hover:text-white/25 transition-all duration-300 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
    <path d="M15 50 Q50 30 85 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M30 43 Q50 20 70 43 Z" />
  </svg>
);

const HollowMaskIcon = () => (
  <svg className="w-10 h-10 text-white/15 group-hover:text-white/25 transition-all duration-300 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
    <path d="M30 20 Q50 15 70 20 C75 40 70 80 50 90 C30 80 25 40 30 20 Z" />
    <line x1="38" y1="35" x2="44" y2="45" strokeWidth="8" stroke="currentColor" />
    <line x1="62" y1="35" x2="56" y2="45" strokeWidth="8" stroke="currentColor" />
    <path d="M40 70 Q50 65 60 70 M45 60 Q50 55 55 60" />
  </svg>
);

const LeafSwirlIcon = () => (
  <svg className="w-10 h-10 text-white/15 group-hover:text-white/25 transition-all duration-300 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M25,60 C35,75 65,75 75,55 C80,40 70,25 50,25 C30,25 25,45 35,60 C42,70 58,68 62,55 C65,45 55,38 48,42 C44,45 46,52 50,52" />
    <path d="M22,63 L12,65 L16,55 Z" fill="currentColor" />
  </svg>
);

const CursedFlameIcon = () => (
  <svg className="w-10 h-10 text-white/15 group-hover:text-white/25 transition-all duration-300 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 10 C50 10 70 35 55 55 C45 65 40 75 50 90 C30 80 25 55 35 40 C40 30 45 20 50 10 Z" />
    <path d="M55 35 C55 35 65 50 60 65 C55 75 50 80 55 90 C40 85 38 70 45 60 Z" opacity="0.7" />
  </svg>
);

const SunSwirlIcon = () => (
  <svg className="w-10 h-10 text-white/15 group-hover:text-white/25 transition-all duration-300 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
    <circle cx="50" cy="50" r="30" />
    <circle cx="50" cy="50" r="12" fill="currentColor" />
    <line x1="50" y1="10" x2="50" y2="90" />
    <line x1="10" y1="50" x2="90" y2="50" />
    <line x1="22" y1="22" x2="78" y2="78" stroke="currentColor" />
    <line x1="22" y1="78" x2="78" y2="22" stroke="currentColor" />
  </svg>
);

const ChainsawIcon = () => (
  <svg className="w-10 h-10 text-white/15 group-hover:text-white/25 transition-all duration-300 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
    <rect x="25" y="40" width="50" height="20" rx="10" />
    <path d="M30 40 L28 35 M38 40 L36 35 M48 40 L46 35 M58 40 L56 35 M68 40 L66 35" />
    <path d="M30 60 L28 65 M38 60 L36 65 M48 60 L46 65 M58 60 L56 65 M68 60 L66 65" />
    <circle cx="75" cy="50" r="8" fill="currentColor" />
  </svg>
);

const DragonBallIcon = () => (
  <svg className="w-10 h-10 text-white/15 group-hover:text-white/25 transition-all duration-300 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" />
    <polygon points="50,25 53,32 60,32 55,37 57,44 50,40 43,44 45,37 40,32 47,32" />
    <polygon points="35,50 38,57 45,57 40,62 42,69 35,65 28,69 30,62 25,57 32,57" />
    <polygon points="65,50 68,57 75,57 70,62 72,69 65,65 58,69 60,62 55,57 62,57" />
    <polygon points="50,65 53,72 60,72 55,77 57,84 50,80 43,84 45,77 40,72 47,72" />
  </svg>
);

const AkatsukiCloud = ({ className = "w-16 h-10 text-akatsuki-red/20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,5 80,18 C92,15 98,25 90,35 C98,48 80,55 70,48 C65,55 45,55 35,48 C28,52 22,50 20,40 Z" />
  </svg>
);

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <div className="absolute -top-1.5 -left-1.5 z-30 flex items-center justify-center">
        <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-lg border border-white/40 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
          <span className="font-bebas text-sm text-black font-bold mt-1">1</span>
          <svg className="absolute -top-2 w-4 h-4 text-[#FFD700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16h14M4 8l3 8h10l3-8-4 3-4-6-4 6-4-3z" />
          </svg>
        </div>
      </div>
    );
  }
  
  let bgClass = "from-zinc-400 to-zinc-600 border-white/20";
  if (rank === 2) bgClass = "from-slate-300 to-slate-500 border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.2)]";
  if (rank === 3) bgClass = "from-amber-600 to-amber-800 border-white/30 shadow-[0_0_8px_rgba(217,119,6,0.2)]";
  if (rank >= 4) bgClass = "from-black/60 to-black/80 border-white/15";

  return (
    <div className="absolute -top-1.5 -left-1.5 z-30 flex items-center justify-center">
      <div className={`w-7 h-7 flex items-center justify-center bg-gradient-to-br ${bgClass} rounded-full border text-[11px] font-bold font-sans text-white`}>
        {rank}
      </div>
    </div>
  );
};

interface MangaCardProps {
  title: string;
  rank: number;
  rating: string;
  overlayIcon: React.ReactNode;
  accentBorderClass: string;
}

const MangaCard: React.FC<MangaCardProps> = ({ title, rank, rating, overlayIcon, accentBorderClass }) => (
  <div className="group relative bg-[#0D0D10]/95 border border-white/10 rounded-xl overflow-hidden hover:bg-black/90 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_8px_22px_rgba(0,0,0,0.9)] cursor-pointer z-20 flex flex-col items-center">
    {/* Dynamic border glow overlay */}
    <div className={`absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 pointer-events-none z-30 ${accentBorderClass}`} />
    
    {/* Cover Image container */}
    <div className="relative w-full h-[155px] sm:h-[180px] overflow-hidden bg-[#121214]">
      <Image
        src="/images/manga_cover_generic.png"
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        sizes="(max-w-768px) 120px, 160px"
        priority
      />
      {/* Manga dot matrix overlay */}
      <div className="absolute inset-0 manga-screentone opacity-[0.12] pointer-events-none z-10" />

      {/* Floating dynamic icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110">
        {overlayIcon}
      </div>

      {/* Black vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-20" />

      {/* Rank Badge */}
      <RankBadge rank={rank} />

      {/* Rating badge centered at the bottom of cover */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 bg-black/85 backdrop-blur-xs border border-white/15 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
        <span className="text-[10px] font-bold text-white/95 font-sans leading-none">{rating}</span>
        <svg className="w-2.5 h-2.5 text-leaf-gold" fill="currentColor" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
    </div>

    {/* Metadata (Title) */}
    <div className="p-3 w-full text-center">
      <h3 className="font-bebas text-xs sm:text-sm tracking-wider text-white truncate transition-colors group-hover:text-shonen-orange duration-200 uppercase">
        {title}
      </h3>
    </div>
  </div>
);

export const TopManga: React.FC = () => {
  return (
    <section id="top-manga" className="relative bg-[#0A0A0C] py-8 md:py-10 overflow-hidden flex flex-col items-center justify-center border-b border-white/5">
      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 z-20 flex flex-col space-y-6 md:space-y-7">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-1">
          <h2 className="font-bebas text-2xl sm:text-3xl tracking-wider text-white select-none italic transform -skew-x-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            TOP <span className="text-leaf-gold">MANGA & ANIME</span> <span className="text-[10px] font-japanese tracking-normal text-white/30 ml-1 font-normal select-none uppercase not-italic">トップ</span>
          </h2>
          <p className="text-xs text-white/50 max-w-md mx-auto tracking-wide font-sans leading-relaxed">
            {"Real-time updates for the community's favorite stories. Read immediately as they release."}
          </p>
        </div>

        {/* Carousel Grid Area with Navigation Control Arrows */}
        <div className="relative w-full">
          {/* Left Arrow Button */}
          <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/70 border border-white/10 hover:border-leaf-gold/60 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer hidden xl:flex shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/70 border border-white/10 hover:border-leaf-gold/60 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer hidden xl:flex shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Grid Layout (7 Columns on large desktop screens, responsive layout otherwise) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
            <MangaCard
              title="One Piece"
              rank={1}
              rating="9.68"
              overlayIcon={<StrawHatIcon />}
              accentBorderClass="group-hover:border-yellow-500/50 group-hover:shadow-[inset_0_0_15px_rgba(234,179,8,0.2)]"
            />
            <MangaCard
              title="Bleach"
              rank={2}
              rating="9.47"
              overlayIcon={<HollowMaskIcon />}
              accentBorderClass="group-hover:border-slate-400/50 group-hover:shadow-[inset_0_0_15px_rgba(148,163,184,0.2)]"
            />
            <MangaCard
              title="Naruto"
              rank={3}
              rating="9.32"
              overlayIcon={<LeafSwirlIcon />}
              accentBorderClass="group-hover:border-orange-500/50 group-hover:shadow-[inset_0_0_15px_rgba(249,115,22,0.2)]"
            />
            <MangaCard
              title="Jujutsu Kaisen"
              rank={4}
              rating="9.24"
              overlayIcon={<CursedFlameIcon />}
              accentBorderClass="group-hover:border-purple-500/50 group-hover:shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]"
            />
            <MangaCard
              title="Demon Slayer"
              rank={5}
              rating="9.21"
              overlayIcon={<SunSwirlIcon />}
              accentBorderClass="group-hover:border-red-500/50 group-hover:shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]"
            />
            <MangaCard
              title="Chainsaw Man"
              rank={6}
              rating="9.10"
              overlayIcon={<ChainsawIcon />}
              accentBorderClass="group-hover:border-orange-600/50 group-hover:shadow-[inset_0_0_15px_rgba(220,38,38,0.2)]"
            />
            <MangaCard
              title="Dragon Ball S."
              rank={7}
              rating="9.05"
              overlayIcon={<DragonBallIcon />}
              accentBorderClass="group-hover:border-blue-500/50 group-hover:shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]"
            />
          </div>
        </div>

        {/* View All Rankings Link Button with Akatsuki Cloud Deco */}
        <div className="flex flex-col items-center justify-center pt-2 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-70 pointer-events-none animate-pulse z-0">
            <AkatsukiCloud className="w-16 h-10 text-akatsuki-red/10" />
          </div>
          
          <button className="relative z-10 bg-[#121214] hover:bg-black border border-white/10 hover:border-shonen-orange/40 font-bebas text-sm font-bold tracking-widest text-white hover:text-shonen-orange py-2 px-6 rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-md cursor-pointer uppercase">
            View All Rankings
          </button>
        </div>

      </div>
    </section>
  );
};
