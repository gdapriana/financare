import type { UserProfileImage } from "@/types/media";

import { mockIds } from "@/mocks/mock-ids";

export const mockUserProfileImages: UserProfileImage[] = [
  {
    userId: mockIds.user,
    mediaAssetId: mockIds.mediaAssets.profile,
    isPrimary: true,
    sortOrder: 0,
    createdAt: "2026-01-10T09:12:00+08:00",
    updatedAt: "2026-01-10T09:12:00+08:00",
    removedAt: null,
  },
];
