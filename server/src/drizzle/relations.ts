import { relations } from "drizzle-orm";
import { usersTable } from "./schemas/users.schema";
import { authSessionsTable } from "./schemas/auth-sessions.schema";
import { accountsTable } from "./schemas/accounts.schema";
import { transactionsTable } from "./schemas/transactions.schema";
import { expenseItemsTable } from "./schemas/expense-items.schema";
import { mediaAssetsTable } from "./schemas/media-assets.schema";
import { userProfileImagesTable } from "./schemas/user-profiles.schema";
import { transactionAttachmentsTable } from "./schemas/attachments.schema";

export const usersRelations = relations(usersTable, ({ many }) => ({
  authSessions: many(authSessionsTable),
  accounts: many(accountsTable),
  transactions: many(transactionsTable),
  mediaAssets: many(mediaAssetsTable),
  profileImages: many(userProfileImagesTable)
}));

export const authSessionsRelations = relations(authSessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [authSessionsTable.userId],
    references: [usersTable.id]
  })
}));

export const accountsRelations = relations(accountsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id]
  }),
  transactions: many(transactionsTable)
}));

export const transactionsRelations = relations(transactionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [transactionsTable.userId],
    references: [usersTable.id]
  }),
  account: one(accountsTable, {
    fields: [transactionsTable.accountId],
    references: [accountsTable.id]
  }),
  items: many(expenseItemsTable),
  attachments: many(transactionAttachmentsTable)
}));

export const expenseItemsRelations = relations(expenseItemsTable, ({ one }) => ({
  transaction: one(transactionsTable, {
    fields: [expenseItemsTable.transactionId],
    references: [transactionsTable.id]
  })
}));

export const mediaAssetsRelations = relations(mediaAssetsTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [mediaAssetsTable.ownerUserId],
    references: [usersTable.id]
  }),
  profileImages: many(userProfileImagesTable),
  attachments: many(transactionAttachmentsTable)
}));

export const userProfileImagesRelations = relations(userProfileImagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userProfileImagesTable.userId],
    references: [usersTable.id]
  }),
  mediaAsset: one(mediaAssetsTable, {
    fields: [userProfileImagesTable.mediaAssetId],
    references: [mediaAssetsTable.id]
  })
}));

export const transactionAttachmentsRelations = relations(transactionAttachmentsTable, ({ one }) => ({
  transaction: one(transactionsTable, {
    fields: [transactionAttachmentsTable.transactionId],
    references: [transactionsTable.id]
  }),
  mediaAsset: one(mediaAssetsTable, {
    fields: [transactionAttachmentsTable.mediaAssetId],
    references: [mediaAssetsTable.id]
  })
}));
