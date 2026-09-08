import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/query-keys"
import { showToast } from "@/lib/toast"
import { accountsApi } from "@/services/accounts.api"

export function useAccountsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.accounts.all,
    queryFn: accountsApi.getAccounts,
  })
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountsApi.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dashboard.summary(),
      })
      showToast({
        title: "Account Created",
        description: "New account created successfully!",
      })
    },
  })
}

export function useArchiveAccountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountsApi.archiveAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all })
      showToast({
        title: "Account Archived",
        description: "Account has been archived.",
      })
    },
  })
}
