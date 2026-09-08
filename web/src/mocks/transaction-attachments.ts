import type { TransactionAttachment } from "@/types/media";

import { mockIds } from "@/mocks/mock-ids";

export const mockTransactionAttachments: TransactionAttachment[] = [
  {
    userId: mockIds.user,
    transactionId: mockIds.transactions.groceries,
    mediaAssetId: mockIds.mediaAssets.groceryReceipt,
    sortOrder: 0,
    createdAt: "2026-08-23T18:37:00+08:00",
    updatedAt: "2026-08-23T18:37:00+08:00",
    removedAt: null,
  },
  {
    userId: mockIds.user,
    transactionId: mockIds.transactions.coffee,
    mediaAssetId: mockIds.mediaAssets.coffeeReceipt,
    sortOrder: 0,
    createdAt: "2026-08-19T20:12:00+08:00",
    updatedAt: "2026-08-19T20:12:00+08:00",
    removedAt: null,
  },
];
