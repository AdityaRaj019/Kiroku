"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

// ─── Page Component ──────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Card */}
      <div className="animate-fade-in-up relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface-elevated/80 p-8 shadow-2xl shadow-primary/5 backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue tracking your manga
            </p>
          </div>

          {/* Server error alert */}
          {serverError && (
            <div
              role="alert"
              className="animate-fade-in-up mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
            >
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
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
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="animate-fade-in-up delay-100">
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
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
                placeholder="you@example.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={
                  fieldErrors.email ? "login-email-error" : undefined
                }
                className={`w-full rounded-lg border bg-input-bg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-ring/40 ${
                  fieldErrors.email
                    ? "border-destructive focus:ring-destructive/40"
                    : "border-input-border hover:border-muted-foreground/40 focus:border-input-focus"
                }`}
              />
              {fieldErrors.email && (
                <p
                  id="login-email-error"
                  className="mt-1.5 text-xs text-destructive"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="animate-fade-in-up delay-200">
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
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
                placeholder="Enter your password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={
                  fieldErrors.password ? "login-password-error" : undefined
                }
                className={`w-full rounded-lg border bg-input-bg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-ring/40 ${
                  fieldErrors.password
                    ? "border-destructive focus:ring-destructive/40"
                    : "border-input-border hover:border-muted-foreground/40 focus:border-input-focus"
                }`}
              />
              {fieldErrors.password && (
                <p
                  id="login-password-error"
                  className="mt-1.5 text-xs text-destructive"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="animate-fade-in-up delay-300 pt-2">
              <button
                id="login-submit"
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="animate-fade-in-up delay-400 mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
