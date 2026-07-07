import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be 50 characters or fewer")
      .optional(),
    avatarUrl: z
      .string()
      .url("Avatar must be a valid URL")
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((val) => (val === "" ? null : val)),
    bio: z
      .string()
      .max(500, "Bio must be 500 characters or fewer")
      .nullable()
      .optional(),
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
