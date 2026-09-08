CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"timezone" varchar(64) DEFAULT 'Asia/Makassar' NOT NULL,
	"currency_code" char(3) DEFAULT 'IDR' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"device_name" varchar(255),
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_sessions_refresh_token_hash_unique" UNIQUE("refresh_token_hash")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(16) NOT NULL,
	"institution_name" varchar(100),
	"opening_balance" bigint DEFAULT 0 NOT NULL,
	"color" varchar(9),
	"icon" varchar(64),
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_user_id_id_unique" UNIQUE("user_id","id")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"type" varchar(16) NOT NULL,
	"amount" bigint DEFAULT 0 NOT NULL,
	"source_name" varchar(150),
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"note" text,
	"location_name" varchar(255),
	"latitude" numeric(9, 6),
	"longitude" numeric(10, 6),
	"idempotency_key" varchar(255) NOT NULL,
	"idempotency_request_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "transactions_user_id_id_unique" UNIQUE("user_id","id"),
	CONSTRAINT "transactions_user_idempotency_unique" UNIQUE("user_id","idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "expense_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"quantity" numeric(14, 3) NOT NULL,
	"unit_price" bigint NOT NULL,
	"line_total" bigint GENERATED ALWAYS AS (ROUND(quantity * unit_price)::BIGINT) STORED,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expense_items_transaction_sort_unique" UNIQUE("transaction_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"provider" varchar(20) DEFAULT 'CLOUDINARY' NOT NULL,
	"provider_asset_id" varchar(255),
	"public_id" varchar(255) NOT NULL,
	"resource_type" varchar(20) NOT NULL,
	"delivery_type" varchar(20) NOT NULL,
	"format" varchar(20),
	"original_filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"bytes" bigint,
	"width" integer,
	"height" integer,
	"version" bigint,
	"etag" varchar(255),
	"secure_url" text,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"upload_expires_at" timestamp with time zone NOT NULL,
	"uploaded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "media_assets_owner_id_id_unique" UNIQUE("owner_user_id","id"),
	CONSTRAINT "media_assets_public_identity_unique" UNIQUE("provider","resource_type","delivery_type","public_id")
);
--> statement-breakpoint
CREATE TABLE "user_profile_images" (
	"user_id" uuid NOT NULL,
	"media_asset_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone,
	CONSTRAINT "user_profile_images_user_id_media_asset_id_pk" PRIMARY KEY("user_id","media_asset_id"),
	CONSTRAINT "user_profile_images_media_asset_id_unique" UNIQUE("media_asset_id")
);
--> statement-breakpoint
CREATE TABLE "transaction_attachments" (
	"user_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"media_asset_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone,
	CONSTRAINT "transaction_attachments_transaction_id_media_asset_id_pk" PRIMARY KEY("transaction_id","media_asset_id"),
	CONSTRAINT "transaction_attachments_media_asset_id_unique" UNIQUE("media_asset_id")
);
--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_account_id_accounts_user_id_id_fk" FOREIGN KEY ("user_id","account_id") REFERENCES "public"."accounts"("user_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_images" ADD CONSTRAINT "user_profile_images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_images" ADD CONSTRAINT "user_profile_images_user_id_media_asset_id_media_assets_owner_user_id_id_fk" FOREIGN KEY ("user_id","media_asset_id") REFERENCES "public"."media_assets"("owner_user_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_user_id_transaction_id_transactions_user_id_id_fk" FOREIGN KEY ("user_id","transaction_id") REFERENCES "public"."transactions"("user_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_user_id_media_asset_id_media_assets_owner_user_id_id_fk" FOREIGN KEY ("user_id","media_asset_id") REFERENCES "public"."media_assets"("owner_user_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_uidx" ON "users" USING btree (LOWER("email"));--> statement-breakpoint
CREATE INDEX "auth_sessions_active_user_idx" ON "auth_sessions" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "accounts_active_user_idx" ON "accounts" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "transactions_history_idx" ON "transactions" USING btree ("user_id","occurred_at","id");--> statement-breakpoint
CREATE INDEX "transactions_account_history_idx" ON "transactions" USING btree ("user_id","account_id","occurred_at");--> statement-breakpoint
CREATE INDEX "transactions_type_history_idx" ON "transactions" USING btree ("user_id","type","occurred_at");--> statement-breakpoint
CREATE INDEX "media_assets_owner_active_idx" ON "media_assets" USING btree ("owner_user_id","created_at");