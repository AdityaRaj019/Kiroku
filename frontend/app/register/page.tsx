"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiFetch } from "@/utils/api";
import type { AuthResponse } from "@/types/auth";

// ─── Validation (mirrors backend auth.schema.ts) ─────────────

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

function PasswordStrength({ password }: { password: string }) {
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
        {PASSWORD_RULES.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < passedCount
                ? passedCount <= 1
                  ? "bg-destructive"
                  : passedCount <= 2
                    ? "bg-amber-500"
                    : passedCount <= 3
                      ? "bg-yellow-500"
                      : "bg-success"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Rule checklist */}
      <ul className="space-y-1">
        {results.map((rule) => (
          <li
            key={rule.label}
            className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
              rule.passed ? "text-success" : "text-muted-foreground"
            }`}
          >
            {rule.passed ? (
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
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
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
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

// ─── Page Component ──────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Card */}
      <div className="animate-fade-in-up relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface-elevated/80 p-8 shadow-2xl shadow-primary/5 backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start tracking your manga reading journey
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
            {/* Name */}
            <div className="animate-fade-in-up delay-100">
              <label
                htmlFor="register-name"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Name
              </label>
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
                className={`w-full rounded-lg border bg-input-bg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-ring/40 ${
                  fieldErrors.name
                    ? "border-destructive focus:ring-destructive/40"
                    : "border-input-border hover:border-muted-foreground/40 focus:border-input-focus"
                }`}
              />
              {fieldErrors.name && (
                <p
                  id="register-name-error"
                  className="mt-1.5 text-xs text-destructive"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="animate-fade-in-up delay-200">
              <label
                htmlFor="register-email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
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
                className={`w-full rounded-lg border bg-input-bg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-ring/40 ${
                  fieldErrors.email
                    ? "border-destructive focus:ring-destructive/40"
                    : "border-input-border hover:border-muted-foreground/40 focus:border-input-focus"
                }`}
              />
              {fieldErrors.email && (
                <p
                  id="register-email-error"
                  className="mt-1.5 text-xs text-destructive"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="animate-fade-in-up delay-300">
              <label
                htmlFor="register-password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
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
                className={`w-full rounded-lg border bg-input-bg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-ring/40 ${
                  fieldErrors.password
                    ? "border-destructive focus:ring-destructive/40"
                    : "border-input-border hover:border-muted-foreground/40 focus:border-input-focus"
                }`}
              />
              {fieldErrors.password && (
                <p
                  id="register-password-error"
                  className="mt-1.5 text-xs text-destructive"
                >
                  {fieldErrors.password}
                </p>
              )}
              <PasswordStrength password={password} />
            </div>

            {/* Submit */}
            <div className="animate-fade-in-up delay-400 pt-2">
              <button
                id="register-submit"
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="animate-fade-in-up delay-400 mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
