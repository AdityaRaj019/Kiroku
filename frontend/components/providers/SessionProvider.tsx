"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { API_BASE_URL } from "@/utils/api";

interface SessionProviderProps {
  children: React.ReactNode;
}

let sessionRestorePromise: Promise<void> | null = null;

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [isRestoring, setIsRestoring] = useState(true);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1. Attempt token refresh to see if user has a valid refresh cookie
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // essential to send/receive HTTP-only cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!refreshRes.ok) {
          clearSession();
          return;
        }

        const refreshData = await refreshRes.json();
        const token = refreshData.accessToken;

        // 2. Fetch the user profile using the newly acquired access token
        const profileRes = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok) {
          clearSession();
          return;
        }

        const profileData = await profileRes.json();
        setSession(profileData.user, token);
      } catch (err) {
        console.error("[SessionProvider] Session restoration failed:", err);
        clearSession();
      }
    };

    if (!sessionRestorePromise) {
      sessionRestorePromise = restoreSession();
    }

    sessionRestorePromise.finally(() => {
      setIsRestoring(false);
    });
  }, [setSession, clearSession]);

  if (isRestoring) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0C] flex flex-col items-center justify-center gap-4 z-[9999] select-none">
        {/* Shonen/Manga themed loader */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 border-4 border-[#CC0000] border-t-transparent rounded-full animate-spin" />
          <div className="absolute w-12 h-12 border-4 border-white border-b-transparent rounded-full animate-spin-reverse" />
        </div>
        <p className="font-bebas text-2xl tracking-widest text-white uppercase animate-pulse">
          RESTORING SESSION...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
