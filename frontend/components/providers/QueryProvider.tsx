"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

/**
 * TanStack Query provider for Next.js App Router.
 *
 * **Why `useState`?**
 * A module-level `new QueryClient()` persists across SSR requests on
 * the server, leaking cached data between users.  Initializing inside
 * `useState(() => ...)` guarantees a fresh, isolated client per
 * client-side mount while still being stable across re-renders.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
