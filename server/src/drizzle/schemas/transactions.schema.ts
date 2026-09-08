import { pgTable, uuid, varchar, bigint, numeric, text, timestamp, foreignKey, unique, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { accountsTable } from "./accounts.schema";

export const transactionsTable = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    accountId: uuid("account_id").notNull(),
    type: varchar("type", { length: 16 }).notNull(),
    amount: bigint("amount", { mode: "number" }).notNull().default(0),
    sourceName: varchar("source_name", { length: 150 }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    note: text("note"),
    locationName: varchar("location_name", { length: 255 }),
    latitude: numeric("latitude", { precision: 9, scale: 6 }),
    longitude: numeric("longitude", { precision: 10, scale: 6 }),
    idempotencyKey: varchar("idempotency_key", { length: 255 }).notNull(),
    idempotencyRequestHash: varchar("idempotency_request_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
  },
  (table) => [
    foreignKey({
      columns: [table.userId, table.accountId],
      foreignColumns: [accountsTable.userId, accountsTable.id],
      name: "transactions_user_id_account_id_accounts_user_id_id_fk"
    }).onDelete("restrict"),
    unique("transactions_user_id_id_unique").on(table.userId, table.id),
    unique("transactions_user_idempotency_unique").on(table.userId, table.idempotencyKey),
    index("transactions_history_idx").on(table.userId, table.occurredAt, table.id),
    index("transactions_account_history_idx").on(table.userId, table.accountId, table.occurredAt),
    index("transactions_type_history_idx").on(table.userId, table.type, table.occurredAt)
  ]
);

export type Transaction = typeof transactionsTable.$inferSelect;
export type NewTransaction = typeof transactionsTable.$inferInsert;
