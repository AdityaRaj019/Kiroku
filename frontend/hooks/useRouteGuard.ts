"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";

/**
 * Client-side route guard that redirects unauthenticated users
 * to the login page.
 *
 * Usage in a protected page or layout:
 * ```tsx
 * export default function DashboardPage() {
 *   const isReady = useRouteGuard();
 *   if (!isReady) return null; // or a loading skeleton
 *   return <div>Protected content</div>;
 * }
 * ```
 *
 * @param redirectTo  Where to redirect when not authenticated (default: "/login").
 * @returns `true` when the user is authenticated and the page is safe to render,
 *          `false` while the redirect is in progress.
 */
export function useRouteGuard(redirectTo = "/login"): boolean {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  return isAuthenticated;
}
