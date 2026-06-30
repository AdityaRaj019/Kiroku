"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SakuraIcon } from "@/components/login/SakuraIcon";
import { LoginForm } from "@/components/login/LoginForm";
import { HeroSection } from "@/components/login/HeroSection";

interface Petal {
  id: number;
  x: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
}

export default function LoginPage() {
  // Tab & Live Activity states
  const [isTabActive, setIsTabActive] = useState(true);
  const [greeting, setGreeting] = useState({ part1: "", highlight: "", part2: "", emoji: "" });
  const [tickerIndex, setTickerIndex] = useState(0);
  const [leftPetals, setLeftPetals] = useState<Petal[]>([]);

  // Monitor document tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabActive(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Live Activity Ticker Rotation
  useEffect(() => {
    if (!isTabActive) return;
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(tickerTimer);
  }, [isTabActive]);

  // Dynamic Options (client-side only to prevent hydration mismatch)
  useEffect(() => {
    const GREETING_OPTIONS = [
      { part1: "Welcome back,", highlight: "Hero.", part2: "", emoji: "⚔️" },
      { part1: "Your story", highlight: "continues.", part2: "", emoji: "📖" },
      { part1: "The next", highlight: "chapter", part2: " awaits.", emoji: "✨" },
      { part1: "Ready for another", highlight: "adventure?", part2: "", emoji: "🚀" },
      { part1: "Every legend has another", highlight: "page.", part2: "", emoji: "📜" },
      { part1: "We've been saving your", highlight: "seat.", part2: "", emoji: "🛋️" },
      { part1: "Good to see you", highlight: "again.", part2: "", emoji: "🌸" },
      { part1: "The world of stories", highlight: "missed you.", part2: "", emoji: "🌍" }
    ];

    const randomGreeting = GREETING_OPTIONS[Math.floor(Math.random() * GREETING_OPTIONS.length)];

    // Generate left side petals
    const leftList: Petal[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 8 + 6, // 6px to 14px
      opacity: Math.random() * 0.08 + 0.04, // 4% to 12%
      duration: Math.random() * 12 + 18,
      delay: Math.random() * -20,
      drift: Math.random() * 80 - 40,
      rotation: Math.random() * 360 + 90
    }));

    // Defer state update to prevent cascading render warnings
    const timer = setTimeout(() => {
      setGreeting(randomGreeting);
      setLeftPetals(leftList);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const TICKER_ITEMS = [
    "🔥 2,341 users are tracking anime right now",
    "📖 18,402 chapters were marked as read today",
    "⭐ Solo Leveling is trending"
  ];

  return (
    <div className={`min-h-screen w-full flex bg-[#09090B] text-white overflow-hidden relative font-sans ${!isTabActive ? "paused-anim" : ""}`}>
      {/* ─── Stylesheet ─── */}
      <style jsx global>{`
        @keyframes fall-wind {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--petal-opacity);
          }
          50% {
            transform: translateY(50vh) translateX(var(--petal-drift)) rotate(var(--petal-mid-rot));
          }
          90% {
            opacity: var(--petal-opacity);
          }
          100% {
            transform: translateY(110vh) translateX(calc(var(--petal-drift) * 1.5)) rotate(var(--petal-max-rot));
            opacity: 0;
          }
        }
        @keyframes float-particle {
          0% { transform: translateY(105vh) translateX(0); opacity: 0; }
          50% { opacity: 0.12; }
          100% { transform: translateY(-5vh) translateX(30px); opacity: 0; }
        }
        @keyframes float-a {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        @keyframes float-c {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.2deg); }
        }
        @keyframes float-d {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes light-pulse {
          0%, 100% { opacity: 0.88; }
          50% { opacity: 1.0; }
        }
        @keyframes bar-grow {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        @keyframes disc-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fall-wind {
          animation: fall-wind 16s linear infinite;
        }
        .animate-float-particle {
          animation: float-particle 22s linear infinite;
        }
        .animate-float-a { animation: float-a 7.4s ease-in-out infinite; }
        .animate-float-b { animation: float-b 9.2s ease-in-out infinite; }
        .animate-float-c { animation: float-c 12s ease-in-out infinite; }
        .animate-float-d { animation: float-d 8.3s ease-in-out infinite; }
        .animate-light-pulse { animation: light-pulse 18s ease-in-out infinite; }
        .animate-disc { animation: disc-rotate 140s linear infinite; }
        
        .animate-bar-grow {
          animation: bar-grow 0.8s ease-in-out infinite;
        }

        .paused-anim * {
          animation-play-state: paused !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fall-wind,
          .animate-float-particle,
          .animate-float-a,
          .animate-float-b,
          .animate-float-c,
          .animate-float-d,
          .animate-light-pulse,
          .animate-disc,
          .animate-bar-grow {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* ─── LEFT SIDE (42-45% width) ─── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-[43%] flex flex-col justify-between p-8 md:p-12 lg:p-[72px] z-10 bg-[#09090B] relative overflow-hidden h-screen select-none shrink-0"
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-40" />

        {/* Ambient glows behind the login form */}
        <div 
          className="absolute top-[20%] -left-[20%] w-[380px] h-[380px] rounded-full blur-[110px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, rgba(255, 95, 168, 0.2) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-[20%] -right-[15%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-15"
          style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)" }}
        />

        {/* Left Side Drift Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {leftPetals.map((petal) => (
            <div
              key={petal.id}
              className="absolute text-pink-400 select-none animate-fall-wind pointer-events-none"
              style={{
                left: `${petal.x}%`,
                fontSize: `${petal.size}px`,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
                "--petal-opacity": petal.opacity,
                "--petal-drift": `${petal.drift}px`,
                "--petal-mid-rot": `${petal.rotation / 2}deg`,
                "--petal-max-rot": `${petal.rotation}deg`,
              } as React.CSSProperties}
            >
              🌸
            </div>
          ))}
        </div>

        {/* Logo and Brand */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2.5 z-10"
        >
          <SakuraIcon className="w-6.5 h-6.5" />
          <div className="flex flex-col">
            <span className="font-bebas text-2xl tracking-[0.15em] text-white leading-none font-bold">
              KIROKU
            </span>
            <span className="text-[9px] font-japanese text-[#A1A1AA] tracking-[0.2em] leading-tight">
              記録する
            </span>
          </div>
        </motion.div>

        {/* Dynamic Welcome Heading and Form Wrapper */}
        <div className="my-auto py-6 max-w-[380px] w-full z-10 flex flex-col gap-6">
          <div className="space-y-3">
            {/* Heading Animating Line-by-line */}
            {greeting.part1 && (
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                className="text-[44px] sm:text-[52px] md:text-[56px] font-bold tracking-tight text-white leading-[1.05]"
              >
                {greeting.part1}<br />
                <span className="bg-gradient-to-r from-[#FF5FA8] to-[#A855F7] bg-clip-text text-transparent">
                  {greeting.highlight}
                </span>
                {greeting.part2} {greeting.emoji}
              </motion.h1>
            )}

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              className="text-xs sm:text-[13px] text-[#A1A1AA] leading-relaxed"
            >
              The world&apos;s stories are waiting for you.<br />
              Let&apos;s continue your journey.
            </motion.p>
          </div>

          {/* Login Form Component */}
          <LoginForm />
        </div>

        {/* Footer Redirect & Live Ticker */}
        <div className="z-10 flex flex-col gap-5 pt-4">
          
          {/* Live Activity Ticker */}
          <div className="h-5 overflow-hidden relative flex items-center justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={tickerIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-[11px] font-mono text-[#A1A1AA] flex items-center gap-1.5 font-semibold"
              >
                {TICKER_ITEMS[tickerIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between text-xs text-[#A1A1AA] border-t border-white/5 pt-4">
            <span>
              New here?{" "}
              <Link
                href="/register"
                className="relative group inline-block font-semibold text-white outline-none ml-1"
              >
                Create an account
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#FF5FA8] to-[#A855F7] group-hover:w-full transition-all duration-300" />
              </Link>
            </span>
            <span className="text-[10px] font-mono opacity-40">Kiroku v1.1</span>
          </div>
        </div>
      </motion.div>

      {/* ─── RIGHT HERO SECTION (55-58% width) ─── */}
      <HeroSection isTabActive={isTabActive} />
    </div>
  );
}
