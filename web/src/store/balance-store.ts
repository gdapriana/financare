import { create } from "zustand"

interface BalanceState {
  currency: string
  totalBalance: number
  expensesThisMonth: number
  incomeThisMonth: number
  hideBalance: boolean
  setTotalBalance: (val: number) => void
  setExpensesThisMonth: (val: number) => void
  setIncomeThisMonth: (val: number) => void
  setHideBalance: (hide: boolean) => void
  setCurrency: (currency: string) => void
}

export const useBalanceStore = create<BalanceState>((set) => ({
  currency: "IDR",
  totalBalance: 20000000,
  expensesThisMonth: 500000,
  incomeThisMonth: 200000,
  hideBalance: false,
  setTotalBalance: (val) => set(() => ({ totalBalance: val })),
  setIncomeThisMonth: (val) => set(() => ({ incomeThisMonth: val })),
  setExpensesThisMonth: (val) => set(() => ({ expensesThisMonth: val })),
  setHideBalance: (hide) => set(() => ({ hideBalance: hide })),
  setCurrency: (currency) => set(() => ({ currency: currency })),
}))
