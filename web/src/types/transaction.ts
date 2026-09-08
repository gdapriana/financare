import type { IconSvgElement } from "@hugeicons/react"

import type { ISODateTime, UUID } from "@/types/common"

export type TransactionType = "INCOME" | "EXPENSE"

export type Transaction = {
  id: UUID
  userId: UUID
  accountId: UUID
  type: TransactionType
  amount: number
  sourceName: string | null
  occurredAt: ISODateTime
  note: string | null
  locationName: string | null
  latitude: number | null
  longitude: number | null
  idempotencyKey: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
  deletedAt: ISODateTime | null
}

export type PaymentMethodType = {
  name: string
  icon: IconSvgElement
  subs?: { name: string }[]
}[]
