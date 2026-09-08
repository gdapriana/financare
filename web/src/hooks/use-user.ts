import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/query-keys"
import { showToast } from "@/lib/toast"
import { userApi } from "@/services/user.api"

export function useUpdatePreferencesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me })
      showToast({
        title: "Updated",
        description: "Profile preferences updated successfully!",
      })
    },
  })
}

export function useUpdateAvatarMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me })
      showToast({
        title: "Avatar Updated",
        description: "Profile picture has been updated!",
      })
    },
  })
}
