import crypto from "crypto";
import {
  eq,
  and,
  sql,
  isNull,
  desc,
  gte,
  lte,
  ilike,
  or,
  inArray
} from "drizzle-orm";
import db from "../configs/db";
import {
  transactionsTable,
  expenseItemsTable,
  accountsTable,
  transactionAttachmentsTable,
  mediaAssetsTable
} from "../drizzle";
import { ApiError } from "../utils/api-error";

export type TransactionSelect = typeof transactionsTable.$inferSelect;
export type ExpenseItemSelect = typeof expenseItemsTable.$inferSelect;
export type MediaAssetSelect = typeof mediaAssetsTable.$inferSelect;

export interface CreateExpenseItemDTO {
  name: string;
  quantity: number;
  unit_price: number;
  sort_order?: number;
}

export interface CreateTransactionDTO {
  type: "INCOME" | "EXPENSE";
  account_id: string;
  amount?: number;
  source_name?: string | null;
  occurred_at: string;
  note?: string | null;
  items?: CreateExpenseItemDTO[];
  location?: {
    name: string;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  attachment_ids?: string[];
}

export interface UpdateTransactionDTO {
  occurred_at?: string;
  note?: string | null;
  source_name?: string | null;
  items?: CreateExpenseItemDTO[];
  location?: {
    name: string;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
}

export interface GetTransactionsFilter {
  start_date?: string;
  end_date?: string;
  type?: "INCOME" | "EXPENSE";
  account_id?: string;
  search?: string;
  limit?: number;
  cursor?: string;
}

export const formatExpenseItem = (item: ExpenseItemSelect) => {
  return {
    id: item.id,
    transaction_id: item.transactionId,
    name: item.name,
    quantity: Number(item.quantity),
    unit_price: item.unitPrice,
    line_total:
      item.lineTotal !== null && item.lineTotal !== undefined
        ? item.lineTotal
        : Math.round(Number(item.quantity) * item.unitPrice),
    sort_order: item.sortOrder
  };
};

export const formatMediaAsset = (asset: MediaAssetSelect) => {
  return {
    id: asset.id,
    owner_user_id: asset.ownerUserId,
    provider: asset.provider,
    public_id: asset.publicId,
    resource_type: asset.resourceType,
    delivery_type: asset.deliveryType,
    format: asset.format,
    original_filename: asset.originalFilename,
    mime_type: asset.mimeType,
    bytes: asset.bytes,
    secure_url: asset.secureUrl,
    status: asset.status
  };
};

export const formatTransaction = (
  tx: TransactionSelect,
  items: ExpenseItemSelect[] = [],
  attachments: MediaAssetSelect[] = []
) => {
  return {
    id: tx.id,
    user_id: tx.userId,
    account_id: tx.accountId,
    type: tx.type,
    amount: tx.amount,
    source_name: tx.sourceName,
    occurred_at: tx.occurredAt,
    note: tx.note,
    location_name: tx.locationName,
    latitude: tx.latitude ? Number(tx.latitude) : null,
    longitude: tx.longitude ? Number(tx.longitude) : null,
    idempotency_key: tx.idempotencyKey,
    items: items.map(formatExpenseItem),
    attachments: attachments.map(formatMediaAsset),
    created_at: tx.createdAt,
    updated_at: tx.updatedAt,
    deleted_at: tx.deletedAt
  };
};

export const getUserTransactions = async (
  userId: string,
  filters: GetTransactionsFilter
) => {
  const limit = Math.min(Math.max(filters.limit || 20, 1), 100);

  const conditions = [
    eq(transactionsTable.userId, userId),
    isNull(transactionsTable.deletedAt)
  ];

  if (filters.account_id) {
    conditions.push(eq(transactionsTable.accountId, filters.account_id));
  }

  if (filters.type) {
    conditions.push(eq(transactionsTable.type, filters.type));
  }

  if (filters.start_date) {
    conditions.push(
      gte(transactionsTable.occurredAt, new Date(filters.start_date))
    );
  }

  if (filters.end_date) {
    conditions.push(
      lte(transactionsTable.occurredAt, new Date(filters.end_date))
    );
  }

  if (filters.search) {
    const searchPattern = `%${filters.search.trim()}%`;
    conditions.push(
      or(
        ilike(transactionsTable.sourceName, searchPattern),
        ilike(transactionsTable.note, searchPattern),
        ilike(transactionsTable.locationName, searchPattern)
      )!
    );
  }

  const transactions: TransactionSelect[] =
    await db.query.transactionsTable.findMany({
      where: and(...conditions),
      orderBy: [desc(transactionsTable.occurredAt), desc(transactionsTable.id)],
      limit: limit + 1
    });

  let nextCursor: string | null = null;
  if (transactions.length > limit) {
    const nextItem = transactions.pop();
    nextCursor = nextItem ? nextItem.id : null;
  }

  const txIds = transactions.map(t => t.id);
  let allItems: ExpenseItemSelect[] = [];
  if (txIds.length > 0) {
    allItems = await db.query.expenseItemsTable.findMany({
      where: inArray(expenseItemsTable.transactionId, txIds),
      orderBy: [expenseItemsTable.sortOrder]
    });
  }

  const formattedTransactions = transactions.map(tx => {
    const txItems = allItems.filter(i => i.transactionId === tx.id);
    return formatTransaction(tx, txItems, []);
  });

  return {
    transactions: formattedTransactions,
    next_cursor: nextCursor
  };
};

export const createTransaction = async (
  userId: string,
  idempotencyKey: string,
  dto: CreateTransactionDTO
) => {
  const account = await db.query.accountsTable.findFirst({
    where: and(
      eq(accountsTable.id, dto.account_id),
      eq(accountsTable.userId, userId)
    )
  });

  if (!account) {
    throw ApiError.badRequest("Account not found or does not belong to user.");
  }

  const idempotencyRequestHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ ...dto, userId }))
    .digest("hex");

  const existingTx = await db.query.transactionsTable.findFirst({
    where: and(
      eq(transactionsTable.userId, userId),
      eq(transactionsTable.idempotencyKey, idempotencyKey)
    )
  });

  if (existingTx) {
    if (existingTx.idempotencyRequestHash === idempotencyRequestHash) {
      const items = await db.query.expenseItemsTable.findMany({
        where: eq(expenseItemsTable.transactionId, existingTx.id),
        orderBy: [expenseItemsTable.sortOrder]
      });
      return formatTransaction(existingTx, items, []);
    }
    throw ApiError.conflict(
      "Idempotency key reused with different request payload."
    );
  }

  let computedAmount = dto.amount || 0;
  if (dto.type === "EXPENSE" && dto.items && dto.items.length > 0) {
    computedAmount = dto.items.reduce(
      (sum, item) =>
        sum + Math.round(Number(item.quantity) * Number(item.unit_price)),
      0
    );
  }

  const occurredAtDate = new Date(dto.occurred_at);

  const result = await db.transaction(async tx => {
    const [newTx] = await tx
      .insert(transactionsTable)
      .values({
        userId,
        accountId: dto.account_id,
        type: dto.type,
        amount: computedAmount,
        sourceName: dto.source_name,
        occurredAt: occurredAtDate,
        note: dto.note || null,
        locationName: dto.location ? dto.location.name : null,
        latitude:
          dto.location &&
          dto.location.latitude !== undefined &&
          dto.location.latitude !== null
            ? String(dto.location.latitude)
            : null,
        longitude:
          dto.location &&
          dto.location.longitude !== undefined &&
          dto.location.longitude !== null
            ? String(dto.location.longitude)
            : null,
        idempotencyKey,
        idempotencyRequestHash
      })
      .returning();

    let insertedItems: ExpenseItemSelect[] = [];
    if (dto.type === "EXPENSE" && dto.items && dto.items.length > 0) {
      insertedItems = await tx
        .insert(expenseItemsTable)
        .values(
          dto.items.map((item, index) => ({
            transactionId: newTx.id,
            name: item.name,
            quantity: String(item.quantity),
            unitPrice: item.unit_price,
            sortOrder: item.sort_order ?? index
          }))
        )
        .returning();
    }

    if (dto.attachment_ids && dto.attachment_ids.length > 0) {
      await tx.insert(transactionAttachmentsTable).values(
        dto.attachment_ids.map((assetId, index) => ({
          userId,
          transactionId: newTx.id,
          mediaAssetId: assetId,
          sortOrder: index
        }))
      );
    }

    return { newTx, insertedItems };
  });

  return formatTransaction(result.newTx, result.insertedItems, []);
};

