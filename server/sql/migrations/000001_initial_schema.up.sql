BEGIN;

-- UUID generation and trigram indexes for keyword search.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Keep created_at immutable and update updated_at for every changed row.
CREATE FUNCTION set_row_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.created_at := OLD.created_at;
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) NOT NULL,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Makassar',
    currency_code CHAR(3) NOT NULL DEFAULT 'IDR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_email_not_blank CHECK (BTRIM(email) <> ''),
    CONSTRAINT users_email_trimmed CHECK (email = BTRIM(email)),
    CONSTRAINT users_password_hash_not_blank CHECK (BTRIM(password_hash) <> ''),
    CONSTRAINT users_display_name_not_blank CHECK (BTRIM(display_name) <> ''),
    CONSTRAINT users_timezone_not_blank CHECK (BTRIM(timezone) <> ''),
    CONSTRAINT users_currency_code_format CHECK (currency_code ~ '^[A-Z]{3}$')
);

CREATE UNIQUE INDEX users_email_lower_uidx ON users (LOWER(email));

CREATE TRIGGER users_set_row_timestamps
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

CREATE TABLE auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    device_name VARCHAR(255),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT auth_sessions_user_fk
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT auth_sessions_refresh_token_hash_unique UNIQUE (refresh_token_hash),
    CONSTRAINT auth_sessions_refresh_token_hash_not_blank
        CHECK (BTRIM(refresh_token_hash) <> ''),
    CONSTRAINT auth_sessions_expiry_after_creation CHECK (expires_at > created_at),
    CONSTRAINT auth_sessions_revocation_after_creation
        CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);

CREATE INDEX auth_sessions_active_user_idx
    ON auth_sessions (user_id, expires_at)
    WHERE revoked_at IS NULL;

CREATE TRIGGER auth_sessions_set_row_timestamps
BEFORE UPDATE ON auth_sessions
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(16) NOT NULL,
    institution_name VARCHAR(100),
    opening_balance BIGINT NOT NULL DEFAULT 0,
    color VARCHAR(9),
    icon VARCHAR(64),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT accounts_user_fk
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT accounts_user_id_id_unique UNIQUE (user_id, id),
    CONSTRAINT accounts_name_not_blank CHECK (BTRIM(name) <> ''),
    CONSTRAINT accounts_type_valid CHECK (type IN ('CASH', 'BANK', 'EWALLET')),
    CONSTRAINT accounts_institution_name_not_blank
        CHECK (institution_name IS NULL OR BTRIM(institution_name) <> ''),
    CONSTRAINT accounts_color_format
        CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'),
    CONSTRAINT accounts_icon_not_blank CHECK (icon IS NULL OR BTRIM(icon) <> '')
);

CREATE INDEX accounts_active_user_idx
    ON accounts (user_id, created_at)
    WHERE is_archived = FALSE;

CREATE TRIGGER accounts_set_row_timestamps
BEFORE UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    type VARCHAR(16) NOT NULL,
    amount BIGINT NOT NULL DEFAULT 0,
    source_name VARCHAR(150),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    location_name VARCHAR(255),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(10, 6),
    idempotency_key VARCHAR(255) NOT NULL,
    idempotency_request_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT transactions_user_fk
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT transactions_owned_account_fk
        FOREIGN KEY (user_id, account_id)
        REFERENCES accounts(user_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT transactions_user_id_id_unique UNIQUE (user_id, id),
    CONSTRAINT transactions_user_idempotency_unique UNIQUE (user_id, idempotency_key),
    CONSTRAINT transactions_type_valid CHECK (type IN ('INCOME', 'EXPENSE')),
    CONSTRAINT transactions_amount_non_negative CHECK (amount >= 0),
    CONSTRAINT transactions_income_fields_valid CHECK (
        type <> 'INCOME'
        OR (amount > 0 AND NULLIF(BTRIM(source_name), '') IS NOT NULL)
    ),
    CONSTRAINT transactions_source_name_not_blank
        CHECK (source_name IS NULL OR BTRIM(source_name) <> ''),
    CONSTRAINT transactions_location_name_not_blank
        CHECK (location_name IS NULL OR BTRIM(location_name) <> ''),
    CONSTRAINT transactions_location_pair CHECK (
        (latitude IS NULL AND longitude IS NULL)
        OR (latitude IS NOT NULL AND longitude IS NOT NULL)
    ),
    CONSTRAINT transactions_latitude_range
        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    CONSTRAINT transactions_longitude_range
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
    CONSTRAINT transactions_idempotency_key_not_blank
        CHECK (BTRIM(idempotency_key) <> ''),
    CONSTRAINT transactions_idempotency_hash_format
        CHECK (idempotency_request_hash ~ '^[0-9A-Fa-f]{64}$'),
    CONSTRAINT transactions_deletion_after_creation
        CHECK (deleted_at IS NULL OR deleted_at >= created_at)
);

