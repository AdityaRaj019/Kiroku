"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  // Track Mouse Movements for Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientWidth, clientHeight } = document.documentElement;
      const x = (e.clientX / clientWidth - 0.5) * 2;
      const y = (e.clientY / clientHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

      {/* ─── Hero Illustration Layer with breathing loop ─── */}
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
            {/* Parallax mouse offset wrapper */}
            <motion.div
              animate={{
                x: mousePos.x * 12,
                y: mousePos.y * 7
              }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/10 to-[#09090B]/40 opacity-70 z-10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#09090B_95%)] opacity-85 z-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── FLOATING GLASS CARDS ─── */}

      {/* Card 1: Top Left Welcoming Greeting */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: mousePos.x * 20,
          y: mousePos.y * 12,
          rotateX: mousePos.y * -8,
          rotateY: mousePos.x * 8
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 20px 40px rgba(255, 95, 168, 0.15)",
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
          <GlassCard className="max-w-[220px]">
            <span className="text-xl">🌸</span>
            <h4 className="font-japanese font-bold text-sm text-pink-300 mt-1">{activeTheme.card1.greeting}</h4>
            <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">{activeTheme.card1.subtitle}</p>
          </GlassCard>
        </div>
      </motion.div>

      {/* Card 2: Lower Right Daily Reminder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: mousePos.x * 20,
          y: mousePos.y * 12,
          rotateX: mousePos.y * -8,
          rotateY: mousePos.x * 8
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 20px 40px rgba(255, 95, 168, 0.15)",
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
          <GlassCard className="max-w-[230px]">
            <h4 className="font-bold text-xs text-pink-300 flex items-center gap-1.5 leading-none">
              <span>📖</span> {activeTheme.card2.title}
            </h4>
            <div className="text-[10px] text-zinc-400 mt-2 space-y-0.5 leading-relaxed font-semibold">
              {activeTheme.card2.lines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Card 3: Bottom Left Dynamic Quote */}
      {quote.text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: mousePos.x * 20,
            y: mousePos.y * 12,
            rotateX: mousePos.y * -6,
            rotateY: mousePos.x * 6
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)",
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
            <GlassCard className="max-w-[240px]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 block mb-1">Today&apos;s Quote 💬</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed italic font-semibold">&ldquo;{quote.text}&rdquo;</p>
              <span className="text-[9px] text-zinc-500 block mt-1.5 text-right font-semibold">— {quote.author}</span>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* Card 4: Bottom Center Music Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: mousePos.x * 20,
          y: mousePos.y * 12,
          rotateX: mousePos.y * -6,
          rotateY: mousePos.x * 6
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)",
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
          <GlassCard className="min-w-[260px] p-4 flex items-center gap-3">
            {/* Rotating Disc */}
            <div className="relative w-10 h-10 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0 animate-disc">
              <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-black/40" />
            </div>
            <div className="flex-1 min-w-0 select-none">
              <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 block">Now Playing 🎵</span>
              <h4 className="font-bold text-xs text-white truncate">{activeTheme.card4.song}</h4>
              <p className="text-[9px] text-zinc-400 truncate">{activeTheme.card4.artist}</p>
            </div>
            {/* Waveform visual bars */}
            <div className="flex items-end gap-0.5 h-3 shrink-0">
              <div className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-1" />
              <div className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-2" style={{ animationDelay: "0.15s" }} />
              <div className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-3" style={{ animationDelay: "0.3s" }} />
              <div className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-4" style={{ animationDelay: "0.45s" }} />
              <div className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-5" style={{ animationDelay: "0.6s" }} />
              <div className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-6" style={{ animationDelay: "0.75s" }} />
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};
