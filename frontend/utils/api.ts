import { useAuthStore } from "@/hooks/useAuthStore";
import type { RefreshResponse } from "@/types/auth";

// ─── Configuration ───────────────────────────────────────────

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

// ─── Refresh Lock Queue ──────────────────────────────────────
//
// When a 401 is received, exactly ONE refresh call runs.
// All other concurrent failing requests queue behind a shared
// promise that resolves once the new token is acquired.

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Executes the refresh token rotation call.
 *
 * Returns the new access token on success, `null` if the refresh
 * itself fails (session truly expired).
 */
async function executeRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // send HttpOnly cookie
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // Refresh failed — session is fully expired
      useAuthStore.getState().clearSession();
      return null;
    }

    const data: RefreshResponse = await res.json();
    useAuthStore.getState().setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    useAuthStore.getState().clearSession();
    return null;
  }
}

/**
 * Acquires a fresh access token, de-duplicating concurrent calls.
 *
 * The first caller triggers the actual HTTP request; all subsequent
 * callers receive the same promise until it settles.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = executeRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Custom fetch wrapper that:
 *
 * 1. Prepends the API base URL to relative paths.
 * 2. Attaches the in-memory Bearer token from Zustand.
 * 3. Sends `credentials: "include"` for the HttpOnly refresh cookie.
 * 4. On 401, triggers a single token refresh and retries the original
 *    request exactly once.
 *
 * @param path  Relative API path (e.g. `/manga/search`).
 * @param init  Standard `RequestInit` — merged with auth headers.
 * @returns     The `Response` object (caller handles JSON parsing).
 *
 * @example
 * ```ts
 * const res = await apiFetch("/manga/search", {
 *   method: "POST",
 *   body: JSON.stringify({ query: "One Piece" }),
 * });
 * const data = await res.json();
 * ```
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;

  const buildHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string>),
    };

    // Only set Content-Type if a body is present and it hasn't been set manually
    if (init.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: buildHeaders(),
  });

  // ── 401 Interceptor ────────────────────────────────────────
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      // Refresh failed — return the original 401 for the caller to handle
      return response;
    }

    // Retry the original request with the fresh token
    return fetch(url, {
      ...init,
      credentials: "include",
      headers: buildHeaders(),
    });
  }

  return response;
}
