"use client";

import React from "react";
import Image from "next/image";

// Shuriken icon for header styling
const Shuriken: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-shonen-orange" }) => (
  <svg className={`${className} transition-transform duration-700 hover:rotate-180`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 0 L58 38 L96 46 L60 54 L68 92 L50 62 L32 92 L40 54 L4 46 L42 38 Z M50 38 A12 12 0 1 0 50 62 A12 12 0 1 0 50 38 Z" />
  </svg>
);

// High-fidelity custom SVG badges matching landing_page.png (Scaled Up)
const SkullBadge = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#121214] border border-white/10 group-hover:border-[#E52521] group-hover:shadow-[0_0_15px_rgba(229,37,33,0.4)] transition-all duration-300">
    <svg className="w-5.5 h-5.5 text-white/70 group-hover:text-[#E52521] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 2.2.7 4.2 1.9 5.9L4 18v3c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-2h4v2c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-3l.1-.1C21.3 16.2 22 14.2 22 12c0-5.5-4.5-10-10-10z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M12 13v2M9 17h6" />
    </svg>
  </div>
);

const BellBadge = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#121214] border border-white/10 group-hover:border-[#FF6B00] group-hover:shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all duration-300">
    <svg className="w-5.5 h-5.5 text-white/70 group-hover:text-[#FF6B00] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  </div>
);

const CrownBadge = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#121214] border border-white/10 group-hover:border-[#FFD700] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all duration-300">
    <svg className="w-5.5 h-5.5 text-white/70 group-hover:text-[#FFD700] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  </div>
);

const StarBadge = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#121214] border border-white/10 group-hover:border-[#FFD700] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all duration-300">
    <svg className="w-5.5 h-5.5 text-white/70 group-hover:text-[#FFD700] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  </div>
);

const InfoBadge = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#121214] border border-white/10 group-hover:border-[#06B6D4] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300">
    <svg className="w-5.5 h-5.5 text-white/70 group-hover:text-[#06B6D4] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  </div>
);

const SyncBadge = () => (
  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#121214] border border-white/10 group-hover:border-[#3B82F6] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300">
    <svg className="w-5.5 h-5.5 text-white/70 group-hover:text-[#3B82F6] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  </div>
);

