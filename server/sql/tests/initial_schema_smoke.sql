\set ON_ERROR_STOP on

BEGIN;

DO $$
DECLARE
    first_user_id UUID;
    second_user_id UUID;
    first_account_id UUID;
    second_account_id UUID;
    expense_id UUID;
    profile_media_id UUID;
    attachment_media_id UUID;
    original_created_at TIMESTAMPTZ;
    generated_total BIGINT;
BEGIN
    INSERT INTO users (email, password_hash, display_name)
    VALUES ('first@example.com', 'argon2id-first', 'First User')
    RETURNING id, created_at INTO first_user_id, original_created_at;

    INSERT INTO users (email, password_hash, display_name)
    VALUES ('second@example.com', 'argon2id-second', 'Second User')
    RETURNING id INTO second_user_id;

    UPDATE users
    SET display_name = 'First User Updated',
        created_at = CURRENT_TIMESTAMP - INTERVAL '1 year'
    WHERE id = first_user_id;

    IF (SELECT created_at FROM users WHERE id = first_user_id) <> original_created_at THEN
        RAISE EXCEPTION 'created_at must remain immutable';
    END IF;

    INSERT INTO accounts (user_id, name, type, opening_balance)
    VALUES (first_user_id, 'Cash', 'CASH', 1000000)
    RETURNING id INTO first_account_id;

    INSERT INTO accounts (user_id, name, type, opening_balance)
    VALUES (second_user_id, 'Second Cash', 'CASH', 500000)
    RETURNING id INTO second_account_id;

    BEGIN
        INSERT INTO transactions (
            user_id,
            account_id,
            type,
            amount,
            idempotency_key,
            idempotency_request_hash
        )
        VALUES (
            first_user_id,
            second_account_id,
            'EXPENSE',
            1000,
            'invalid-cross-owner',
            REPEAT('a', 64)
        );

        RAISE EXCEPTION 'cross-owner account relation should have failed';
    EXCEPTION
        WHEN foreign_key_violation THEN NULL;
    END;

    INSERT INTO transactions (
        user_id,
        account_id,
        type,
        amount,
        occurred_at,
        idempotency_key,
        idempotency_request_hash
    )
    VALUES (
        first_user_id,
        first_account_id,
        'EXPENSE',
        36000,
        CURRENT_TIMESTAMP,
        'expense-smoke-test',
        REPEAT('b', 64)
    )
    RETURNING id INTO expense_id;

    INSERT INTO expense_items (
        transaction_id,
        name,
        quantity,
        unit_price,
        sort_order
    )
    VALUES (expense_id, 'Kopi', 2, 18000, 0);

    SELECT line_total
    INTO generated_total
    FROM expense_items
    WHERE transaction_id = expense_id;

    IF generated_total <> 36000 THEN
        RAISE EXCEPTION 'expected generated total 36000, got %', generated_total;
    END IF;

    INSERT INTO media_assets (
        owner_user_id,
        provider_asset_id,
        public_id,
        resource_type,
        delivery_type,
        format,
        original_filename,
        mime_type,
        bytes,
        width,
        height,
        version,
        secure_url,
        status,
        upload_expires_at,
        uploaded_at
    )
    VALUES (
        first_user_id,
        'cloudinary-profile-asset-id',
        'financare/users/profile-smoke-test',
        'image',
        'upload',
        'jpg',
        'profile.jpg',
        'image/jpeg',
        1024,
        512,
        512,
        1,
        'https://res.cloudinary.com/example/profile.jpg',
        'UPLOADED',
        CURRENT_TIMESTAMP + INTERVAL '15 minutes',
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO profile_media_id;

    BEGIN
        INSERT INTO user_profile_images (
            user_id,
            media_asset_id,
            is_primary,
            sort_order
        )
        VALUES (second_user_id, profile_media_id, TRUE, 0);

        RAISE EXCEPTION 'cross-owner media relation should have failed';
    EXCEPTION
        WHEN foreign_key_violation THEN NULL;
    END;

    INSERT INTO user_profile_images (
        user_id,
        media_asset_id,
        is_primary,
        sort_order
    )
    VALUES (first_user_id, profile_media_id, TRUE, 0);

    INSERT INTO media_assets (
        owner_user_id,
        provider_asset_id,
        public_id,
        resource_type,
        delivery_type,
        format,
        original_filename,
        mime_type,
        bytes,
        width,
        height,
        version,
        secure_url,
        status,
        upload_expires_at,
        uploaded_at
    )
    VALUES (
        first_user_id,
        'cloudinary-attachment-asset-id',
        'financare/attachments/receipt-smoke-test',
        'image',
        'authenticated',
        'png',
        'receipt.png',
        'image/png',
        2048,
        800,
        1200,
        1,
        'https://res.cloudinary.com/example/receipt.png',
        'UPLOADED',
        CURRENT_TIMESTAMP + INTERVAL '15 minutes',
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO attachment_media_id;

    INSERT INTO transaction_attachments (
        user_id,
        transaction_id,
        media_asset_id,
        sort_order
    )
    VALUES (first_user_id, expense_id, attachment_media_id, 0);

    IF (
        SELECT COUNT(*)
        FROM transaction_attachments
        WHERE transaction_id = expense_id
          AND removed_at IS NULL
    ) <> 1 THEN
        RAISE EXCEPTION 'expected one active transaction attachment';
    END IF;
END;
$$;

ROLLBACK;
