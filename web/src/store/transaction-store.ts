import type { Transaction } from "@/types/transaction"
import { create } from "zustand"

interface TransactionState {
  recentTransactions: Transaction[]
  loadingRecentTransactions: boolean
  setRecentTransactions: (transactions: Transaction[]) => void
  setLoadingRecentTransactions: (val: boolean) => void
}

export const useTransactionStore = create<TransactionState>((set) => ({
  recentTransactions: [],
  setRecentTransactions: (transactions) =>
    set(() => ({ recentTransactions: transactions })),
  loadingRecentTransactions: false,
  setLoadingRecentTransactions: (val) =>
    set({ loadingRecentTransactions: val }),
}))
