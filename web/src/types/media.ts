import type { ISODateTime, UUID } from "@/types/common";

export type MediaProvider = "CLOUDINARY";
export type MediaResourceType = "image" | "raw";
export type MediaDeliveryType = "upload" | "private" | "authenticated";
export type MediaStatus =
  | "PENDING"
  | "UPLOADED"
  | "ATTACHED"
  | "DELETE_PENDING"
  | "DELETED"
  | "FAILED";

export type MediaAsset = {
  id: UUID;
  ownerUserId: UUID;
  provider: MediaProvider;
  providerAssetId: string | null;
  publicId: string;
  resourceType: MediaResourceType;
  deliveryType: MediaDeliveryType;
  format: string | null;
  originalFilename: string;
  mimeType: string;
  bytes: number | null;
  width: number | null;
  height: number | null;
  version: number | null;
  etag: string | null;
  secureUrl: string | null;
  status: MediaStatus;
  uploadExpiresAt: ISODateTime;
  uploadedAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
};

export type UserProfileImage = {
  userId: UUID;
  mediaAssetId: UUID;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  removedAt: ISODateTime | null;
};

export type TransactionAttachment = {
  userId: UUID;
  transactionId: UUID;
  mediaAssetId: UUID;
  sortOrder: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  removedAt: ISODateTime | null;
};
