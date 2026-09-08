import { pgTable, uuid, boolean, integer, timestamp, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { mediaAssetsTable } from "./media-assets.schema";

export const userProfileImagesTable = pgTable(
  "user_profile_images",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    mediaAssetId: uuid("media_asset_id").notNull().unique(),
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    removedAt: timestamp("removed_at", { withTimezone: true })
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.mediaAssetId] }),
    foreignKey({
      columns: [table.userId, table.mediaAssetId],
      foreignColumns: [mediaAssetsTable.ownerUserId, mediaAssetsTable.id],
      name: "user_profile_images_user_id_media_asset_id_media_assets_owner_user_id_id_fk"
    }).onDelete("restrict")
  ]
);

export type UserProfileImage = typeof userProfileImagesTable.$inferSelect;
export type NewUserProfileImage = typeof userProfileImagesTable.$inferInsert;
