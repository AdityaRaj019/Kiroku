import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { UserProfileResponse, UpdateProfileInput, UpdateProfileResponse } from "@/types/user";

/**
 * Hook to retrieve profile details, stats, rank, and comments of a user.
 */
export function useUserProfile(userId: number | undefined) {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const res = await apiFetch(`/users/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return res.json();
    },
    enabled: !!userId,
  });
}

/**
 * Hook to update the current user's profile details.
 * Syncs the updated fields to useAuthStore on success.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUserStore = useAuthStore((state) => state.updateUserProfile);

  return useMutation<UpdateProfileResponse, Error, UpdateProfileInput>({
    mutationFn: async (payload) => {
      const res = await apiFetch("/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let message = "Failed to update profile";
        try {
          const parsed = JSON.parse(errorText);
          message = parsed.error || message;
        } catch {}
        throw new Error(message);
      }

      return res.json();
    },
    onSuccess: (data) => {
      // Sync the local Zustand store state
      updateUserStore({
        name: data.user.name,
        avatarUrl: data.user.avatarUrl,
        bio: data.user.bio,
      });

      // Invalidate target user profile query cache so it re-fetches
      queryClient.invalidateQueries({ queryKey: ["userProfile", data.user.id] });
    },
  });
}
