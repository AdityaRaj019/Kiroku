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

export function useUserLibrary(params: {
  status?: string;
  mediaType?: string;
  favorite?: boolean;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
} = {}) {
  return useQuery<LibraryListResponse>({
    queryKey: ["userLibrary", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append("status", params.status);
      if (params.mediaType) queryParams.append("mediaType", params.mediaType);
      if (params.favorite !== undefined) queryParams.append("favorite", String(params.favorite));
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.order) queryParams.append("order", params.order);
      if (params.page) queryParams.append("page", String(params.page));
      if (params.limit) queryParams.append("limit", String(params.limit));

      const res = await apiFetch(`/library?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user library");
      }
      return res.json();
    },
  });
}
