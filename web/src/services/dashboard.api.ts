import { api } from "@/lib/axios"
import type { Account } from "@/types/account"
import type { Transaction } from "@/types/transaction"

export interface DashboardSummaryData {
  total_balance: number
  monthly_income: number
  monthly_expense: number
  net_cashflow: number
  accounts: Account[]
  recent_transactions: Transaction[]
}

export interface CalendarDayIndicator {
  date: string
  indicator: "GREEN" | "RED" | "NEUTRAL"
  total_income: number
  total_expense: number
  transaction_count: number
}

export interface MonthlyCalendarData {
  month: string
  days: CalendarDayIndicator[]
}

export interface CalendarDateDetailsData {
  date: string
  total_income: number
  total_expense: number
  net_difference: number
  transactions: Transaction[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const dashboardApi = {
  getSummary: async (month?: string): Promise<DashboardSummaryData> => {
    const res = await api.get<ApiResponse<DashboardSummaryData>>(
      "/dashboard/summary",
      {
        params: { month },
      }
    )
    return res.data.data
  },

  getCalendar: async (month: string): Promise<MonthlyCalendarData> => {
    const res = await api.get<ApiResponse<MonthlyCalendarData>>("/calendar", {
      params: { month },
    })
    return res.data.data
  },

  getCalendarDateDetails: async (
    date: string
  ): Promise<CalendarDateDetailsData> => {
    const res = await api.get<ApiResponse<CalendarDateDetailsData>>(
      `/calendar/${date}`
    )
    return res.data.data
  },
}
