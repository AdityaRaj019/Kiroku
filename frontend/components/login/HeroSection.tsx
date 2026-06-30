"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  isTabActive: boolean;
}

interface HeroTheme {
  season: "spring" | "summer" | "autumn" | "winter";
  name: string;
  imagePath: string;
  description: string;
  accentGlow: string;
  card1: { greeting: string; subtitle: string };
  card2: { title: string; lines: string[] };
  card4: { song: string; artist: string };
  petalEmoji: string;
}

const HERO_THEMES: HeroTheme[] = [
  {
    season: "spring",
    name: "Spring",
    imagePath: "/images/theme_spring.png",
    description: "Shrine maiden with sakura",
    accentGlow: "rgba(255, 95, 168, 0.15)",
    card1: { greeting: "おかえりなさい！", subtitle: "Your adventure continues ✨" },
    card2: { title: "📖 Daily Reminder", lines: ["Every page you read,", "Every episode you watch,", "Makes you better than yesterday."] },
    card4: { song: "Samurai Heart", artist: "Somei Sakura" },
    petalEmoji: "🌸"
  },
  {
    season: "summer",
    name: "Summer",
    imagePath: "/images/theme_summer.png",
    description: "Beach sunset character",
    accentGlow: "rgba(251, 191, 36, 0.15)",
    card1: { greeting: "こんにちは！", subtitle: "Catch the summer breeze 🌊" },
    card2: { title: "☀️ Summer Grind", lines: ["Heat of the sun,", "Fire in your eyes,", "Log your progress today."] },
    card4: { song: "Summer Sunset", artist: "Shinkai Beats" },
    petalEmoji: "✨"
  },
  {
    season: "autumn",
    name: "Autumn",
    imagePath: "/images/theme_autumn.png",
    description: "Red maple leaves and traditional street",
    accentGlow: "rgba(239, 68, 68, 0.15)",
    card1: { greeting: "お疲れ様でした！", subtitle: "Cozy autumn evenings 🍂" },
    card2: { title: "🍂 Leaf Count", lines: ["Like falling leaves,", "Every small step accumulates,", "Into a mountain of progress."] },
    card4: { song: "Autumn Breeze", artist: "Maple Symphony" },
    petalEmoji: "🍁"
  },
  {
    season: "winter",
    name: "Winter",
    imagePath: "/images/theme_winter.png",
    description: "Snowy temple with lanterns",
    accentGlow: "rgba(168, 85, 247, 0.15)",
    card1: { greeting: "はじめまして！", subtitle: "Stay warm in the snow ❄️" },
    card2: { title: "❄️ Winter Focus", lines: ["Cold nights call for", "Good books and hot tea.", "Warm your heart with stories."] },
    card4: { song: "Snowy Temple", artist: "Winter Lullaby" },
    petalEmoji: "❄️"
  }
];

