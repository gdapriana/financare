import type { ISODateTime, UUID } from "@/types/common"

export type User = {
  id: UUID
  email: string
  displayName: string
  timezone: string
  currencyCode: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
  avatarUrl: string | null
}