CREATE INDEX transactions_history_idx
    ON transactions (user_id, occurred_at DESC, id DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX transactions_account_history_idx
    ON transactions (user_id, account_id, occurred_at DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX transactions_type_history_idx
    ON transactions (user_id, type, occurred_at DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX transactions_source_name_search_idx
    ON transactions USING GIN (source_name gin_trgm_ops)
    WHERE deleted_at IS NULL AND source_name IS NOT NULL;

CREATE INDEX transactions_note_search_idx
    ON transactions USING GIN (note gin_trgm_ops)
    WHERE deleted_at IS NULL AND note IS NOT NULL;

CREATE TRIGGER transactions_set_row_timestamps
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

CREATE TABLE expense_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC(14, 3) NOT NULL,
    unit_price BIGINT NOT NULL,
    line_total BIGINT GENERATED ALWAYS AS (
        ROUND(quantity * unit_price)::BIGINT
    ) STORED,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT expense_items_transaction_fk
        FOREIGN KEY (transaction_id)
        REFERENCES transactions(id)
        ON DELETE CASCADE,
    CONSTRAINT expense_items_transaction_sort_unique
        UNIQUE (transaction_id, sort_order)
        DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT expense_items_name_not_blank CHECK (BTRIM(name) <> ''),
    CONSTRAINT expense_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT expense_items_unit_price_non_negative CHECK (unit_price >= 0),
    CONSTRAINT expense_items_sort_order_non_negative CHECK (sort_order >= 0)
);

CREATE INDEX expense_items_name_search_idx
    ON expense_items USING GIN (name gin_trgm_ops);

CREATE TRIGGER expense_items_set_row_timestamps
BEFORE UPDATE ON expense_items
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL,
    provider VARCHAR(20) NOT NULL DEFAULT 'CLOUDINARY',
    provider_asset_id VARCHAR(255),
    public_id VARCHAR(255) NOT NULL,
    resource_type VARCHAR(20) NOT NULL,
    delivery_type VARCHAR(20) NOT NULL,
    format VARCHAR(20),
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    bytes BIGINT,
    width INTEGER,
    height INTEGER,
    version BIGINT,
    etag VARCHAR(255),
    secure_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    upload_expires_at TIMESTAMPTZ NOT NULL,
    uploaded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT media_assets_owner_fk
        FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT media_assets_owner_id_id_unique UNIQUE (owner_user_id, id),
    CONSTRAINT media_assets_public_identity_unique
        UNIQUE (provider, resource_type, delivery_type, public_id),
    CONSTRAINT media_assets_provider_valid CHECK (provider IN ('CLOUDINARY')),
    CONSTRAINT media_assets_provider_asset_id_not_blank
        CHECK (provider_asset_id IS NULL OR BTRIM(provider_asset_id) <> ''),
    CONSTRAINT media_assets_public_id_not_blank CHECK (BTRIM(public_id) <> ''),
    CONSTRAINT media_assets_resource_type_valid
        CHECK (resource_type IN ('image', 'raw')),
    CONSTRAINT media_assets_delivery_type_valid
        CHECK (delivery_type IN ('upload', 'private', 'authenticated')),
    CONSTRAINT media_assets_format_not_blank
        CHECK (format IS NULL OR BTRIM(format) <> ''),
    CONSTRAINT media_assets_original_filename_not_blank
        CHECK (BTRIM(original_filename) <> ''),
    CONSTRAINT media_assets_mime_type_not_blank CHECK (BTRIM(mime_type) <> ''),
    CONSTRAINT media_assets_bytes_range
        CHECK (bytes IS NULL OR bytes BETWEEN 1 AND 10485760),
    CONSTRAINT media_assets_width_positive CHECK (width IS NULL OR width > 0),
    CONSTRAINT media_assets_height_positive CHECK (height IS NULL OR height > 0),
    CONSTRAINT media_assets_version_non_negative CHECK (version IS NULL OR version >= 0),
    CONSTRAINT media_assets_status_valid CHECK (
        status IN (
            'PENDING',
            'UPLOADED',
            'ATTACHED',
            'DELETE_PENDING',
            'DELETED',
            'FAILED'
        )
    ),
    CONSTRAINT media_assets_completed_upload_fields CHECK (
        status NOT IN ('UPLOADED', 'ATTACHED', 'DELETE_PENDING', 'DELETED')
        OR (
            provider_asset_id IS NOT NULL
            AND format IS NOT NULL
            AND bytes IS NOT NULL
            AND uploaded_at IS NOT NULL
        )
    ),
    CONSTRAINT media_assets_uploaded_after_creation
        CHECK (uploaded_at IS NULL OR uploaded_at >= created_at),
    CONSTRAINT media_assets_deleted_state_consistent CHECK (
        (status = 'DELETED' AND deleted_at IS NOT NULL)
        OR (status <> 'DELETED' AND deleted_at IS NULL)
    ),
    CONSTRAINT media_assets_deletion_after_creation
        CHECK (deleted_at IS NULL OR deleted_at >= created_at)
);

CREATE UNIQUE INDEX media_assets_provider_asset_uidx
    ON media_assets (provider, provider_asset_id)
    WHERE provider_asset_id IS NOT NULL;

CREATE INDEX media_assets_owner_active_idx
    ON media_assets (owner_user_id, created_at DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX media_assets_pending_cleanup_idx
    ON media_assets (upload_expires_at)
    WHERE status = 'PENDING';

CREATE TRIGGER media_assets_set_row_timestamps
BEFORE UPDATE ON media_assets
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

CREATE TABLE user_profile_images (
    user_id UUID NOT NULL,
    media_asset_id UUID NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMPTZ,

    CONSTRAINT user_profile_images_pk PRIMARY KEY (user_id, media_asset_id),
    CONSTRAINT user_profile_images_user_fk
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT user_profile_images_owned_media_fk
        FOREIGN KEY (user_id, media_asset_id)
        REFERENCES media_assets(owner_user_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT user_profile_images_media_unique UNIQUE (media_asset_id),
    CONSTRAINT user_profile_images_sort_order_non_negative CHECK (sort_order >= 0),
    CONSTRAINT user_profile_images_removed_not_primary
        CHECK (removed_at IS NULL OR is_primary = FALSE),
    CONSTRAINT user_profile_images_removal_after_creation
        CHECK (removed_at IS NULL OR removed_at >= created_at)
);

CREATE UNIQUE INDEX user_profile_images_one_primary_idx
    ON user_profile_images (user_id)
    WHERE is_primary = TRUE AND removed_at IS NULL;

CREATE UNIQUE INDEX user_profile_images_active_sort_idx
    ON user_profile_images (user_id, sort_order)
    WHERE removed_at IS NULL;

CREATE TRIGGER user_profile_images_set_row_timestamps
BEFORE UPDATE ON user_profile_images
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

CREATE TABLE transaction_attachments (
    user_id UUID NOT NULL,
    transaction_id UUID NOT NULL,
    media_asset_id UUID NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMPTZ,

    CONSTRAINT transaction_attachments_pk
        PRIMARY KEY (transaction_id, media_asset_id),
    CONSTRAINT transaction_attachments_owned_transaction_fk
        FOREIGN KEY (user_id, transaction_id)
        REFERENCES transactions(user_id, id)
        ON DELETE CASCADE,
    CONSTRAINT transaction_attachments_owned_media_fk
        FOREIGN KEY (user_id, media_asset_id)
        REFERENCES media_assets(owner_user_id, id)
        ON DELETE RESTRICT,
    CONSTRAINT transaction_attachments_media_unique UNIQUE (media_asset_id),
    CONSTRAINT transaction_attachments_sort_order_non_negative CHECK (sort_order >= 0),
    CONSTRAINT transaction_attachments_removal_after_creation
        CHECK (removed_at IS NULL OR removed_at >= created_at)
);

CREATE UNIQUE INDEX transaction_attachments_active_sort_idx
    ON transaction_attachments (transaction_id, sort_order)
    WHERE removed_at IS NULL;

CREATE INDEX transaction_attachments_active_transaction_idx
    ON transaction_attachments (transaction_id, created_at)
    WHERE removed_at IS NULL;

CREATE TRIGGER transaction_attachments_set_row_timestamps
BEFORE UPDATE ON transaction_attachments
FOR EACH ROW
EXECUTE FUNCTION set_row_timestamps();

COMMIT;
