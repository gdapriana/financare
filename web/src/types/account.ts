import type { ISODateTime, UUID } from "@/types/common";

export type AccountType = "CASH" | "BANK" | "EWALLET";

export type Account = {
  id: UUID;
  userId: UUID;
  name: string;
  type: AccountType;
  institutionName: string | null;
  openingBalance: number;
  color: string | null;
  icon: string | null;
  isArchived: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