interface Petal {
  id: number;
  x: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
  zIndex: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isTabActive }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [quote, setQuote] = useState({ text: "", author: "" });

  const [petals, setPetals] = useState<Petal[]>([]);
  const [ambientParticles, setAmbientParticles] = useState<{ id: number; x: number; size: number; duration: number; delay: number }[]>([]);

  // Compute daily parameters (client-side only to prevent SSR hydration mismatch)
  useEffect(() => {
    const QUOTE_OPTIONS = [
      { text: "The journey of a thousand stories begins with one step.", author: "Keep going 🌸" },
      { text: "A page turned is a world discovered. What will you find today?", author: "Read on 📖" },
      { text: "Even the strongest heroes need to track their progress.", author: "Track wisely 🛡️" },
      { text: "Your reading list is a library of your soul's adventures.", author: "Cataloger 📚" },
      { text: "In the world of manga, reality is whatever you dare to imagine.", author: "Dreamer ✨" }
    ];

    // Compute daily theme index based on day of the year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const dailyThemeIndex = dayOfYear % HERO_THEMES.length;

    const randomQuote = QUOTE_OPTIONS[Math.floor(Math.random() * QUOTE_OPTIONS.length)];

    // Generate falling petals
    const rightList: Petal[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 10 + 8, // 8px to 18px
      opacity: Math.random() * 0.15 + 0.1, // 10% to 25%
      duration: Math.random() * 8 + 12, // 12s to 20s
      delay: Math.random() * -20,
      drift: Math.random() * 120 - 60,
      rotation: Math.random() * 360 + 180,
      zIndex: Math.random() > 0.5 ? 40 : 10,
    }));

    // Generate dust particles
    const dustList = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 2 + 1, // 1px to 3px
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -30,
    }));

    const timer = setTimeout(() => {
      setCurrentThemeIndex(dailyThemeIndex);
      setQuote(randomQuote);
      setPetals(rightList);
      setAmbientParticles(dustList);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate themes (pictures) every 6 seconds
  useEffect(() => {
    if (!isTabActive) return;
    const rotationTimer = setInterval(() => {
      setCurrentThemeIndex((prev) => (prev + 1) % HERO_THEMES.length);
    }, 6000);
    return () => clearInterval(rotationTimer);
  }, [isTabActive]);

  const activeTheme = HERO_THEMES[currentThemeIndex];

  return (
    <div className={`hidden lg:flex lg:w-[57%] relative h-screen bg-[#111116] overflow-hidden flex-col justify-between p-12 select-none border-l border-white/5 ${!isTabActive ? "paused-anim" : ""}`}>
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />

      {/* Dynamic Sunset / Season Glowing Background Volumetric Lights */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-30 mix-blend-screen animate-light-pulse">
        <div
          className="absolute top-[10%] left-[20%] w-[650px] h-[650px] rounded-full blur-[140px] transition-colors duration-[1.6s] ease-in-out"
          style={{
            background: `radial-gradient(circle, ${activeTheme.accentGlow} 0%, transparent 70%)`
          }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] w-[750px] h-[750px] rounded-full blur-[150px] transition-colors duration-[1.6s] ease-in-out"
          style={{
            background: `radial-gradient(circle, ${activeTheme.accentGlow} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Ambient floating dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {ambientParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-pink-300/40 animate-float-particle pointer-events-none"
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Sakura petals falling in right section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 1.0 }}
        className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      >
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute select-none animate-fall-wind pointer-events-none"
            style={{
              left: `${petal.x}%`,
              fontSize: `${petal.size}px`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`,
              zIndex: petal.zIndex,
              "--petal-opacity": petal.opacity,
              "--petal-drift": `${petal.drift}px`,
              "--petal-mid-rot": `${petal.rotation / 2}deg`,
              "--petal-max-rot": `${petal.rotation}deg`,
            } as React.CSSProperties}
          >
            {activeTheme.petalEmoji}
          </div>
        ))}
      </motion.div>

      {/* ─── Hero Illustration Layer with breathing loop and season transitions ─── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full">
          {/* Internal breathing animation */}
          <motion.div
            animate={{
              scale: [1, 1.015, 1],
              y: [0, -4, 0]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Static wrapper (no mouse parallax movement on hover) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeTheme.imagePath}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={activeTheme.imagePath}
                    alt={activeTheme.description}
                    fill
                    priority
                    sizes="58vw"
                    className="object-cover object-center select-none"
                  />
                  {/* Subtle warm sunset lighting mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/10 to-[#09090B]/40 opacity-75 z-10" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#09090B_95%)] opacity-85 z-10" />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── FLOATING GLASS CARDS ─── */}

      {/* Card 1: Top Left Welcoming Greeting */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.05,
          rotate: "1deg",
          boxShadow: "0 25px 50px -12px rgba(255, 95, 168, 0.25)"
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 22,
          delay: 2.1
        }}
        className="absolute top-[12%] left-[8%] z-30 pointer-events-auto cursor-pointer"
      >
        <div className="animate-float-a">
          {/* Polaroid style badge */}
          <div className="relative bg-white text-zinc-900 p-3 pb-5 rounded-xs shadow-2xl border border-white/90 rotate-[-4deg] w-[190px] select-none">
            {/* Washi Tape */}
            <div className="absolute -top-3 left-[28%] w-16 h-5 bg-pink-100/60 border border-white/20 backdrop-blur-[1px] rotate-[-6deg] shadow-xs" />
            <div className="w-full aspect-[4/3] bg-pink-50/50 rounded-xs mb-3 flex items-center justify-center text-3xl border border-pink-100/80">
              🌸
            </div>
            <div className="px-0.5 text-center">
              <h4 className="font-japanese font-bold text-xs text-pink-600 leading-tight">
                {activeTheme.card1.greeting}
              </h4>
              <p className="text-[9px] font-medium text-zinc-500 mt-1 leading-normal italic">
                {activeTheme.card1.subtitle}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Lower Right Daily Reminder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.05,
          rotate: "-1deg",
          boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25)"
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 22,
          delay: 2.15
        }}
        className="absolute bottom-[22%] right-[6%] z-30 pointer-events-auto cursor-pointer"
      >
        <div className="animate-float-b">
          {/* Memo Pad / Sticky Note style badge */}
          <div className="relative bg-[#FFFDF2] text-zinc-800 p-4 rounded-lg shadow-2xl border border-[#EDE7CE] rotate-[3deg] w-[210px] select-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px]">
            {/* Cute Paperclip */}
            <div className="absolute -top-3.5 right-6 w-3.5 h-7.5 bg-zinc-300/90 rounded-full border border-zinc-400/80 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-5 border border-zinc-400/50 rounded-full" />
            </div>
            <h4 className="font-bold text-[11px] text-amber-700 flex items-center gap-1.5 leading-none border-b border-dashed border-[#ECE6CD] pb-2 font-mono uppercase tracking-wide">
              <span>🗒️</span> {activeTheme.card2.title}
            </h4>
            <div className="text-[9.5px] text-zinc-600 mt-2 space-y-1.5 leading-relaxed font-mono font-medium">
              {activeTheme.card2.lines.map((line, idx) => (
                <p key={idx} className="border-b border-[#ECE6CD]/60 pb-0.5 last:border-b-0">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Bottom Left Dynamic Quote */}
      {quote.text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 35px rgba(168, 85, 247, 0.4)"
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 22,
            delay: 2.2
          }}
          className="absolute bottom-[16%] left-[6%] z-30 pointer-events-auto cursor-pointer"
        >
          <div className="animate-float-c">
            {/* Elegant Speech Bubble / Diary Entry badge */}
            <div className="relative bg-purple-950/30 backdrop-blur-md border border-purple-400/35 p-4 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.15)] w-[230px] text-white">
              {/* Cute Sparkle decoration */}
              <div className="absolute -top-2.5 -right-1 text-sm animate-bounce">✨</div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-purple-300 block mb-1.5 font-mono">
                Today&apos;s Thought 💬
              </span>
              <p className="text-[10.5px] text-purple-100 leading-relaxed italic font-medium">
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-400/20 text-[8px] text-purple-300/80 font-semibold font-mono">
                <span>KIROKU DIARY</span>
                <span className="text-purple-200">— {quote.author}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Card 4: Bottom Center Music Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.04,
          boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25)"
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 22,
          delay: 2.25
        }}
        className="absolute bottom-[4%] left-[22%] z-30 pointer-events-auto cursor-pointer"
      >
        <div className="animate-float-d">
          {/* Aesthetic Music Tape / Vinyl deck */}
          <div className="bg-[#15131C]/90 backdrop-blur-md border border-white/[0.08] p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 w-[260px]">
            {/* Rotating Disc */}
            <div className="relative w-10.5 h-10.5 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0">
              <div className="absolute inset-0.5 rounded-full border border-dashed border-zinc-700/60 animate-disc" />
              <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-black/40 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-950" />
              </div>
            </div>
            <div className="flex-1 min-w-0 select-none">
              <span className="text-[8px] font-bold uppercase tracking-wider text-pink-400 block font-mono">Now Playing 🎵</span>
              <h4 className="font-bold text-xs text-white truncate leading-none mt-1">{activeTheme.card4.song}</h4>
              <p className="text-[9px] text-zinc-400 truncate mt-1">{activeTheme.card4.artist}</p>
              
              {/* Music Progress Bar */}
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 relative overflow-hidden">
                <motion.div
                  initial={{ width: "15%" }}
                  animate={{ width: ["15%", "85%", "15%"] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF5FA8] to-[#A855F7] rounded-full"
                />
              </div>
            </div>
            {/* Waveform visual bars */}
            <div className="flex items-end gap-0.5 h-4 shrink-0 pb-0.5">
              <div className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-1" />
              <div className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-2" style={{ animationDelay: "0.15s" }} />
              <div className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-3" style={{ animationDelay: "0.3s" }} />
              <div className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-4" style={{ animationDelay: "0.45s" }} />
              <div className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-5" style={{ animationDelay: "0.6s" }} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