interface FeatureCardProps {
  imageSrc: string;
  badge: React.ReactNode;
  title: string;
  description: string;
  borderColorClass: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, badge, title, description, borderColorClass }) => (
  <div className="group relative bg-[#0D0D10]/95 border border-white/10 rounded-2xl overflow-hidden hover:bg-black/90 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(0,0,0,0.9)] flex flex-col justify-between z-20">
    {/* Border highlight overlay on hover */}
    <div className={`absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 pointer-events-none z-30 ${borderColorClass}`} />

    {/* Top part: Character Image container (Scaled Up Height) */}
    <div className="relative w-full h-[160px] sm:h-[185px] overflow-hidden bg-[#121214] border-b border-white/10">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        sizes="(max-w-768px) 200px, 300px"
        priority
      />
      {/* Manga Screentone Overlay */}
      <div className="absolute inset-0 manga-screentone opacity-15 pointer-events-none z-10" />
      {/* Gradient fade to bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />
    </div>

    {/* Bottom part: Content & Badge (Scaled Up Padding and spacing) */}
    <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
      <div className="text-center flex-grow flex flex-col justify-start">
        <h3 className="font-bebas text-base sm:text-lg md:text-xl tracking-wider text-white mb-2 transition-colors group-hover:text-shonen-orange line-clamp-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-white/50 font-sans leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Decorative center badge row */}
      <div className="flex items-center justify-center gap-3 mt-4 pt-3.5 border-t border-white/5">
        <span className="text-[10px] text-white/20 select-none font-mono font-bold">+</span>
        <div className="transform transition-transform group-hover:scale-105 duration-300">
          {badge}
        </div>
        <span className="text-[10px] text-white/20 select-none font-mono font-bold">+</span>
      </div>
    </div>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative bg-[#0A0A0C] border-b border-white/5 py-10 md:py-12 overflow-hidden flex flex-col items-center justify-center">
      {/* CSS Smoky Keyframes styling */}
      <style jsx global>{`
        @keyframes smoke-drift-slow {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.15; }
          50% { transform: translate(4%, -4%) scale(1.1); opacity: 0.28; }
          100% { transform: translate(0%, 0%) scale(1); opacity: 0.15; }
        }
        @keyframes smoke-drift-reverse {
          0% { transform: translate(0%, 0%) scale(1.08); opacity: 0.12; }
          50% { transform: translate(-4%, 4%) scale(0.92); opacity: 0.25; }
          100% { transform: translate(0%, 0%) scale(1.08); opacity: 0.12; }
        }
        .animate-smoke-slow {
          animation: smoke-drift-slow 20s ease-in-out infinite;
        }
        .animate-smoke-reverse {
          animation: smoke-drift-reverse 17s ease-in-out infinite;
        }
      `}</style>

      {/* Manga Panel Background Layer (Opaque style) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/manga_panel_bg.png"
          alt="Manga Panels Background"
          fill
          className="object-cover opacity-[0.16] mix-blend-luminosity filter contrast-125"
          priority
        />
        {/* Radial and Linear Overlays to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-[#0A0A0C] opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,12,0.1)_25%,#0A0A0C_95%)]" />
      </div>

      {/* Smoky Effect Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute w-[600px] h-[400px] rounded-full bg-white/[0.04] blur-[110px] -top-12 -left-12 animate-smoke-slow" />
        <div className="absolute w-[700px] h-[550px] rounded-full bg-shonen-orange/[0.06] blur-[130px] -bottom-24 right-12 animate-smoke-reverse" />
        <div className="absolute w-[500px] h-[400px] rounded-full bg-white/[0.02] blur-[90px] top-1/3 left-1/4 animate-smoke-slow" />
      </div>

      {/* Content Container (Expanded max-width to 1480px) */}
      <div className="relative w-full max-w-[1480px] mx-auto px-6 md:px-12 z-20 flex flex-col space-y-8 md:space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-4 select-none">
            <Shuriken className="w-6 h-6 text-shonen-orange/70" />
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white italic transform -skew-x-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              POWERFUL <span className="text-shonen-orange">FEATURES</span>
            </h2>
            <Shuriken className="w-6 h-6 text-shonen-orange/70" />
          </div>
          <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto tracking-wide font-sans leading-relaxed">
            Supercharge your reading journey with state-of-the-art tools designed for active manga followers.
          </p>
        </div>

        {/* Feature Cards Grid (6 Columns on desktop, responsive layout, cards are now wider and taller) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6 w-full">
          <FeatureCard
            imageSrc="/images/feat_luffy.png"
            badge={<SkullBadge />}
            title="TRACK ALL MANGA & ANIME"
            description="Track your list, reading status, and progress in one place."
            borderColorClass="group-hover:border-red-500/50 group-hover:shadow-[inset_0_0_20px_rgba(239,68,68,0.25)]"
          />
          <FeatureCard
            imageSrc="/images/feat_goku.png"
            badge={<BellBadge />}
            title="INSTANT NOTIFICATIONS"
            description="Get notified via Email or in-app whenever there is a new chapter or episode."
            borderColorClass="group-hover:border-yellow-500/50 group-hover:shadow-[inset_0_0_20px_rgba(234,179,8,0.25)]"
          />
          <FeatureCard
            imageSrc="/images/feat_naruto.png"
            badge={<CrownBadge />}
            title="RANKINGS & TOP LISTS"
            description="Explore top manga and anime rankings updated regularly."
            borderColorClass="group-hover:border-orange-500/50 group-hover:shadow-[inset_0_0_20px_rgba(249,115,22,0.25)]"
          />
          <FeatureCard
            imageSrc="/images/feat_kakashi.png"
            badge={<StarBadge />}
            title="PERSONALIZED RECOMMENDATIONS"
            description="Get suggestions tailored to your taste and reading habits."
            borderColorClass="group-hover:border-emerald-500/50 group-hover:shadow-[inset_0_0_20px_rgba(16,185,129,0.25)]"
          />
          <FeatureCard
            imageSrc="/images/feat_vegeta.png"
            badge={<InfoBadge />}
            title="DETAILED INFORMATION"
            description="Get info about manga, anime, characters, and more."
            borderColorClass="group-hover:border-indigo-500/50 group-hover:shadow-[inset_0_0_20px_rgba(99,102,241,0.25)]"
          />
          <FeatureCard
            imageSrc="/images/feat_chopper.png"
            badge={<SyncBadge />}
            title="CROSS-PLATFORM SYNC"
            description="Access your data anywhere, anytime seamlessly."
            borderColorClass="group-hover:border-pink-500/50 group-hover:shadow-[inset_0_0_20px_rgba(236,72,153,0.25)]"
          />
        </div>
      </div>
    </section>
  );
};
