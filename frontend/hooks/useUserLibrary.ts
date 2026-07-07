import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";

export interface LibraryItem {
  id: number;
  userId: number;
  mangaId: number | null;
  animeId: string | null;
  mediaType: "MANGA" | "ANIME";
  status: "READING" | "COMPLETED" | "PLAN_TO_READ" | "DROPPED" | "PAUSED";
  progress: number;
  favorite: boolean;
  enableNotifications: boolean;
  rating: number | null;
  startDate: string | null;
  endDate: string | null;
  reReadCount: number;
  createdAt: string;
  updatedAt: string;
  manga?: {
    sourceId: string;
    title: string;
    coverUrl: string | null;
    status: string;
    chapterCount?: number | null;
  } | null;
}

export interface LibraryListResponse {
  data: LibraryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Retrieve followed manga items for the authenticated user (private list).
 */
export function useUserLibrary(params: {
  status?: string;
  mediaType?: string;
  favorite?: boolean;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
} = {}) {
  const { enabled = true, ...rest } = params;

  return useQuery<LibraryListResponse>({
    queryKey: ["userLibrary", rest],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (rest.status) queryParams.append("status", rest.status);
      if (rest.mediaType) queryParams.append("mediaType", rest.mediaType);
      if (rest.favorite !== undefined) queryParams.append("favorite", String(rest.favorite));
      if (rest.sort) queryParams.append("sort", rest.sort);
      if (rest.order) queryParams.append("order", rest.order);
      if (rest.page) queryParams.append("page", String(rest.page));
      if (rest.limit) queryParams.append("limit", String(rest.limit));

      const res = await apiFetch(`/library?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user library");
      }
      return res.json();
    },
    enabled,
  });
}

/**
 * Retrieve followed manga items for a specific target user (public profile list).
 */
export function usePublicUserLibrary(
  userId: number | undefined,
  params: {
    status?: string;
    mediaType?: string;
    favorite?: boolean;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
    enabled?: boolean;
  } = {}
) {
  const { enabled = true, ...rest } = params;

  return useQuery<LibraryListResponse>({
    queryKey: ["publicUserLibrary", userId, rest],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const queryParams = new URLSearchParams();
      if (rest.status) queryParams.append("status", rest.status);
      if (rest.mediaType) queryParams.append("mediaType", rest.mediaType);
      if (rest.favorite !== undefined) queryParams.append("favorite", String(rest.favorite));
      if (rest.sort) queryParams.append("sort", rest.sort);
      if (rest.order) queryParams.append("order", rest.order);
      if (rest.page) queryParams.append("page", String(rest.page));
      if (rest.limit) queryParams.append("limit", String(rest.limit));

      const res = await apiFetch(`/library/users/${userId}?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch public user library");
      }
      return res.json();
    },
    enabled: enabled && !!userId,
  });
}
