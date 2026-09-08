import { eq, and, inArray, isNull } from "drizzle-orm";
import db from "../configs/db";
import cloudinary from "../configs/cloudinary";
import { mediaAssetsTable, userProfileImagesTable, usersTable } from "../drizzle";
import { ApiError } from "../utils/api-error";

export type MediaAssetSelect = typeof mediaAssetsTable.$inferSelect;

export const formatMediaAsset = (asset: MediaAssetSelect) => {
  return {
    id: asset.id,
    owner_user_id: asset.ownerUserId,
    provider: asset.provider,
    provider_asset_id: asset.providerAssetId,
    public_id: asset.publicId,
    resource_type: asset.resourceType,
    delivery_type: asset.deliveryType,
    format: asset.format,
    original_filename: asset.originalFilename,
    mime_type: asset.mimeType,
    bytes: asset.bytes,
    width: asset.width,
    height: asset.height,
    version: asset.version,
    etag: asset.etag,
    secure_url: asset.secureUrl,
    status: asset.status,
    upload_expires_at: asset.uploadExpiresAt,
    uploaded_at: asset.uploadedAt,
    created_at: asset.createdAt,
    updated_at: asset.updatedAt,
    deleted_at: asset.deletedAt
  };
};

export const uploadMediaFile = async (
  userId: string,
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  folder = "financare/attachments"
) => {
  const uploadResult = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto"
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed."));
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });

  const [newAsset] = await db
    .insert(mediaAssetsTable)
    .values({
      ownerUserId: userId,
      provider: "CLOUDINARY",
      providerAssetId: uploadResult.asset_id || null,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type || "image",
      deliveryType: uploadResult.type || "upload",
      format: uploadResult.format || null,
      originalFilename: originalName,
      mimeType,
      bytes: uploadResult.bytes || null,
      width: uploadResult.width || null,
      height: uploadResult.height || null,
      version: uploadResult.version ? Number(uploadResult.version) : null,
      etag: uploadResult.etag || null,
      secureUrl: uploadResult.secure_url || null,
      status: "UPLOADED",
      uploadExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      uploadedAt: new Date()
    })
    .returning();

  return formatMediaAsset(newAsset);
};

export const cancelMediaAssets = async (userId: string, assetIds: string[]) => {
  if (!assetIds || assetIds.length === 0) {
    return { cancelled_count: 0 };
  }

  const assetsToCancel = await db.query.mediaAssetsTable.findMany({
    where: and(
      eq(mediaAssetsTable.ownerUserId, userId),
      inArray(mediaAssetsTable.id, assetIds),
      inArray(mediaAssetsTable.status, ["UPLOADED", "PENDING"])
    )
  });

  let cancelledCount = 0;
  for (const asset of assetsToCancel) {
    try {
      await cloudinary.uploader.destroy(asset.publicId, {
        resource_type: asset.resourceType || "image"
      });
    } catch (_err) {
      console.error(`Failed to destroy Cloudinary asset: ${asset.publicId}`);
    }

    await db
      .delete(mediaAssetsTable)
      .where(and(eq(mediaAssetsTable.id, asset.id), eq(mediaAssetsTable.ownerUserId, userId)));

    cancelledCount++;
  }

  return { cancelled_count: cancelledCount };
};

export const deleteMediaAssetById = async (userId: string, assetId: string) => {
  const asset = await db.query.mediaAssetsTable.findFirst({
    where: and(
      eq(mediaAssetsTable.id, assetId),
      eq(mediaAssetsTable.ownerUserId, userId),
      isNull(mediaAssetsTable.deletedAt)
    )
  });

  if (!asset) {
    throw ApiError.notFound("Attachment not found.");
  }

  try {
    await cloudinary.uploader.destroy(asset.publicId, {
      resource_type: asset.resourceType || "image"
    });
  } catch (_err) {
    console.error(`Failed to destroy Cloudinary asset: ${asset.publicId}`);
  }

  await db
    .delete(mediaAssetsTable)
    .where(and(eq(mediaAssetsTable.id, assetId), eq(mediaAssetsTable.ownerUserId, userId)));
};

export const getMediaAssetById = async (userId: string, assetId: string) => {
  const asset = await db.query.mediaAssetsTable.findFirst({
    where: and(
      eq(mediaAssetsTable.id, assetId),
      eq(mediaAssetsTable.ownerUserId, userId),
      isNull(mediaAssetsTable.deletedAt)
    )
  });

  if (!asset) {
    throw ApiError.notFound("Attachment not found.");
  }

  return formatMediaAsset(asset);
};

export const updateUserAvatar = async (userId: string, assetId: string) => {
  const asset = await db.query.mediaAssetsTable.findFirst({
    where: and(
      eq(mediaAssetsTable.id, assetId),
      eq(mediaAssetsTable.ownerUserId, userId)
    )
  });

  if (!asset) {
    throw ApiError.notFound("Avatar media asset not found.");
  }

  await db
    .delete(userProfileImagesTable)
    .where(eq(userProfileImagesTable.userId, userId));

  await db.insert(userProfileImagesTable).values({
    userId,
    mediaAssetId: assetId,
    isPrimary: true,
    sortOrder: 0
  });

  await db
    .update(mediaAssetsTable)
    .set({ status: "ATTACHED", updatedAt: new Date() })
    .where(eq(mediaAssetsTable.id, assetId));

  const updatedUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId)
  });

  return {
    avatar_url: asset.secureUrl,
    media_asset: formatMediaAsset(asset)
  };
};
