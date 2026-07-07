import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `true` on the client after mounting, and `false` on the server.
 * This is the React 18+ recommended way to avoid hydration mismatches
 * without using `useEffect` + `setState` (which triggers cascading render warnings).
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
