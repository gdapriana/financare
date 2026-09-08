import { useAuthStore } from "@/store/auth-store"
import { Navigate, Outlet } from "react-router"

export default function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
