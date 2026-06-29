"use client";

import { useState, useEffect, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiFetch } from "@/utils/api";
import type { AuthResponse } from "@/types/auth";

// ─── Validation ──────────────────────────────────────────────

interface FieldErrors {
  email?: string;
  password?: string;
}

function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

// ─── Seasonal Hero Themes ────────────────────────────────────

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
    card1: {
      greeting: "おかえりなさい！",
      subtitle: "Your adventure continues ✨",
    },
    card2: {
      title: "📖 Daily Reminder",
      lines: [
        "Every page you read,",
        "Every episode you watch,",
        "Makes you better than yesterday.",
      ],
    },
    card4: { song: "Samurai Heart", artist: "Somei Sakura" },
    petalEmoji: "🌸",
  },
  {
    season: "summer",
    name: "Summer",
    imagePath: "/images/theme_summer.png",
    description: "Beach sunset character",
    accentGlow: "rgba(251, 191, 36, 0.15)",
    card1: { greeting: "こんにちは！", subtitle: "Catch the summer breeze 🌊" },
    card2: {
      title: "☀️ Summer Grind",
      lines: [
        "Heat of the sun,",
        "Fire in your eyes,",
        "Log your progress today.",
      ],
    },
    card4: { song: "Summer Sunset", artist: "Shinkai Beats" },
    petalEmoji: "✨",
  },
  {
    season: "autumn",
    name: "Autumn",
    imagePath: "/images/theme_autumn.png",
    description: "Red maple leaves and traditional street",
    accentGlow: "rgba(239, 68, 68, 0.15)",
    card1: {
      greeting: "お疲れ様でした！",
      subtitle: "Cozy autumn evenings 🍂",
    },
    card2: {
      title: "🍂 Leaf Count",
      lines: [
        "Like falling leaves,",
        "Every small step accumulates,",
        "Into a mountain of progress.",
      ],
    },
    card4: { song: "Autumn Breeze", artist: "Maple Symphony" },
    petalEmoji: "🍁",
  },
  {
    season: "winter",
    name: "Winter",
    imagePath: "/images/theme_winter.png",
    description: "Snowy temple with lanterns",
    accentGlow: "rgba(168, 85, 247, 0.15)",
    card1: { greeting: "はじめまして！", subtitle: "Stay warm in the snow ❄️" },
    card2: {
      title: "❄️ Winter Focus",
      lines: [
        "Cold nights call for",
        "Good books and hot tea.",
        "Warm your heart with stories.",
      ],
    },
    card4: { song: "Snowy Temple", artist: "Winter Lullaby" },
    petalEmoji: "❄️",
  },
];

const SakuraIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 50 C45 35, 30 25, 25 35 C20 45, 35 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <path
      d="M50 50 C65 35, 80 25, 75 35 C70 45, 65 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <path
      d="M50 50 C65 65, 80 75, 75 65 C70 55, 65 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <path
      d="M50 50 C35 65, 20 75, 25 65 C30 55, 35 50, 50 50 Z"
      fill="url(#sakura-grad)"
    />
    <circle cx="50" cy="50" r="6" fill="#FCA5A5" />
    <defs>
      <linearGradient id="sakura-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5FA8" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
  </svg>
);

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

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Tab & Seasonal theme states
  const [isTabActive, setIsTabActive] = useState(true);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [greeting, setGreeting] = useState({
    part1: "",
    highlight: "",
    part2: "",
    emoji: "",
  });
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [tickerIndex, setTickerIndex] = useState(0);

  // Petals & ambient particles
  const [petals, setPetals] = useState<Petal[]>([]);
  const [leftPetals, setLeftPetals] = useState<Petal[]>([]);
  const [ambientParticles, setAmbientParticles] = useState<
    { id: number; x: number; size: number; duration: number; delay: number }[]
  >([]);

  // Parallax mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle document tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabActive(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Theme automatic rotation
  useEffect(() => {
    if (!isTabActive) return;
    const rotationTimer = setInterval(() => {
      setCurrentThemeIndex((prev) => (prev + 1) % HERO_THEMES.length);
    }, 15000);
    return () => clearInterval(rotationTimer);
  }, [isTabActive]);

  // Live Activity Ticker Rotation
  useEffect(() => {
    if (!isTabActive) return;
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(tickerTimer);
  }, [isTabActive]);

  // Initialize random dynamic options (client-side only to prevent hydration mismatch)
  useEffect(() => {
    const GREETING_OPTIONS = [
      { part1: "Welcome back,", highlight: "Hero.", part2: "", emoji: "⚔️" },
      { part1: "Your story", highlight: "continues.", part2: "", emoji: "📖" },
      {
        part1: "The next",
        highlight: "chapter",
        part2: " awaits.",
        emoji: "✨",
      },
      {
        part1: "Ready for another",
        highlight: "adventure?",
        part2: "",
        emoji: "🚀",
      },
      {
        part1: "Every legend has another",
        highlight: "page.",
        part2: "",
        emoji: "📜",
      },
      {
        part1: "We've been saving your",
        highlight: "seat.",
        part2: "",
        emoji: "🛋️",
      },
      { part1: "Good to see you", highlight: "again.", part2: "", emoji: "🌸" },
      {
        part1: "The world of stories",
        highlight: "missed you.",
        part2: "",
        emoji: "🌍",
      },
    ];

    const QUOTE_OPTIONS = [
      {
        text: "The journey of a thousand stories begins with one step.",
        author: "Keep going 🌸",
      },
      {
        text: "A page turned is a world discovered. What will you find today?",
        author: "Read on 📖",
      },
      {
        text: "Even the strongest heroes need to track their progress.",
        author: "Track wisely 🛡️",
      },
      {
        text: "Your reading list is a library of your soul's adventures.",
        author: "Cataloger 📚",
      },
      {
        text: "In the world of manga, reality is whatever you dare to imagine.",
        author: "Dreamer ✨",
      },
    ];

    const randomGreeting =
      GREETING_OPTIONS[Math.floor(Math.random() * GREETING_OPTIONS.length)];
    const randomQuote =
      QUOTE_OPTIONS[Math.floor(Math.random() * QUOTE_OPTIONS.length)];

    // Generate right side petals
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

    // Generate left side petals
    const leftList: Petal[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 8 + 6, // 6px to 14px
      opacity: Math.random() * 0.08 + 0.04, // 4% to 12%
      duration: Math.random() * 12 + 18,
      delay: Math.random() * -20,
      drift: Math.random() * 80 - 40,
      rotation: Math.random() * 360 + 90,
      zIndex: 5,
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
      setGreeting(randomGreeting);
      setQuote(randomQuote);
      setPetals(rightList);
      setLeftPetals(leftList);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validation
    const errors = validateLogin(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data?.error ?? data?.message ?? "Invalid email or password",
        );
        return;
      }

      const authData = data as AuthResponse;
      setSession(authData.user, authData.accessToken);
      router.push("/dashboard");
    } catch {
      setServerError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const TICKER_ITEMS = [
    "🔥 2,341 users are tracking anime right now",
    "📖 18,402 chapters were marked as read today",
    "⭐ Solo Leveling is trending",
  ];

  return (
    <div
      className={`min-h-screen w-full flex bg-[#09090B] text-white overflow-hidden relative font-sans ${!isTabActive ? "paused-anim" : ""}`}
    >
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
            transform: translateY(50vh) translateX(var(--petal-drift))
              rotate(var(--petal-mid-rot));
          }
          90% {
            opacity: var(--petal-opacity);
          }
          100% {
            transform: translateY(110vh)
              translateX(calc(var(--petal-drift) * 1.5))
              rotate(var(--petal-max-rot));
            opacity: 0;
          }
        }
        @keyframes float-particle {
          0% {
            transform: translateY(105vh) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.12;
          }
          100% {
            transform: translateY(-5vh) translateX(30px);
            opacity: 0;
          }
        }
        @keyframes float-a {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes float-b {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }
        @keyframes float-c {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(1.2deg);
          }
        }
        @keyframes float-d {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes light-pulse {
          0%,
          100% {
            opacity: 0.88;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes bar-grow {
          0%,
          100% {
            height: 4px;
          }
          50% {
            height: 12px;
          }
        }
        @keyframes disc-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fall-wind {
          animation: fall-wind 16s linear infinite;
        }
        .animate-float-particle {
          animation: float-particle 22s linear infinite;
        }
        .animate-float-a {
          animation: float-a 7.4s ease-in-out infinite;
        }
        .animate-float-b {
          animation: float-b 9.2s ease-in-out infinite;
        }
        .animate-float-c {
          animation: float-c 12s ease-in-out infinite;
        }
        .animate-float-d {
          animation: float-d 8.3s ease-in-out infinite;
        }
        .animate-light-pulse {
          animation: light-pulse 18s ease-in-out infinite;
        }
        .animate-disc {
          animation: disc-rotate 140s linear infinite;
        }

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
        {/* Left Side Drift Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {leftPetals.map((petal) => (
            <div
              key={petal.id}
              className="absolute text-pink-400 select-none animate-fall-wind pointer-events-none"
              style={
                {
                  left: `${petal.x}%`,
                  fontSize: `${petal.size}px`,
                  animationDelay: `${petal.delay}s`,
                  animationDuration: `${petal.duration}s`,
                  "--petal-opacity": petal.opacity,
                  "--petal-drift": `${petal.drift}px`,
                  "--petal-mid-rot": `${petal.rotation / 2}deg`,
                  "--petal-max-rot": `${petal.rotation}deg`,
                } as React.CSSProperties
              }
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
                {greeting.part1}
                <br />
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
              The world&apos;s stories are waiting for you.
              <br />
              Let&apos;s continue your journey.
            </motion.p>
          </div>

          {/* Server Error Notification */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3"
            >
              <svg
                className="mt-0.5 h-4.5 w-4.5 shrink-0 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <p className="text-xs text-destructive">{serverError}</p>
            </motion.div>
          )}

          {/* Form inputs */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="space-y-1"
            >
              <div
                className={`flex items-center gap-3 w-full h-[56px] rounded-[18px] bg-[#121217] border px-4 transition-all duration-200 ${
                  fieldErrors.email
                    ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
                    : "border-white/5 hover:border-[#A855F7]/60 focus-within:border-[#FF5FA8] focus-within:ring-2 focus-within:ring-[#FF5FA8]/20"
                }`}
              >
                <Mail className="w-[18px] h-[18px] text-[#A1A1AA]/60 shrink-0" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="Email Address"
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#A1A1AA]/40 outline-none h-full"
                />
              </div>
              {fieldErrors.email && (
                <p
                  id="login-email-error"
                  className="text-[10px] text-destructive pl-2"
                >
                  {fieldErrors.email}
                </p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55, duration: 0.5 }}
              className="space-y-1"
            >
              <div
                className={`flex items-center gap-3 w-full h-[56px] rounded-[18px] bg-[#121217] border px-4 transition-all duration-200 ${
                  fieldErrors.password
                    ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
                    : "border-white/5 hover:border-[#A855F7]/60 focus-within:border-[#FF5FA8] focus-within:ring-2 focus-within:ring-[#FF5FA8]/20"
                }`}
              >
                <Lock className="w-[18px] h-[18px] text-[#A1A1AA]/60 shrink-0" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  placeholder="Password"
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#A1A1AA]/40 outline-none h-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#A1A1AA]/60 hover:text-white transition-colors shrink-0 outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p
                  id="login-password-error"
                  className="text-[10px] text-destructive pl-2"
                >
                  {fieldErrors.password}
                </p>
              )}
            </motion.div>

            {/* Remember Me and Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              className="flex items-center justify-between text-xs text-[#A1A1AA]"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all ${
                    rememberMe
                      ? "bg-gradient-to-r from-[#FF5FA8] to-[#A855F7] border-transparent"
                      : "border-white/10 group-hover:border-[#A855F7]/80 bg-[#121217]"
                  }`}
                >
                  {rememberMe && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="hover:text-white transition-colors hover:underline underline-offset-4"
              >
                Forgot Password?
              </Link>
            </motion.div>

            {/* Primary Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.85, duration: 0.5 }}
              className="pt-2"
            >
              <motion.button
                id="login-submit"
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative group w-full h-[58px] rounded-[18px] bg-gradient-to-r from-[#FF5FA8] to-[#A855F7] text-white text-sm font-bold shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_30px_rgba(255,95,168,0.5)] transition-shadow duration-300 outline-none flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <span>Continue Journey</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* OAuth Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-widest text-[#A1A1AA]/50">
                or continue with
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Google Button */}
              <motion.button
                type="button"
                whileHover={{
                  y: -4,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
                className="flex items-center justify-center gap-2 h-[50px] rounded-[14px] border border-white/[0.08] bg-white/[0.01] text-xs font-semibold text-white transition-all cursor-pointer select-none"
              >
                <svg
                  className="w-4.5 h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </motion.button>

              {/* Discord Button */}
              <motion.button
                type="button"
                whileHover={{
                  y: -4,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
                className="flex items-center justify-center gap-2 h-[50px] rounded-[14px] border border-white/[0.08] bg-white/[0.01] text-xs font-semibold text-white transition-all cursor-pointer select-none"
              >
                <svg
                  className="w-4.5 h-4.5"
                  viewBox="0 0 127.14 96.36"
                  fill="currentColor"
                >
                  <path
                    d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.19,77.19,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C-3.48,41.92-1,74.75,14,96.36a107,107,0,0,0,32.22-16.29,78.36,78.36,0,0,0,6.83-11.08,69.57,69.57,0,0,1-10.75-5.14c.91-.66,1.8-1.34,2.65-2a76.48,76.48,0,0,0,62.14,0c.85.69,1.74,1.37,2.65,2a69.57,69.57,0,0,1-10.75,5.14,78.36,78.36,0,0,0,6.83,11.08,107,107,0,0,0,32.22,16.29C128.82,74.75,131.28,41.92,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"
                    fill="#5865F2"
                  />
                </svg>
                Discord
              </motion.button>
            </div>
          </motion.div>
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
            <span className="text-[10px] font-mono opacity-40">
              Kiroku v1.1
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── RIGHT HERO SECTION (55-58% width) ─── */}
      <div className="hidden lg:flex lg:w-[57%] relative h-screen bg-[#111116] overflow-hidden flex-col justify-between p-12 select-none border-l border-white/5">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />

        {/* Dynamic Sunset / Season Glowing Background Volumetric Lights */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-30 mix-blend-screen animate-light-pulse">
          <div
            className="absolute top-[10%] left-[20%] w-[650px] h-[650px] rounded-full blur-[140px] transition-colors duration-[1.6s] ease-in-out"
            style={{
              background: `radial-gradient(circle, ${HERO_THEMES[currentThemeIndex].accentGlow} 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-[10%] right-[10%] w-[750px] h-[750px] rounded-full blur-[150px] transition-colors duration-[1.6s] ease-in-out"
            style={{
              background: `radial-gradient(circle, ${HERO_THEMES[currentThemeIndex].accentGlow} 0%, transparent 70%)`,
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
              style={
                {
                  left: `${petal.x}%`,
                  fontSize: `${petal.size}px`,
                  animationDelay: `${petal.delay}s`,
                  animationDuration: `${petal.duration}s`,
                  zIndex: petal.zIndex,
                  "--petal-opacity": petal.opacity,
                  "--petal-drift": `${petal.drift}px`,
                  "--petal-mid-rot": `${petal.rotation / 2}deg`,
                  "--petal-max-rot": `${petal.rotation}deg`,
                } as React.CSSProperties
              }
            >
              {HERO_THEMES[currentThemeIndex].petalEmoji}
            </div>
          ))}
        </motion.div>

        {/* ─── Hero Illustration Layer with breathing loop and crossfades ─── */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentThemeIndex}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Internal breathing animation */}
              <motion.div
                animate={{
                  scale: [1, 1.015, 1],
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Parallax mouse offset wrapper */}
                <motion.div
                  animate={{
                    x: mousePos.x * 12,
                    y: mousePos.y * 7,
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 25 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={HERO_THEMES[currentThemeIndex].imagePath}
                    alt={HERO_THEMES[currentThemeIndex].description}
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
            </motion.div>
          </AnimatePresence>
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
            rotateY: mousePos.x * 8,
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(255, 95, 168, 0.15)",
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 22,
            delay: 2.1,
          }}
          className="absolute top-[12%] left-[8%] z-30 pointer-events-auto cursor-pointer"
        >
          <div className="animate-float-a">
            <div className="backdrop-blur-[18px] bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-[24px] p-5 text-white/90 max-w-[220px]">
              <span className="text-xl">🌸</span>
              <h4 className="font-japanese font-bold text-sm text-pink-300 mt-1">
                {HERO_THEMES[currentThemeIndex].card1.greeting}
              </h4>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                {HERO_THEMES[currentThemeIndex].card1.subtitle}
              </p>
            </div>
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
            rotateY: mousePos.x * 8,
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(255, 95, 168, 0.15)",
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 22,
            delay: 2.15,
          }}
          className="absolute bottom-[22%] right-[6%] z-30 pointer-events-auto cursor-pointer"
        >
          <div className="animate-float-b">
            <div className="backdrop-blur-[18px] bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-[24px] p-5 text-white/90 max-w-[230px]">
              <h4 className="font-bold text-xs text-pink-300 flex items-center gap-1.5 leading-none">
                <span>📖</span> {HERO_THEMES[currentThemeIndex].card2.title}
              </h4>
              <div className="text-[10px] text-zinc-400 mt-2 space-y-0.5 leading-relaxed font-semibold">
                {HERO_THEMES[currentThemeIndex].card2.lines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
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
              rotateY: mousePos.x * 6,
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)",
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 22,
              delay: 2.2,
            }}
            className="absolute bottom-[16%] left-[6%] z-30 pointer-events-auto cursor-pointer"
          >
            <div className="animate-float-c">
              <div className="backdrop-blur-[18px] bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-[24px] p-5 text-white/90 max-w-[240px]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                  Today&apos;s Quote 💬
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed italic font-semibold">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <span className="text-[9px] text-zinc-500 block mt-1.5 text-right font-semibold">
                  — {quote.author}
                </span>
              </div>
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
            rotateY: mousePos.x * 6,
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)",
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 22,
            delay: 2.25,
          }}
          className="absolute bottom-[4%] left-[22%] z-30 pointer-events-auto cursor-pointer"
        >
          <div className="animate-float-d">
            <div className="backdrop-blur-[18px] bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-[24px] p-4 text-white/90 min-w-[260px] flex items-center gap-3">
              {/* Rotating Disc */}
              <div className="relative w-10 h-10 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0 animate-disc">
                <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-black/40" />
              </div>
              <div className="flex-1 min-w-0 select-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 block">
                  Now Playing 🎵
                </span>
                <h4 className="font-bold text-xs text-white truncate">
                  {HERO_THEMES[currentThemeIndex].card4.song}
                </h4>
                <p className="text-[9px] text-zinc-400 truncate">
                  {HERO_THEMES[currentThemeIndex].card4.artist}
                </p>
              </div>
              {/* Waveform visual bars */}
              <div className="flex items-end gap-0.5 h-3 shrink-0">
                <div className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-1" />
                <div
                  className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-2"
                  style={{ animationDelay: "0.15s" }}
                />
                <div
                  className="w-[2px] bg-[#FF5FA8] rounded-full animate-bar-grow animate-bar-3"
                  style={{ animationDelay: "0.3s" }}
                />
                <div
                  className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-4"
                  style={{ animationDelay: "0.45s" }}
                />
                <div
                  className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-5"
                  style={{ animationDelay: "0.6s" }}
                />
                <div
                  className="w-[2px] bg-[#A855F7] rounded-full animate-bar-grow animate-bar-6"
                  style={{ animationDelay: "0.75s" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
