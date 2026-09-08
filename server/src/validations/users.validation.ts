import { z } from "zod";

export const updateUserPreferencesSchema = z.object({
  display_name: z.string().trim().min(1, "Display name cannot be empty.").optional(),
  timezone: z.string().trim().min(1, "Timezone cannot be empty.").optional(),
  currency_code: z
    .string()
    .trim()
    .length(3, "Currency code must be exactly 3 characters.")
    .transform((val) => val.toUpperCase())
    .optional()
});

export const updateAvatarSchema = z.object({
  media_asset_id: z.string().uuid("Invalid media_asset_id format.").optional()
});

export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
