BEGIN;

DROP TABLE IF EXISTS transaction_attachments;
DROP TABLE IF EXISTS user_profile_images;
DROP TABLE IF EXISTS expense_items;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS auth_sessions;
DROP TABLE IF EXISTS users;

DROP FUNCTION IF EXISTS set_row_timestamps();

-- pgcrypto and pg_trgm are intentionally retained because extensions may be
-- shared by other schemas in the same database.

COMMIT;
