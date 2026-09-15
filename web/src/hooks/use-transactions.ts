import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { transactionsApi } from "@/services/transactions.api"
import { QUERY_KEYS } from "@/constants/query-keys"
import { showToast } from "@/lib/toast"
import { useMemo } from "react"
import { subDays, startOfDay, endOfDay } from "date-fns"

export function useTransactionsQuery(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.list(filters),
    queryFn: () => transactionsApi.getTransactions(filters),
  })
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: any
      idempotencyKey: string
    }) => transactionsApi.createTransaction(payload, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      showToast({
        title: "Success",
        description: "Transaction recorded successfully!",
      })
    },
  })
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactionsApi.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      showToast({ title: "Deleted", description: "Transaction deleted." })
    },
  })
}

export function usePastWeekTransactions() {
  const { startDate, endDate } = useMemo(() => {
    const today = new Date()
    const sevenDaysAgo = subDays(today, 7)

    return {
      startDate: startOfDay(sevenDaysAgo).toISOString(),
      endDate: endOfDay(today).toISOString(),
    }
  }, [])

  return useTransactionsQuery({
    start_date: startDate,
    end_date: endDate,
  })
}
