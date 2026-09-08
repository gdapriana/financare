import { mockAccounts } from "@/mocks/accounts";
import { authenticatedUser } from "@/mocks/authenticated-user";
import { mockExpenseItems } from "@/mocks/expense-items";
import { mockMediaAssets } from "@/mocks/media-assets";
import { mockTransactionAttachments } from "@/mocks/transaction-attachments";
import { mockTransactions } from "@/mocks/transactions";
import { mockUserProfileImages } from "@/mocks/user-profile-images";

// auth_sessions and secret/hash fields are intentionally server-only.
export const mockDatabase = {
  users: [authenticatedUser],
  accounts: mockAccounts,
  transactions: mockTransactions,
  expenseItems: mockExpenseItems,
  mediaAssets: mockMediaAssets,
  userProfileImages: mockUserProfileImages,
  transactionAttachments: mockTransactionAttachments,
};
