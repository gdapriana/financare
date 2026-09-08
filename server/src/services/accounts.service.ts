import { eq, and, sql, isNull, desc } from "drizzle-orm";
import db from "../configs/db";
import { accountsTable, transactionsTable } from "../drizzle";
import { ApiError } from "../utils/api-error";

export type AccountSelect = typeof accountsTable.$inferSelect;

export interface CreateAccountDTO {
  name: string;
  type: "CASH" | "BANK" | "EWALLET";
  institution_name?: string | null;
  opening_balance?: number;
  color?: string | null;
  icon?: string | null;
}

export interface UpdateAccountDTO {
  name?: string;
  institution_name?: string | null;
  color?: string | null;
  icon?: string | null;
}

export const formatAccount = (
  account: AccountSelect,
  currentBalance: number
) => {
  return {
    id: account.id,
    user_id: account.userId,
    name: account.name,
    type: account.type,
    institution_name: account.institutionName,
    opening_balance: account.openingBalance,
    current_balance: currentBalance,
    color: account.color,
    icon: account.icon,
    is_archived: account.isArchived,
    created_at: account.createdAt,
    updated_at: account.updatedAt
  };
};

export const calculateAccountBalance = async (
  userId: string,
  accountId: string,
  openingBalance: number
): Promise<number> => {
  const result = await db
    .select({
      income: sql<number>`COALESCE(SUM(CASE WHEN ${transactionsTable.type} = 'INCOME' THEN ${transactionsTable.amount} ELSE 0 END), 0)`,
      expense: sql<number>`COALESCE(SUM(CASE WHEN ${transactionsTable.type} = 'EXPENSE' THEN ${transactionsTable.amount} ELSE 0 END), 0)`
    })
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.userId, userId),
        eq(transactionsTable.accountId, accountId),
        isNull(transactionsTable.deletedAt)
      )
    );

  const income = Number(result[0]?.income || 0);
  const expense = Number(result[0]?.expense || 0);

  return openingBalance + income - expense;
};

export const getUserAccounts = async (userId: string) => {
  const accounts: AccountSelect[] = await db.query.accountsTable.findMany({
    where: eq(accountsTable.userId, userId),
    orderBy: [desc(accountsTable.createdAt)]
  });

  let totalBalance = 0;
  const formattedAccounts = await Promise.all(
    accounts.map(async (account: AccountSelect) => {
      const currentBalance = await calculateAccountBalance(
        userId,
        account.id,
        account.openingBalance
      );
      if (!account.isArchived) {
        totalBalance += currentBalance;
      }
      return formatAccount(account, currentBalance);
    })
  );

  return {
    total_balance: totalBalance,
    accounts: formattedAccounts
  };
};

export const createAccount = async (userId: string, dto: CreateAccountDTO) => {
  const [newAccount] = await db
    .insert(accountsTable)
    .values({
      userId,
      name: dto.name,
      type: dto.type,
      institutionName: dto.institution_name || null,
      openingBalance: dto.opening_balance ?? 0,
      color: dto.color || null,
      icon: dto.icon || null
    })
    .returning();

  return formatAccount(newAccount, newAccount.openingBalance);
};

export const getAccountById = async (userId: string, accountId: string) => {
  const account = await db.query.accountsTable.findFirst({
    where: and(
      eq(accountsTable.id, accountId),
      eq(accountsTable.userId, userId)
    )
  });

  if (!account) {
    throw ApiError.notFound("Account not found.");
  }

  const currentBalance = await calculateAccountBalance(
    userId,
    account.id,
    account.openingBalance
  );

  return formatAccount(account, currentBalance);
};

export const updateAccount = async (
  userId: string,
  accountId: string,
  dto: UpdateAccountDTO
) => {
  const existingAccount = await db.query.accountsTable.findFirst({
    where: and(
      eq(accountsTable.id, accountId),
      eq(accountsTable.userId, userId)
    )
  });

  if (!existingAccount) {
    throw ApiError.notFound("Account not found.");
  }

  const [updatedAccount] = await db
    .update(accountsTable)
    .set({
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.institution_name !== undefined && { institutionName: dto.institution_name }),
      ...(dto.color !== undefined && { color: dto.color }),
      ...(dto.icon !== undefined && { icon: dto.icon }),
      updatedAt: new Date()
    })
    .where(and(eq(accountsTable.id, accountId), eq(accountsTable.userId, userId)))
    .returning();

  const currentBalance = await calculateAccountBalance(
    userId,
    updatedAccount.id,
    updatedAccount.openingBalance
  );

  return formatAccount(updatedAccount, currentBalance);
};

export const archiveAccount = async (userId: string, accountId: string) => {
  const existingAccount = await db.query.accountsTable.findFirst({
    where: and(
      eq(accountsTable.id, accountId),
      eq(accountsTable.userId, userId)
    )
  });

  if (!existingAccount) {
    throw ApiError.notFound("Account not found.");
  }

  const [archivedAccount] = await db
    .update(accountsTable)
    .set({
      isArchived: true,
      updatedAt: new Date()
    })
    .where(and(eq(accountsTable.id, accountId), eq(accountsTable.userId, userId)))
    .returning();

  const currentBalance = await calculateAccountBalance(
    userId,
    archivedAccount.id,
    archivedAccount.openingBalance
  );

  return formatAccount(archivedAccount, currentBalance);
};
