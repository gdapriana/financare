import type { User } from "@/types/user";

import { MOCK_PROFILE_IMAGE_URL } from "@/mocks/media-assets";
import { mockIds } from "@/mocks/mock-ids";

export const authenticatedUser: User = {
  id: mockIds.user,
  displayName: "Gede Apriana",
  email: "gedeapriana36@gmail.com",
  timezone: "Asia/Makassar",
  currencyCode: "IDR",
  createdAt: "2026-01-10T09:00:00+08:00",
  updatedAt: "2026-08-20T15:30:00+08:00",
  avatarUrl: MOCK_PROFILE_IMAGE_URL,
};
