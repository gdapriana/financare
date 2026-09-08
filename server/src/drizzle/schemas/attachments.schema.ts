import { pgTable, uuid, integer, timestamp, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { transactionsTable } from "./transactions.schema";
import { mediaAssetsTable } from "./media-assets.schema";

export const transactionAttachmentsTable = pgTable(
  "transaction_attachments",
  {
    userId: uuid("user_id").notNull(),
    transactionId: uuid("transaction_id").notNull(),
    mediaAssetId: uuid("media_asset_id").notNull().unique(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    removedAt: timestamp("removed_at", { withTimezone: true })
  },
  (table) => [
    primaryKey({ columns: [table.transactionId, table.mediaAssetId] }),
    foreignKey({
      columns: [table.userId, table.transactionId],
      foreignColumns: [transactionsTable.userId, transactionsTable.id],
      name: "transaction_attachments_user_id_transaction_id_transactions_user_id_id_fk"
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId, table.mediaAssetId],
      foreignColumns: [mediaAssetsTable.ownerUserId, mediaAssetsTable.id],
      name: "transaction_attachments_user_id_media_asset_id_media_assets_owner_user_id_id_fk"
    }).onDelete("restrict")
  ]
);

export type TransactionAttachment = typeof transactionAttachmentsTable.$inferSelect;
export type NewTransactionAttachment = typeof transactionAttachmentsTable.$inferInsert;
