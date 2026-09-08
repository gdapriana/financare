import { pgTable, uuid, varchar, bigint, boolean, timestamp, unique, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";

export const accountsTable = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 100 }).notNull(),
    type: varchar("type", { length: 16 }).notNull(),
    institutionName: varchar("institution_name", { length: 100 }),
    openingBalance: bigint("opening_balance", { mode: "number" }).notNull().default(0),
    color: varchar("color", { length: 9 }),
    icon: varchar("icon", { length: 64 }),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    unique("accounts_user_id_id_unique").on(table.userId, table.id),
    index("accounts_active_user_idx").on(table.userId, table.createdAt)
  ]
);

export type Account = typeof accountsTable.$inferSelect;
export type NewAccount = typeof accountsTable.$inferInsert;
