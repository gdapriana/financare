import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/query-keys"
import { showToast } from "@/lib/toast"
import { accountsApi, type UpdateAccountInput } from "@/services/accounts.api"

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

export function useGetAccountByIdQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.accounts.detail(id),
    queryFn: () => accountsApi.getAccountById(id),
    enabled: Boolean(id),
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

export function useUnarchiveAccountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountsApi.unarchiveAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dashboard.summary(),
      })
      showToast({
        title: "Account Unarchived",
        description: "Account has been unarchived.",
      })
    },
  })
}

export function useUpdateAccountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAccountInput
    }) => accountsApi.updateAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dashboard.summary(),
      })
      showToast({
        title: "Account Updated",
        description: "Account details updated successfully!",
      })
    },
  })
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountsApi.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dashboard.summary(),
      })
      showToast({
        title: "Account Deleted",
        description: "Account and its associated transactions deleted.",
      })
    },
  })
}
