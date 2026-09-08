import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().trim().min(1, "Account name is required."),
  type: z.enum(["CASH", "BANK", "EWALLET"]),
  institution_name: z.string().trim().nullable().optional(),
  opening_balance: z.number().int("Opening balance must be an integer.").min(0, "Opening balance cannot be negative.").default(0),
  color: z.string().trim().nullable().optional(),
  icon: z.string().trim().nullable().optional()
});

export const updateAccountSchema = z.object({
  name: z.string().trim().min(1, "Account name cannot be empty.").optional(),
  institution_name: z.string().trim().nullable().optional(),
  color: z.string().trim().nullable().optional(),
  icon: z.string().trim().nullable().optional()
});

export const accountIdParamSchema = z.string().uuid("Invalid account ID format.");

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
