import { api } from "@/lib/axios"

export type AccountType = "CASH" | "BANK" | "EWALLET"

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  institution_name: string | null
  opening_balance: number
  current_balance: number
  color: string | null
  icon: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface GetAccountsData {
  total_balance: number
  accounts: Account[]
}

export interface CreateAccountInput {
  name: string
  type: AccountType
  institution_name?: string | null
  opening_balance?: number
  color?: string | null
  icon?: string | null
}

export interface UpdateAccountInput {
  name?: string
  institution_name?: string | null
  color?: string | null
  icon?: string | null
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const accountsApi = {
  getAccounts: async (): Promise<GetAccountsData> => {
    const res = await api.get<ApiResponse<GetAccountsData>>("/accounts")
    return res.data.data
  },

  getAccountById: async (id: string): Promise<Account> => {
    const res = await api.get<ApiResponse<Account>>(`/accounts/${id}`)
    return res.data.data
  },

  createAccount: async (payload: CreateAccountInput): Promise<Account> => {
    const res = await api.post<ApiResponse<Account>>("/accounts", payload)
    return res.data.data
  },

  updateAccount: async (
    id: string,
    payload: UpdateAccountInput
  ): Promise<Account> => {
    const res = await api.patch<ApiResponse<Account>>(
      `/accounts/${id}`,
      payload
    )
    return res.data.data
  },

  archiveAccount: async (id: string): Promise<Account> => {
    const res = await api.post<ApiResponse<Account>>(`/accounts/${id}/archive`)
    return res.data.data
  },
}
