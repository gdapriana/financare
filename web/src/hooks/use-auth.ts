import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/services/auth.api"
import { useAuthStore } from "@/store/auth-store"
import { QUERY_KEYS } from "@/constants/query-keys"
import { showToast } from "@/lib/toast"
import { useNavigate } from "react-router"

export function useMeQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
  })
}

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setAuth(res.data.tokens.access_token, res.data.user)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me })
      showToast({
        title: "Login Successful",
        description: `Welcome back, ${res.data.user.display_name}!`,
      })
      navigate("/", { replace: true })
    },
    onError: (err: any) => {
      showToast({
        title: "Login Failed",
        description: err.response?.data?.message || "Invalid credentials.",
      })
    },
  })
}

export function useLogoutMutation() {
  const logoutStore = useAuthStore((state) => state.logout)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logoutStore()
      queryClient.clear()
      navigate("/login", { replace: true })
    },
  })
}
