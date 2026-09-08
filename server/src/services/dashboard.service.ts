import { eq, and, sql, isNull, gte, lte, inArray, desc } from "drizzle-orm";
import db from "../configs/db";
import { transactionsTable, expenseItemsTable } from "../drizzle";
import { getUserAccounts } from "./accounts.service";
import { getUserTransactions, formatTransaction, TransactionSelect, ExpenseItemSelect } from "./transactions.service";
import { ApiError } from "../utils/api-error";

export const getDashboardSummary = async (userId: string, monthStr?: string) => {
  const now = new Date();
  let year = now.getFullYear();
  let monthNum = now.getMonth() + 1;

  if (monthStr && /^\d{4}-\d{2}$/.test(monthStr)) {
    const parts = monthStr.split("-").map(Number);
    year = parts[0];
    monthNum = parts[1];
  }

  const startOfMonth = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0, 0));
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();
  const endOfMonth = new Date(Date.UTC(year, monthNum - 1, daysInMonth, 23, 59, 59, 999));

  const monthlyTotals = await db
    .select({
      income: sql<number>`COALESCE(SUM(CASE WHEN ${transactionsTable.type} = 'INCOME' THEN ${transactionsTable.amount} ELSE 0 END), 0)`,
      expense: sql<number>`COALESCE(SUM(CASE WHEN ${transactionsTable.type} = 'EXPENSE' THEN ${transactionsTable.amount} ELSE 0 END), 0)`
    })
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.userId, userId),
        isNull(transactionsTable.deletedAt),
        gte(transactionsTable.occurredAt, startOfMonth),
        lte(transactionsTable.occurredAt, endOfMonth)
      )
    );

  const monthlyIncome = Number(monthlyTotals[0]?.income || 0);
  const monthlyExpense = Number(monthlyTotals[0]?.expense || 0);
  const netCashflow = monthlyIncome - monthlyExpense;

  const accountsResult = await getUserAccounts(userId);
  const recentResult = await getUserTransactions(userId, { limit: 5 });

  return {
    total_balance: accountsResult.total_balance,
    monthly_income: monthlyIncome,
    monthly_expense: monthlyExpense,
    net_cashflow: netCashflow,
    accounts: accountsResult.accounts,
    recent_transactions: recentResult.transactions
  };
};

export const getMonthlyCalendar = async (userId: string, monthStr: string) => {
  if (!/^\d{4}-\d{2}$/.test(monthStr)) {
    throw ApiError.badRequest("Invalid month format. Expected YYYY-MM.");
  }

  const [year, monthNum] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getDate();

  const startOfMonth = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, monthNum - 1, daysInMonth, 23, 59, 59, 999));

  const transactions = await db.query.transactionsTable.findMany({
    where: and(
      eq(transactionsTable.userId, userId),
      isNull(transactionsTable.deletedAt),
      gte(transactionsTable.occurredAt, startOfMonth),
      lte(transactionsTable.occurredAt, endOfMonth)
    )
  });

  const daysMap = new Map<number, { income: number; expense: number; count: number }>();

  for (let day = 1; day <= daysInMonth; day++) {
    daysMap.set(day, { income: 0, expense: 0, count: 0 });
  }

  for (const tx of transactions) {
    const txDate = new Date(tx.occurredAt);
    const day = txDate.getUTCDate();
    const current = daysMap.get(day);
    if (current) {
      if (tx.type === "INCOME") {
        current.income += Number(tx.amount);
      } else if (tx.type === "EXPENSE") {
        current.expense += Number(tx.amount);
      }
      current.count += 1;
    }
  }

  const daysList = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayData = daysMap.get(day)!;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `${year}-${monthNum < 10 ? `0${monthNum}` : monthNum}-${formattedDay}`;

    let indicator: "GREEN" | "RED" | "NEUTRAL" = "NEUTRAL";
    if (dayData.income > dayData.expense && dayData.income > 0) {
      indicator = "GREEN";
    } else if (dayData.expense > dayData.income && dayData.expense > 0) {
      indicator = "RED";
    }

    daysList.push({
      date: dateFormatted,
      indicator,
      total_income: dayData.income,
      total_expense: dayData.expense,
      transaction_count: dayData.count
    });
  }

  return {
    month: monthStr,
    days: daysList
  };
};

export const getCalendarDateDetails = async (userId: string, dateStr: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw ApiError.badRequest("Invalid date format. Expected YYYY-MM-DD.");
  }

  const [year, monthNum, dayNum] = dateStr.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(year, monthNum - 1, dayNum, 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, monthNum - 1, dayNum, 23, 59, 59, 999));

  const transactions: TransactionSelect[] = await db.query.transactionsTable.findMany({
    where: and(
      eq(transactionsTable.userId, userId),
      isNull(transactionsTable.deletedAt),
      gte(transactionsTable.occurredAt, startOfDay),
      lte(transactionsTable.occurredAt, endOfDay)
    ),
    orderBy: [desc(transactionsTable.occurredAt), desc(transactionsTable.id)]
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    if (tx.type === "INCOME") {
      totalIncome += Number(tx.amount);
    } else if (tx.type === "EXPENSE") {
      totalExpense += Number(tx.amount);
    }
  }

  const txIds = transactions.map((t) => t.id);
  let allItems: ExpenseItemSelect[] = [];
  if (txIds.length > 0) {
    allItems = await db.query.expenseItemsTable.findMany({
      where: inArray(expenseItemsTable.transactionId, txIds),
      orderBy: [expenseItemsTable.sortOrder]
    });
  }

  const formattedTransactions = transactions.map((tx) => {
    const txItems = allItems.filter((i) => i.transactionId === tx.id);
    return formatTransaction(tx, txItems, []);
  });

  return {
    date: dateStr,
    total_income: totalIncome,
    total_expense: totalExpense,
    net_difference: totalIncome - totalExpense,
    transactions: formattedTransactions
  };
};
