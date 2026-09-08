import { pgTable, uuid, varchar, numeric, bigint, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { transactionsTable } from "./transactions.schema";

export const expenseItemsTable = pgTable(
  "expense_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    transactionId: uuid("transaction_id")
      .notNull()
      .references(() => transactionsTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    quantity: numeric("quantity", { precision: 14, scale: 3 }).notNull(),
    unitPrice: bigint("unit_price", { mode: "number" }).notNull(),
    lineTotal: bigint("line_total", { mode: "number" }).generatedAlwaysAs(
      sql`ROUND(quantity * unit_price)::BIGINT`
    ),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    unique("expense_items_transaction_sort_unique").on(table.transactionId, table.sortOrder)
  ]
);

export type ExpenseItem = typeof expenseItemsTable.$inferSelect;
export type NewExpenseItem = typeof expenseItemsTable.$inferInsert;
