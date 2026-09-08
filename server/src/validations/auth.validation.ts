import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format.")
    .transform((val) => val.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  display_name: z.string().trim().min(1, "Display name is required."),
  timezone: z.string().trim().default("Asia/Makassar")
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format.")
    .transform((val) => val.trim().toLowerCase()),
  password: z.string().min(1, "Password is required."),
  device_name: z.string().optional().default("Web Browser")
});

export const updateMeSchema = z.object({
  display_name: z.string().trim().min(1, "Display name cannot be empty.").optional(),
  timezone: z.string().trim().min(1, "Timezone cannot be empty.").optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateMeInput = z.infer<typeof updateMeSchema>;
