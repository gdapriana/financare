import { z } from "zod";

export const getDashboardSummaryQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month format. Expected YYYY-MM.").optional()
});

export const getCalendarQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month format. Expected YYYY-MM.")
});

export const getCalendarDateParamSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD.");

export type GetDashboardSummaryQueryInput = z.infer<typeof getDashboardSummaryQuerySchema>;
export type GetCalendarQueryInput = z.infer<typeof getCalendarQuerySchema>;
