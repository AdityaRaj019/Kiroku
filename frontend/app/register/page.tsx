"use client";

import { useState, useMemo, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Quote
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiFetch } from "@/utils/api";
import { ANIME_SHOWCASE_DATA } from "@/utils/animeShowcaseData";
import type { AuthResponse } from "@/types/auth";

// ─── Validation ──────────────────────────────────────────────

interface FieldErrors {
  email?: string;
  name?: string;
  password?: string;
}

function validateRegister(
  email: string,
  name: string,
  password: string
): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  } else if (email.length > 255) {
    errors.email = "Email must be 255 characters or fewer";
  }

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (password.length > 128) {
    errors.password = "Password must be 128 characters or fewer";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.password =
      "Must contain at least one lowercase, one uppercase, and one digit";
  }

  return errors;
}

// ─── Password Strength Indicator ─────────────────────────────

interface StrengthRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: StrengthRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One digit", test: (pw) => /\d/.test(pw) },
];

function PasswordStrength({ password, accentColor }: { password: string; accentColor: string }) {
  const results = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );

  const passedCount = results.filter((r) => r.passed).length;

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {PASSWORD_RULES.map((_, i) => {
          const isPassed = i < passedCount;
          let barBg = "bg-muted";
          
          if (isPassed) {
            if (passedCount <= 1) barBg = "bg-destructive";
            else if (passedCount <= 2) barBg = "bg-amber-500";
            else if (passedCount <= 3) barBg = "bg-yellow-500";
            else barBg = "bg-success";
          }

          return (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${barBg}`}
              style={
                isPassed && passedCount === 4 
                  ? { backgroundColor: accentColor } 
                  : {}
              }
            />
          );
        })}
      </div>

      {/* Rule checklist */}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {results.map((rule) => (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 text-[11px] transition-colors duration-200 ${
              rule.passed ? "text-success" : "text-muted-foreground"
            }`}
            style={rule.passed ? { color: accentColor } : {}}
          >
            {rule.passed ? (
              <svg
                className="h-3 w-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            ) : (
              <svg
                className="h-3 w-3 shrink-0 text-muted-foreground/40"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rotation Index State (changes anime theme/experience every 9 seconds)
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ANIME_SHOWCASE_DATA.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const activeAnime = ANIME_SHOWCASE_DATA[activeIndex];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validation
    const errors = validateRegister(email, name, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data?.error ?? data?.message ?? "Registration failed. Please try again."
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

  return (
    <div 
      className="min-h-screen w-full flex bg-[#060608] text-foreground overflow-hidden font-sans relative"
      style={{
        transition: "background-color 1s ease-in-out"
      }}
    >
      {/* Background glow circle that transitions colors */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20 mix-blend-screen transition-all duration-1000 ease-in-out"
        style={{
          backgroundColor: activeAnime.accentColor,
        }}
      />

      {/* ─── LEFT SIDE (40%) ─── */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 md:p-12 xl:p-16 z-10 border-r border-white/5 bg-[#08080C]/80 backdrop-blur-xl relative">
        
        {/* Top Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white transition-all duration-1000 shadow-md"
            style={{ 
              backgroundColor: activeAnime.accentColor,
              boxShadow: `0 4px 12px ${activeAnime.glowColor}`
            }}
          >
            K
          </div>
          <span className="font-bebas text-2xl tracking-widest text-white">
            KIROKU
          </span>
        </div>

        {/* Dynamic Japanese Welcome Greeting & Blessings */}
        <div className="my-auto py-8 space-y-8 max-w-sm w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAnime.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Welcoming Japanese banner */}
              <div className="space-y-1">
                <span 
                  className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 transition-colors duration-1000"
                  style={{ color: activeAnime.accentColor }}
                >
                  {activeAnime.japaneseTitle}
                </span>
                
                <h1 className="text-xl md:text-2xl font-japanese font-bold text-white tracking-wide mt-2">
                  {activeAnime.japaneseWelcome}
                </h1>
                <p className="text-xs text-muted-foreground italic font-sans">
                  {activeAnime.welcomeSub}
                </p>
              </div>

              {/* Dynamic Inspirational Journey Quote */}
              <div className="relative pl-4 border-l-2 transition-all duration-1000 py-1 bg-white/[0.01] rounded-r-md pr-2"
                   style={{ borderColor: activeAnime.accentColor }}>
                <Quote className="absolute -top-3 -left-1.5 w-3.5 h-3.5 opacity-20" style={{ color: activeAnime.accentColor }} />
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-medium">
                  &ldquo;{activeAnime.quote}&rdquo;
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5 font-bold">
                  — {activeAnime.quoteSpeaker}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Create your account
            </h2>
            <p className="text-xs text-muted-foreground">
              Track. Discover. Share. Start your epic cataloging journey.
            </p>
          </div>

          {/* Server error alert */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2.5"
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* Display Name Input */}
            <div className="space-y-1">
              <label
                htmlFor="register-name"
                className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 opacity-60" /> Username
              </label>
              <div className="relative">
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="Your display name"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={
                    fieldErrors.name ? "register-name-error" : undefined
                  }
                  className={`w-full rounded-lg border bg-white/[0.02] px-3.5 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all duration-300 ${
                    fieldErrors.name
                      ? "border-destructive focus:ring-1 focus:ring-destructive"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={
                    !fieldErrors.name && name
                      ? { borderColor: activeAnime.accentColor, boxShadow: `0 0 0 1px ${activeAnime.accentColor}` }
                      : {}
                  }
                />
              </div>
              {fieldErrors.name && (
                <p id="register-name-error" className="text-[10px] text-destructive">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label
                htmlFor="register-email"
                className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 opacity-60" /> Email
              </label>
              <div className="relative">
                <input
                  id="register-email"
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
                  placeholder="you@example.com"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? "register-email-error" : undefined
                  }
                  className={`w-full rounded-lg border bg-white/[0.02] px-3.5 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all duration-300 ${
                    fieldErrors.email
                      ? "border-destructive focus:ring-1 focus:ring-destructive"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={
                    !fieldErrors.email && email
                      ? { borderColor: activeAnime.accentColor, boxShadow: `0 0 0 1px ${activeAnime.accentColor}` }
                      : {}
                  }
                />
              </div>
              {fieldErrors.email && (
                <p id="register-email-error" className="text-[10px] text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="register-password"
                  className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 opacity-60" /> Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
                  placeholder="Create a strong password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "register-password-error" : undefined
                  }
                  className={`w-full rounded-lg border bg-white/[0.02] pl-3.5 pr-10 py-2 text-xs text-foreground placeholder-muted-foreground outline-none transition-all duration-300 ${
                    fieldErrors.password
                      ? "border-destructive focus:ring-1 focus:ring-destructive"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  style={
                    !fieldErrors.password && password
                      ? { borderColor: activeAnime.accentColor, boxShadow: `0 0 0 1px ${activeAnime.accentColor}` }
                      : {}
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="register-password-error" className="text-[10px] text-destructive">
                  {fieldErrors.password}
                </p>
              )}
              <PasswordStrength password={password} accentColor={activeAnime.accentColor} />
            </div>

            {/* Continue Submit Button */}
            <div className="pt-2">
              <button
                id="register-submit"
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-500 ease-in-out cursor-pointer active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                style={{
                  backgroundColor: activeAnime.accentColor,
                  boxShadow: `0 4px 16px ${activeAnime.glowColor}`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
              or
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* OAuth Buttons */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer Redirect */}
        <div className="text-center text-xs text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-white hover:underline transition-all"
            style={{ color: activeAnime.accentColor }}
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* ─── RIGHT SIDE (60%) ─── */}
      {/* Shell placeholder for Phase 3 */}
      <div className="hidden lg:flex lg:w-[60%] relative h-screen items-center justify-center bg-[#050507]">
        <div className="text-center text-muted-foreground">
          <Sparkles className="w-8 h-8 mx-auto animate-pulse mb-2 text-white/20" />
          <p className="text-xs uppercase tracking-widest font-mono text-white/40">
            [ Live Dashboard Preview — Coming in Phase 3 ]
          </p>
          <p className="text-[10px] font-sans text-white/20 mt-1">
            Active Theme: {activeAnime.title} ({activeAnime.accentColor})
          </p>
        </div>
      </div>
    </div>
  );
}
