import { Request, Response } from "express";
import * as accountsService from "../services/accounts.service";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import {
  createAccountSchema,
  updateAccountSchema,
  accountIdParamSchema
} from "../validations/accounts.validation";

export const getAccounts = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const result = await accountsService.getUserAccounts(req.user.userId);

  return ApiResponse.ok(res, "Accounts retrieved successfully.", result);
});

export const createAccount = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsed = createAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest("Invalid account creation payload.", parsed.error.flatten().fieldErrors);
  }

  const newAccount = await accountsService.createAccount(req.user.userId, parsed.data);

  return ApiResponse.created(res, "Account created successfully.", newAccount);
});

export const getAccountById = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = accountIdParamSchema.safeParse(req.params.id);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid account ID format.");
  }

  const account = await accountsService.getAccountById(req.user.userId, parsedParam.data);

  return ApiResponse.ok(res, "Account details retrieved successfully.", account);
});

export const updateAccount = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = accountIdParamSchema.safeParse(req.params.id);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid account ID format.");
  }

  const parsedBody = updateAccountSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw ApiError.badRequest("Invalid account update payload.", parsedBody.error.flatten().fieldErrors);
  }

  const updatedAccount = await accountsService.updateAccount(
    req.user.userId,
    parsedParam.data,
    parsedBody.data
  );

  return ApiResponse.ok(res, "Account updated successfully.", updatedAccount);
});

export const archiveAccount = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = accountIdParamSchema.safeParse(req.params.id);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid account ID format.");
  }

  const archivedAccount = await accountsService.archiveAccount(
    req.user.userId,
    parsedParam.data
  );

  return ApiResponse.ok(res, "Account archived successfully.", archivedAccount);
});
