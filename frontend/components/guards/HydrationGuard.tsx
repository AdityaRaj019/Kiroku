"use client";

import { useSyncExternalStore } from "react";

/**
 * No-op subscribe — the "is mounted" state never changes after the
 * initial client render, so there is nothing to subscribe to.
 */
const emptySubscribe = () => () => {};

/** Client snapshot: always `true` — we are in the browser. */
const getClientSnapshot = () => true;

/** Server snapshot: always `false` — children should not render on the server. */
const getServerSnapshot = () => false;

/**
 * Hydration guard that defers rendering of client-only providers
 * until the component is running in the browser.
 *
 * **Why this exists:**
 * React Server Components render on the server where browser APIs
 * (`window`, `document`, `localStorage`) don't exist.  Client-only
 * providers (QueryClient, Zustand stores reading browser state) can
 * produce different initial output than the server HTML, causing the
 * dreaded "Hydration failed" console error.
 *
 * Uses `useSyncExternalStore` with a server/client snapshot pair
 * instead of `useState` + `useEffect` to avoid cascading renders
 * flagged by React 19's strict mode.
 */
export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
