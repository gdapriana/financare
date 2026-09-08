import { z } from "zod";

export const cancelAttachmentsSchema = z.object({
  attachment_ids: z.array(z.string().uuid("Invalid attachment ID format.")).min(1, "At least 1 attachment ID is required.")
});

export const getUploadUrlSchema = z.object({
  filename: z.string().trim().min(1, "Filename is required."),
  mime_type: z.string().trim().min(1, "MIME type is required."),
  size_bytes: z.number().int().positive().max(10485760, "Maximum file size is 10MB.")
});

export const confirmUploadSchema = z.object({
  provider_asset_id: z.string().trim().min(1, "provider_asset_id is required."),
  bytes: z.number().int().positive("bytes must be positive."),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().trim().min(1, "format is required."),
  secure_url: z.string().url().optional()
});

export type CancelAttachmentsInput = z.infer<typeof cancelAttachmentsSchema>;
export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;
