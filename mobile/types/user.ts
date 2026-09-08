import type { ISODateTime, UUID } from "@/types/common";

export type User = {
  id: UUID;
  email: string;
  displayName: string;
  timezone: string;
  currencyCode: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  // Derived by the API from the active primary user_profile_images relation.
  avatarUrl: string | null;
};