export const getTransactionById = async (
  userId: string,
  transactionId: string
) => {
  const tx = await db.query.transactionsTable.findFirst({
    where: and(
      eq(transactionsTable.id, transactionId),
      eq(transactionsTable.userId, userId),
      isNull(transactionsTable.deletedAt)
    )
  });

  if (!tx) {
    throw ApiError.notFound("Transaction not found.");
  }

  const items = await db.query.expenseItemsTable.findMany({
    where: eq(expenseItemsTable.transactionId, tx.id),
    orderBy: [expenseItemsTable.sortOrder]
  });

  return formatTransaction(tx, items, []);
};

export const updateTransaction = async (
  userId: string,
  transactionId: string,
  dto: UpdateTransactionDTO
) => {
  const existingTx = await db.query.transactionsTable.findFirst({
    where: and(
      eq(transactionsTable.id, transactionId),
      eq(transactionsTable.userId, userId),
      isNull(transactionsTable.deletedAt)
    )
  });

  if (!existingTx) {
    throw ApiError.notFound("Transaction not found.");
  }

  const result = await db.transaction(async tx => {
    let newAmount = existingTx.amount;

    if (existingTx.type === "EXPENSE" && dto.items && dto.items.length > 0) {
      await tx
        .delete(expenseItemsTable)
        .where(eq(expenseItemsTable.transactionId, transactionId));

      await tx.insert(expenseItemsTable).values(
        dto.items.map((item, index) => ({
          transactionId,
          name: item.name,
          quantity: String(item.quantity),
          unitPrice: item.unit_price,
          sortOrder: item.sort_order ?? index
        }))
      );

      newAmount = dto.items.reduce(
        (sum, item) =>
          sum + Math.round(Number(item.quantity) * Number(item.unit_price)),
        0
      );
    }

    const [updatedTx] = await tx
      .update(transactionsTable)
      .set({
        amount: newAmount,
        ...(dto.occurred_at && { occurredAt: new Date(dto.occurred_at) }),
        ...(dto.note !== undefined && { note: dto.note }),
        ...(dto.source_name !== undefined && { sourceName: dto.source_name }),
        ...(dto.location && {
          locationName: dto.location.name,
          latitude:
            dto.location.latitude !== undefined &&
            dto.location.latitude !== null
              ? String(dto.location.latitude)
              : null,
          longitude:
            dto.location.longitude !== undefined &&
            dto.location.longitude !== null
              ? String(dto.location.longitude)
              : null
        }),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.userId, userId)
        )
      )
      .returning();

    const items = await tx.query.expenseItemsTable.findMany({
      where: eq(expenseItemsTable.transactionId, transactionId),
      orderBy: [expenseItemsTable.sortOrder]
    });

    return { updatedTx, items };
  });

  return formatTransaction(result.updatedTx, result.items, []);
};

export const deleteTransaction = async (
  userId: string,
  transactionId: string
) => {
  const existingTx = await db.query.transactionsTable.findFirst({
    where: and(
      eq(transactionsTable.id, transactionId),
      eq(transactionsTable.userId, userId),
      isNull(transactionsTable.deletedAt)
    )
  });

  if (!existingTx) {
    throw ApiError.notFound("Transaction not found.");
  }

  await db
    .update(transactionsTable)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date()
    })
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, userId)
      )
    );
};
