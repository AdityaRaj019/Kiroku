"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiFetch } from "@/utils/api";
import type { AuthResponse } from "@/types/auth";

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

export const LoginForm: React.FC = () => {
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
          data?.error ?? data?.message ?? "Invalid email or password"
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
    <div className="w-full flex flex-col gap-5">
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

      {/* Form Inputs */}
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
            <p id="login-email-error" className="text-[10px] text-destructive pl-2">
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
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
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
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="login-password-error" className="text-[10px] text-destructive pl-2">
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span>Remember me</span>
          </label>
          <a
            href="/forgot-password"
            className="hover:text-white transition-colors hover:underline underline-offset-4"
          >
            Forgot Password?
          </a>
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
            whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.04)" }}
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
            whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.04)" }}
            className="flex items-center justify-center gap-2 h-[50px] rounded-[14px] border border-white/[0.08] bg-white/[0.01] text-xs font-semibold text-white transition-all cursor-pointer select-none"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 127.14 96.36" fill="currentColor">
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
  );
};
