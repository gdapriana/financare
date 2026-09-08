import type { ISODateTime, UUID } from "@/types/common";

export type ExpenseItem = {
  id: UUID;
  transactionId: UUID;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sortOrder: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
