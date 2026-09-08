import { api } from "@/lib/axios"
import type { MediaAsset } from "@/services/attachments.api"

export type TransactionType = "INCOME" | "EXPENSE"

export interface ExpenseItem {
  id: string
  transaction_id: string
  name: string
  quantity: number
  unit_price: number
  line_total: number
  sort_order: number
}

export interface ExpenseItemInput {
  name: string
  quantity: number
  unit_price: number
  sort_order?: number
}

export interface LocationInput {
  name: string
  latitude?: number | null
  longitude?: number | null
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  type: TransactionType
  amount: number
  occurred_at: string
  note: string | null
  source_name: string | null
  location_name: string | null
  latitude: number | null
  longitude: number | null
  idempotency_key: string
  items: ExpenseItem[]
  attachments: MediaAsset[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface GetTransactionsFilter {
  start_date?: string
  end_date?: string
  type?: TransactionType
  account_id?: string
  search?: string
  limit?: number
  cursor?: string
}

export interface GetTransactionsResponseData {
  transactions: Transaction[]
  next_cursor: string | null
  has_more: boolean
}

export interface CreateTransactionInput {
  type: TransactionType
  account_id: string
  amount?: number
  source_name?: string | null
  occurred_at: string
  note?: string | null
  items?: ExpenseItemInput[]
  location?: LocationInput | null
  attachment_ids?: string[]
}

export interface UpdateTransactionInput {
  occurred_at?: string
  note?: string | null
  source_name?: string | null
  items?: ExpenseItemInput[]
  location?: LocationInput | null
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const transactionsApi = {
  getTransactions: async (
    filters: GetTransactionsFilter = {}
  ): Promise<GetTransactionsResponseData> => {
    const res = await api.get<ApiResponse<GetTransactionsResponseData>>(
      "/transactions",
      {
        params: filters,
      }
    )
    return res.data.data
  },

  getTransactionById: async (id: string): Promise<Transaction> => {
    const res = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`)
    return res.data.data
  },

  createTransaction: async (
    payload: CreateTransactionInput,
    idempotencyKey: string
  ): Promise<Transaction> => {
    const res = await api.post<ApiResponse<Transaction>>(
      "/transactions",
      payload,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    )
    return res.data.data
  },

  updateTransaction: async (
    id: string,
    payload: UpdateTransactionInput
  ): Promise<Transaction> => {
    const res = await api.patch<ApiResponse<Transaction>>(
      `/transactions/${id}`,
      payload
    )
    return res.data.data
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`)
  },
}
