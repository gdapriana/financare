import { z } from "zod";

export const expenseItemInputSchema = z.object({
  name: z.string().trim().min(1, "Item name is required."),
  quantity: z.number().positive("Quantity must be greater than 0."),
  unit_price: z.number().int().min(0, "Unit price cannot be negative."),
  sort_order: z.number().int().min(0).optional()
});

export const locationInputSchema = z.object({
  name: z.string().trim().min(1, "Location name is required."),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional()
});

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  account_id: z.string().uuid("Invalid account_id format."),
  amount: z.number().int().min(0).optional(),
  source_name: z.string().trim().nullable().optional(),
  occurred_at: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid occurred_at date format."),
  note: z.string().trim().nullable().optional(),
  items: z.array(expenseItemInputSchema).optional(),
  location: locationInputSchema.nullable().optional(),
  attachment_ids: z.array(z.string().uuid()).max(5, "Maximum 5 attachments allowed.").optional()
});

export const updateTransactionSchema = z.object({
  occurred_at: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format.").optional(),
  note: z.string().trim().nullable().optional(),
  source_name: z.string().trim().nullable().optional(),
  items: z.array(expenseItemInputSchema).optional(),
  location: locationInputSchema.nullable().optional()
});

export const transactionIdParamSchema = z.string().uuid("Invalid transaction ID format.");

export type ExpenseItemInput = z.infer<typeof expenseItemInputSchema>;
export type LocationInput = z.infer<typeof locationInputSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
