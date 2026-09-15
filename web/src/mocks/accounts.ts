import type { Account } from "@/types/account"

import { mockIds } from "@/mocks/mock-ids"
import type { AccountType } from "@/services/accounts.api"

const createdAt = "2026-01-10T09:15:00+08:00"
const updatedAt = "2026-08-20T15:30:00+08:00"

export const mockAccountType: AccountType[] = ["BANK", "CASH", "EWALLET"]

export const mockAccounts: Account[] = [
  {
    id: mockIds.accounts.cash,
    userId: mockIds.user,
    name: "Cash",
    type: "CASH",
    institutionName: null,
    openingBalance: 1_500_000,
    color: "#158A56",
    icon: "cash",
    isArchived: false,
    createdAt,
    updatedAt,
  },
  {
    id: mockIds.accounts.bca,
    userId: mockIds.user,
    name: "BCA Main Account",
    type: "BANK",
    institutionName: "BCA",
    openingBalance: 8_750_000,
    color: "#0060AF",
    icon: "bank",
    isArchived: false,
    createdAt,
    updatedAt,
  },
  {
    id: mockIds.accounts.bri,
    userId: mockIds.user,
    name: "BRI Savings",
    type: "BANK",
    institutionName: "BRI",
    openingBalance: 3_250_000,
    color: "#00529C",
    icon: "bank",
    isArchived: false,
    createdAt,
    updatedAt,
  },
  {
    id: mockIds.accounts.dana,
    userId: mockIds.user,
    name: "DANA",
    type: "EWALLET",
    institutionName: "DANA",
    openingBalance: 450_000,
    color: "#118EEA",
    icon: "wallet",
    isArchived: false,
    createdAt,
    updatedAt,
  },
  {
    id: mockIds.accounts.gopay,
    userId: mockIds.user,
    name: "GoPay",
    type: "EWALLET",
    institutionName: "GoPay",
    openingBalance: 325_000,
    color: "#00AED6",
    icon: "wallet",
    isArchived: false,
    createdAt,
    updatedAt,
  },
]
