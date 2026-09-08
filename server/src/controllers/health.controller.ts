import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import * as healthService from "../services/health.service";

export const healthCheck = async (_req: Request, res: Response) => {
  const data = await healthService.getHealthStatus();
  return ApiResponse.Success(res, "Service is healthy", data);
};

export const detailedHealthCheck = async (_req: Request, res: Response) => {
  const data = await healthService.getDetailedHealthStatus();
  return ApiResponse.Success(res, "Service is healthy", data);
};
