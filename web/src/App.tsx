import { Routes, Route } from "react-router"
import Homepage from "@/pages/home"
import Profile from "@/pages/profile"
import NotFound from "@/pages/not-found"
import ProtectedRoute from "@/components/protected-route"
import PublicRoute from "@/components/public-route"
import LoginPage from "@/pages/auth/login"
import RegisterPage from "@/pages/auth/register"
import Calendar from "@/pages/calendar"
import Statistic from "@/pages/statistic"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 404
        ) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/statistic" element={<Statistic />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}

export default App
