import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/query-keys"
import { dashboardApi } from "@/services/dashboard.api"

export function useDashboardSummaryQuery(month?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.summary(month),
    queryFn: () => dashboardApi.getSummary(month),
  })
}

export function useCalendarQuery(month: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.calendar(month),
    queryFn: () => dashboardApi.getCalendar(month),
    enabled: Boolean(month),
  })
}

export function useCalendarDateQuery(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.calendarDate(date),
    queryFn: () => dashboardApi.getCalendarDateDetails(date),
    enabled: Boolean(date),
  })
}
