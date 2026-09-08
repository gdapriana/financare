import { Request, Response } from "express";
import * as transactionsService from "../services/transactions.service";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionIdParamSchema
} from "../validations/transactions.validation";

export const getTransactions = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const { start_date, end_date, type, account_id, search, limit, cursor } = req.query;

  const filters: transactionsService.GetTransactionsFilter = {
    ...(typeof start_date === "string" && { start_date }),
    ...(typeof end_date === "string" && { end_date }),
    ...(typeof type === "string" && (type === "INCOME" || type === "EXPENSE") && { type }),
    ...(typeof account_id === "string" && { account_id }),
    ...(typeof search === "string" && { search }),
    ...(limit && { limit: parseInt(String(limit), 10) }),
    ...(typeof cursor === "string" && { cursor })
  };

  const result = await transactionsService.getUserTransactions(req.user.userId, filters);

  return ApiResponse.ok(res, "Transactions retrieved successfully.", result);
});

export const createTransaction = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
  if (!idempotencyKey || !idempotencyKey.trim()) {
    throw ApiError.badRequest("Idempotency-Key header is required.");
  }

  const parsed = createTransactionSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest("Invalid transaction creation payload.", parsed.error.flatten().fieldErrors);
  }

  const dto = parsed.data;

  if (dto.type === "INCOME" && (!dto.source_name || !dto.source_name.trim())) {
    throw ApiError.badRequest("source_name is required for INCOME transactions.");
  }

  if (dto.type === "EXPENSE" && (!dto.items || dto.items.length === 0)) {
    throw ApiError.badRequest("At least 1 item is required for EXPENSE transactions.");
  }

  const transaction = await transactionsService.createTransaction(
    req.user.userId,
    idempotencyKey.trim(),
    dto
  );

  return ApiResponse.created(res, "Transaction recorded successfully.", transaction);
});

export const getTransactionById = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = transactionIdParamSchema.safeParse(req.params.id);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid transaction ID format.");
  }

  const transaction = await transactionsService.getTransactionById(
    req.user.userId,
    parsedParam.data
  );

  return ApiResponse.ok(res, "Transaction details retrieved successfully.", transaction);
});

export const updateTransaction = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = transactionIdParamSchema.safeParse(req.params.id);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid transaction ID format.");
  }

  const parsedBody = updateTransactionSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw ApiError.badRequest("Invalid transaction update payload.", parsedBody.error.flatten().fieldErrors);
  }

  const updatedTransaction = await transactionsService.updateTransaction(
    req.user.userId,
    parsedParam.data,
    parsedBody.data
  );

  return ApiResponse.ok(res, "Transaction updated successfully.", updatedTransaction);
});

export const deleteTransaction = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = transactionIdParamSchema.safeParse(req.params.id);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid transaction ID format.");
  }

  await transactionsService.deleteTransaction(req.user.userId, parsedParam.data);

  return ApiResponse.ok(res, "Transaction deleted successfully.", null);
});
