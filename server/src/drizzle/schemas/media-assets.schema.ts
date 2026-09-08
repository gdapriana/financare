import { pgTable, uuid, varchar, bigint, integer, text, timestamp, unique, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";

export const mediaAssetsTable = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    provider: varchar("provider", { length: 20 }).notNull().default("CLOUDINARY"),
    providerAssetId: varchar("provider_asset_id", { length: 255 }),
    publicId: varchar("public_id", { length: 255 }).notNull(),
    resourceType: varchar("resource_type", { length: 20 }).notNull(),
    deliveryType: varchar("delivery_type", { length: 20 }).notNull(),
    format: varchar("format", { length: 20 }),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    bytes: bigint("bytes", { mode: "number" }),
    width: integer("width"),
    height: integer("height"),
    version: bigint("version", { mode: "number" }),
    etag: varchar("etag", { length: 255 }),
    secureUrl: text("secure_url"),
    status: varchar("status", { length: 20 }).notNull().default("PENDING"),
    uploadExpiresAt: timestamp("upload_expires_at", { withTimezone: true }).notNull(),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
  },
  (table) => [
    unique("media_assets_owner_id_id_unique").on(table.ownerUserId, table.id),
    unique("media_assets_public_identity_unique").on(table.provider, table.resourceType, table.deliveryType, table.publicId),
    index("media_assets_owner_active_idx").on(table.ownerUserId, table.createdAt)
  ]
);

export type MediaAsset = typeof mediaAssetsTable.$inferSelect;
export type NewMediaAsset = typeof mediaAssetsTable.$inferInsert;
