export const QUERY_KEYS = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    profile: ["users", "profile"] as const,
  },
  accounts: {
    all: ["accounts"] as const,
    detail: (id: string) => ["accounts", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (filters: Record<string, any>) =>
      ["transactions", "list", filters] as const,
    detail: (id: string) => ["transactions", id] as const,
  },
  dashboard: {
    summary: (month?: string) => ["dashboard", "summary", month] as const,
    calendar: (month: string) => ["dashboard", "calendar", month] as const,
    calendarDate: (date: string) =>
      ["dashboard", "calendarDate", date] as const,
  },
}
