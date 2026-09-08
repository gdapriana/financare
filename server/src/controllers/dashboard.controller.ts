import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import {
  getDashboardSummaryQuerySchema,
  getCalendarQuerySchema,
  getCalendarDateParamSchema
} from "../validations/dashboard.validation";

export const getSummary = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedQuery = getDashboardSummaryQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    throw ApiError.badRequest("Invalid dashboard summary query parameter.", parsedQuery.error.flatten().fieldErrors);
  }

  const result = await dashboardService.getDashboardSummary(
    req.user.userId,
    parsedQuery.data.month
  );

  return ApiResponse.ok(res, "Dashboard summary retrieved successfully.", result);
});

export const getCalendar = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedQuery = getCalendarQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    throw ApiError.badRequest("Invalid calendar query parameter. 'month' parameter (YYYY-MM) is required.", parsedQuery.error.flatten().fieldErrors);
  }

  const result = await dashboardService.getMonthlyCalendar(
    req.user.userId,
    parsedQuery.data.month
  );

  return ApiResponse.ok(res, "Monthly calendar retrieved successfully.", result);
});

export const getCalendarDateDetails = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = getCalendarDateParamSchema.safeParse(req.params.date);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid date parameter. Expected format YYYY-MM-DD.");
  }

  const result = await dashboardService.getCalendarDateDetails(
    req.user.userId,
    parsedParam.data
  );

  return ApiResponse.ok(res, "Date transactions retrieved successfully.", result);
});
