import { Request, Response } from "express";
import * as usersService from "../services/users.service";
import * as attachmentsService from "../services/attachments.service";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import {
  updateUserPreferencesSchema,
  updateAvatarSchema
} from "../validations/users.validation";

export const getProfile = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const profile = await usersService.getUserProfile(req.user.userId);

  return ApiResponse.ok(res, "User profile retrieved successfully.", profile);
});

export const updatePreferences = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsed = updateUserPreferencesSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest("Invalid profile update payload.", parsed.error.flatten().fieldErrors);
  }

  const result = await usersService.updateUserPreferences(req.user.userId, parsed.data);

  return ApiResponse.ok(res, "User profile & preferences updated successfully.", result);
});

export const updateAvatar = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  let assetId: string;

  if (req.file) {
    const uploadedAsset = await attachmentsService.uploadMediaFile(
      req.user.userId,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      "financare/avatars"
    );
    assetId = uploadedAsset.id;
  } else {
    const parsedBody = updateAvatarSchema.safeParse(req.body);
    if (!parsedBody.success || !parsedBody.data.media_asset_id) {
      throw ApiError.badRequest("Please upload an image file or provide a valid media_asset_id.");
    }
    assetId = parsedBody.data.media_asset_id;
  }

  const result = await attachmentsService.updateUserAvatar(req.user.userId, assetId);

  return ApiResponse.ok(res, "User profile avatar updated successfully.", result);
});
