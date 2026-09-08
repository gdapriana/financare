import { eq, and } from "drizzle-orm";
import db from "../configs/db";
import {
  usersTable,
  userProfileImagesTable,
  mediaAssetsTable
} from "../drizzle";
import { formatUser } from "./auth.service";
import { formatMediaAsset } from "./attachments.service";
import { ApiError } from "../utils/api-error";

export interface UpdateUserPreferencesDTO {
  display_name?: string;
  timezone?: string;
  currency_code?: string;
}

export const getUserProfile = async (userId: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    with: {
      profileImages: {
        where: eq(userProfileImagesTable.isPrimary, true),
        with: {
          mediaAsset: true
        }
      }
    }
  });

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  const primaryImageRecord = user.profileImages?.[0];
  const primaryProfileImage = primaryImageRecord?.mediaAsset
    ? formatMediaAsset(primaryImageRecord.mediaAsset)
    : null;
  return {
    user: formatUser(user),
    primary_profile_image: primaryProfileImage
  };
};

export const updateUserPreferences = async (
  userId: string,
  dto: UpdateUserPreferencesDTO
) => {
  const [updatedUser] = await db
    .update(usersTable)
    .set({
      ...(dto.display_name && { displayName: dto.display_name }),
      ...(dto.timezone && { timezone: dto.timezone }),
      ...(dto.currency_code && { currencyCode: dto.currency_code }),
      updatedAt: new Date()
    })
    .where(eq(usersTable.id, userId))
    .returning();

  if (!updatedUser) {
    throw ApiError.notFound("User not found.");
  }

  return {
    user: formatUser(updatedUser)
  };
};
