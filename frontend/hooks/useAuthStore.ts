import { create } from "zustand";
import type { UserPayload } from "@/types/auth";

// ─── Store Shape ─────────────────────────────────────────────

interface AuthState {
  /** Authenticated user profile, `null` when logged out. */
  user: UserPayload | null;

  /**
   * Short-lived JWT access token stored strictly in memory.
   * Never persisted to localStorage / sessionStorage.
   */
  accessToken: string | null;

  /** Derived convenience flag. */
  isAuthenticated: boolean;
}

interface AuthActions {
  /** Hydrate session after a successful login / register / refresh. */
  setSession: (user: UserPayload, token: string) => void;

  /** Update only the access token (silent refresh). */
  setAccessToken: (token: string) => void;

  /** Clear all session state (logout / token revocation). */
  clearSession: () => void;
}

// ─── Initial State ───────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

// ─── Store ───────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setSession: (user, token) =>
    set({ user, accessToken: token, isAuthenticated: true }),

  setAccessToken: (token) => set({ accessToken: token }),

  clearSession: () => set({ ...initialState }),
}));
