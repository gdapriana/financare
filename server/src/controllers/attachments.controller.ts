import { Request, Response } from "express";
import { z } from "zod";
import * as attachmentsService from "../services/attachments.service";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import {
  cancelAttachmentsSchema
} from "../validations/attachments.validation";

const attachmentIdParamSchema = z.string().uuid("Invalid attachment ID format.");
const avatarBodySchema = z.object({
  media_asset_id: z.string().uuid("Invalid media_asset_id format.").optional()
});

export const uploadAttachment = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const filesToUpload: Express.Multer.File[] = [];

  if (req.file) {
    filesToUpload.push(req.file);
  } else if (req.files) {
    if (Array.isArray(req.files)) {
      filesToUpload.push(...req.files);
    } else {
      Object.values(req.files).forEach((fileArray) => {
        filesToUpload.push(...fileArray);
      });
    }
  }

  if (filesToUpload.length === 0) {
    throw ApiError.badRequest("No image or file was uploaded.");
  }

  if (filesToUpload.length > 5) {
    throw ApiError.badRequest("Maximum 5 files can be uploaded at once.");
  }

  const uploadedAssets = await Promise.all(
    filesToUpload.map((file) =>
      attachmentsService.uploadMediaFile(
        req.user!.userId,
        file.buffer,
        file.originalname,
        file.mimetype,
        "financare/attachments"
      )
    )
  );

  if (filesToUpload.length === 1 && req.file) {
    return ApiResponse.created(res, "File uploaded successfully to Cloudinary.", {
      media_asset: uploadedAssets[0],
      media_assets: uploadedAssets
    });
  }

  return ApiResponse.created(res, `${uploadedAssets.length} files uploaded successfully to Cloudinary.`, {
    media_assets: uploadedAssets
  });
});

export const cancelAttachments = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsed = cancelAttachmentsSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest("Invalid cancellation payload.", parsed.error.flatten().fieldErrors);
  }

  const result = await attachmentsService.cancelMediaAssets(
    req.user.userId,
    parsed.data.attachment_ids
  );

  return ApiResponse.ok(res, "Attachments cancelled and removed successfully.", result);
});

export const deleteAttachmentById = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsedParam = attachmentIdParamSchema.safeParse(req.params.id);
  if (!parsedParam.success) {
    throw ApiError.badRequest("Invalid attachment ID format.");
  }

  await attachmentsService.deleteMediaAssetById(req.user.userId, parsedParam.data);

  return ApiResponse.ok(res, "Attachment deleted successfully.", null);
});

export const updateUserAvatar = AsyncHandler(async (req: Request, res: Response) => {
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
    const parsedBody = avatarBodySchema.safeParse(req.body);
    if (!parsedBody.success || !parsedBody.data.media_asset_id) {
      throw ApiError.badRequest("Please provide an image file or a valid media_asset_id.");
    }
    assetId = parsedBody.data.media_asset_id;
  }

  const result = await attachmentsService.updateUserAvatar(req.user.userId, assetId);

  return ApiResponse.ok(res, "User avatar updated successfully.", result);
});
