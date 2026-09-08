-- FinanCare PostgreSQL Dummy / Seed Data Script
-- Rerun-safe script using ON CONFLICT DO NOTHING / UPDATE

BEGIN;

-- 1. SEED USERS
INSERT INTO users (id, email, password_hash, display_name, role, timezone, currency_code, created_at, updated_at)
VALUES 
    (
        '00000000-0000-4000-a000-000000000001',
        'budi@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$dummyhashbudisantoso',
        'Budi Santoso',
        'ADMIN',
        'Asia/Makassar',
        'IDR',
        CURRENT_TIMESTAMP - INTERVAL '60 days',
        CURRENT_TIMESTAMP - INTERVAL '60 days'
    ),
    (
        '00000000-0000-4000-a000-000000000002',
        'siti@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$dummyhashsitirahma',
        'Siti Rahma',
        'USER',
        'Asia/Jakarta',
        'IDR',
        CURRENT_TIMESTAMP - INTERVAL '45 days',
        CURRENT_TIMESTAMP - INTERVAL '45 days'
    )
ON CONFLICT (id) DO NOTHING;

-- 2. SEED AUTH SESSIONS
INSERT INTO auth_sessions (id, user_id, refresh_token_hash, device_name, expires_at, created_at, updated_at)
VALUES
    (
        '00000000-0000-4000-a010-000000000001',
        '00000000-0000-4000-a000-000000000001',
        'hash_refresh_budi_iphone_15_pro_token_active',
        'iPhone 15 Pro',
        CURRENT_TIMESTAMP + INTERVAL '30 days',
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        CURRENT_TIMESTAMP - INTERVAL '5 days'
    ),
    (
        '00000000-0000-4000-a010-000000000002',
        '00000000-0000-4000-a000-000000000002',
        'hash_refresh_siti_samsung_s24_token_active',
        'Samsung Galaxy S24',
        CURRENT_TIMESTAMP + INTERVAL '30 days',
        CURRENT_TIMESTAMP - INTERVAL '2 days',
        CURRENT_TIMESTAMP - INTERVAL '2 days'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. SEED ACCOUNTS
INSERT INTO accounts (id, user_id, name, type, institution_name, opening_balance, color, icon, is_archived, created_at, updated_at)
VALUES
    -- Budi Accounts
    (
        '00000000-0000-4000-a001-000000000101',
        '00000000-0000-4000-a000-000000000001',
        'Uang Tunai / Cash',
        'CASH',
        NULL,
        500000,
        '#10B981',
        'wallet',
        FALSE,
        CURRENT_TIMESTAMP - INTERVAL '60 days',
        CURRENT_TIMESTAMP - INTERVAL '60 days'
    ),
    (
        '00000000-0000-4000-a001-000000000102',
        '00000000-0000-4000-a000-000000000001',
        'BCA Utama',
        'BANK',
        'BCA',
        12500000,
        '#3B82F6',
        'credit-card',
        FALSE,
        CURRENT_TIMESTAMP - INTERVAL '60 days',
        CURRENT_TIMESTAMP - INTERVAL '60 days'
    ),
    (
        '00000000-0000-4000-a001-000000000103',
        '00000000-0000-4000-a000-000000000001',
        'GoPay',
        'EWALLET',
        'GoPay',
        350000,
        '#F59E0B',
        'smartphone',
        FALSE,
        CURRENT_TIMESTAMP - INTERVAL '60 days',
        CURRENT_TIMESTAMP - INTERVAL '60 days'
    ),
    (
        '00000000-0000-4000-a001-000000000104',
        '00000000-0000-4000-a000-000000000001',
        'Mandiri Tabungan Lama',
        'BANK',
        'Bank Mandiri',
        5000000,
        '#6366F1',
        'building-bank',
        TRUE,
        CURRENT_TIMESTAMP - INTERVAL '60 days',
        CURRENT_TIMESTAMP - INTERVAL '10 days'
    ),

    -- Siti Accounts
    (
        '00000000-0000-4000-a002-000000000201',
        '00000000-0000-4000-a000-000000000002',
        'Cash',
        'CASH',
        NULL,
        250000,
        '#10B981',
        'wallet',
        FALSE,
        CURRENT_TIMESTAMP - INTERVAL '45 days',
        CURRENT_TIMESTAMP - INTERVAL '45 days'
    ),
    (
        '00000000-0000-4000-a002-000000000202',
        '00000000-0000-4000-a000-000000000002',
        'BRI Tabungan',
        'BANK',
        'BRI',
        8000000,
        '#0284C7',
        'credit-card',
        FALSE,
        CURRENT_TIMESTAMP - INTERVAL '45 days',
        CURRENT_TIMESTAMP - INTERVAL '45 days'
    ),
    (
        '00000000-0000-4000-a002-000000000203',
        '00000000-0000-4000-a000-000000000002',
        'ShopeePay',
        'EWALLET',
        'ShopeePay',
        150000,
        '#EF4444',
        'smartphone',
        FALSE,
        CURRENT_TIMESTAMP - INTERVAL '45 days',
        CURRENT_TIMESTAMP - INTERVAL '45 days'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. SEED MEDIA ASSETS (Profile Pictures & Receipt Attachments)
INSERT INTO media_assets (
    id, owner_user_id, provider, provider_asset_id, public_id, resource_type, delivery_type,
    format, original_filename, mime_type, bytes, width, height, version, secure_url, status, upload_expires_at, uploaded_at
)
VALUES
    (
        '00000000-0000-4000-a020-000000000001',
        '00000000-0000-4000-a000-000000000001',
        'CLOUDINARY',
        'cld_asset_budi_avatar_001',
        'financare/users/avatar_budi',
        'image',
        'upload',
        'jpg',
        'budi_profile.jpg',
        'image/jpeg',
        154000,
        400,
        400,
        1,
        'https://res.cloudinary.com/financare/image/upload/v1/financare/users/avatar_budi.jpg',
        'ATTACHED',
        CURRENT_TIMESTAMP + INTERVAL '1 year',
        CURRENT_TIMESTAMP - INTERVAL '50 days'
    ),
    (
        '00000000-0000-4000-a020-000000000002',
        '00000000-0000-4000-a000-000000000001',
        'CLOUDINARY',
        'cld_asset_nota_supermarket_002',
        'financare/attachments/nota_supermarket_002',
        'image',
        'authenticated',
        'png',
        'nota_belanja_supermarket.png',
        'image/png',
        520000,
        800,
        1200,
        1,
        'https://res.cloudinary.com/financare/image/upload/v1/financare/attachments/nota_supermarket_002.png',
        'ATTACHED',
        CURRENT_TIMESTAMP + INTERVAL '1 year',
        CURRENT_TIMESTAMP - INTERVAL '1 day'
    ),
    (
        '00000000-0000-4000-a020-000000000003',
        '00000000-0000-4000-a000-000000000002',
        'CLOUDINARY',
        'cld_asset_siti_avatar_003',
        'financare/users/avatar_siti',
        'image',
        'upload',
        'jpg',
        'siti_profile.jpg',
        'image/jpeg',
        182000,
        400,
        400,
        1,
        'https://res.cloudinary.com/financare/image/upload/v1/financare/users/avatar_siti.jpg',
        'ATTACHED',
        CURRENT_TIMESTAMP + INTERVAL '1 year',
        CURRENT_TIMESTAMP - INTERVAL '40 days'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. SEED USER PROFILE IMAGES
INSERT INTO user_profile_images (user_id, media_asset_id, is_primary, sort_order, created_at, updated_at)
VALUES
    (
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a020-000000000001',
        TRUE,
        0,
        CURRENT_TIMESTAMP - INTERVAL '50 days',
        CURRENT_TIMESTAMP - INTERVAL '50 days'
    ),
    (
        '00000000-0000-4000-a000-000000000002',
        '00000000-0000-4000-a020-000000000003',
        TRUE,
        0,
        CURRENT_TIMESTAMP - INTERVAL '40 days',
        CURRENT_TIMESTAMP - INTERVAL '40 days'
    )
ON CONFLICT (user_id, media_asset_id) DO NOTHING;

-- 6. SEED TRANSACTIONS
-- Budi Transactions (Spread across 30 days for monthly calendar display testing)
INSERT INTO transactions (
    id, user_id, account_id, type, amount, source_name, occurred_at, note,
    location_name, latitude, longitude, idempotency_key, idempotency_request_hash, created_at, updated_at, deleted_at
)
VALUES
    -- Tx 1 (Today): EXPENSE Rp 65.000 (Cash)
    (
        '00000000-0000-4000-a003-000000000001',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000101',
        'EXPENSE',
        65000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '2 hours',
        'Makan siang dan kopi di warung',
        'Warung Makan Pak Edi',
        -8.650000,
        115.220000,
        'seed-tx-budi-001',
        '1111111111111111111111111111111111111111111111111111111111111111',
        CURRENT_TIMESTAMP - INTERVAL '2 hours',
        CURRENT_TIMESTAMP - INTERVAL '2 hours',
        NULL
    ),
    -- Tx 2 (Yesterday): EXPENSE Rp 350.000 (BCA) - Has receipt attachment
    (
        '00000000-0000-4000-a003-000000000002',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000102',
        'EXPENSE',
        350000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        'Belanja kebutuhan dapur mingguan',
        'Supermarket Tip Top',
        -6.210000,
        106.850000,
        'seed-tx-budi-002',
        '2222222222222222222222222222222222222222222222222222222222222222',
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        NULL
    ),
    -- Tx 3 (-3 days): INCOME Rp 3.500.000 (BCA) -> Green Day
    (
        '00000000-0000-4000-a003-000000000003',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000102',
        'INCOME',
        3500000,
        'Project Freelance Web App',
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        'Pembayaran termin pertama aplikasi e-commerce',
        NULL,
        NULL,
        NULL,
        'seed-tx-budi-003',
        '3333333333333333333333333333333333333333333333333333333333333333',
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        NULL
    ),
    -- Tx 4 (-5 days): EXPENSE Rp 150.000 (GoPay) -> Red Day
    (
        '00000000-0000-4000-a003-000000000004',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000103',
        'EXPENSE',
        150000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        'Isi bensin Pertamax Turbo & Parkir',
        'SPBU Pertamina Sudirman',
        -6.208800,
        106.845600,
        'seed-tx-budi-004',
        '4444444444444444444444444444444444444444444444444444444444444444',
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        NULL
    ),
    -- Tx 5 (-7 days): EXPENSE Rp 280.000 (BCA) -> Red Day
    (
        '00000000-0000-4000-a003-000000000005',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000102',
        'EXPENSE',
        280000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '7 days',
        'Makan malam bersama keluarga',
        'Resto Bebek Tepi Sawah',
        -6.225000,
        106.808000,
        'seed-tx-budi-005',
        '5555555555555555555555555555555555555555555555555555555555555555',
        CURRENT_TIMESTAMP - INTERVAL '7 days',
        CURRENT_TIMESTAMP - INTERVAL '7 days',
        NULL
    ),
    -- Tx 6 (-10 days): EXPENSE Rp 450.000 (GoPay) -> Red Day
    (
        '00000000-0000-4000-a003-000000000006',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000103',
        'EXPENSE',
        450000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        'Aksesori laptop dan mouse wireless',
        'Tokopedia Official Store',
        NULL,
        NULL,
        NULL,
        'seed-tx-budi-006',
        '6666666666666666666666666666666666666666666666666666666666666666',
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        NULL
    ),
    -- Tx 7 (-12 days): INCOME Rp 200.000 (GoPay) -> Green Day
    (
        '00000000-0000-4000-a003-000000000007',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000103',
        'INCOME',
        200000,
        'Cashback Promo Tokopedia',
        CURRENT_TIMESTAMP - INTERVAL '12 days',
        'Bonus cashback transaksi belanja',
        NULL,
        NULL,
        NULL,
        'seed-tx-budi-007',
        '7777777777777777777777777777777777777777777777777777777777777777',
        CURRENT_TIMESTAMP - INTERVAL '12 days',
        CURRENT_TIMESTAMP - INTERVAL '12 days',
        NULL
    ),
    -- Tx 8 (-15 days): EXPENSE Rp 750.000 (BCA) -> Red Day
    (
        '00000000-0000-4000-a003-000000000008',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000102',
        'EXPENSE',
        750000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '15 days',
        'Pembayaran tagihan rutin bulanan',
        NULL,
        NULL,
        NULL,
        'seed-tx-budi-008',
        '8888888888888888888888888888888888888888888888888888888888888888',
        CURRENT_TIMESTAMP - INTERVAL '15 days',
        CURRENT_TIMESTAMP - INTERVAL '15 days',
        NULL
    ),
    -- Tx 9 (-20 days): EXPENSE Rp 600.000 (BCA) -> Red Day
    (
        '00000000-0000-4000-a003-000000000009',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000102',
        'EXPENSE',
        600000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '20 days',
        'Belanja pakaian kerja',
        'Uniqlo Grand Indonesia',
        -6.195000,
        106.820000,
        'seed-tx-budi-009',
        '9999999999999999999999999999999999999999999999999999999999999999',
        CURRENT_TIMESTAMP - INTERVAL '20 days',
        CURRENT_TIMESTAMP - INTERVAL '20 days',
        NULL
    ),
    -- Tx 10 (-25 days): INCOME Rp 15.000.000 (BCA) -> Green Day
    (
        '00000000-0000-4000-a003-000000000010',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000102',
        'INCOME',
        15000000,
        'Gaji Utama PT Teknologi Nusa',
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        'Gaji bulanan periode Agustus',
        NULL,
        NULL,
        NULL,
        'seed-tx-budi-010',
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        NULL
    ),
    -- Tx 11 (-25 days): EXPENSE Rp 500.000 (BCA) -> (Same day as Gaji, Income 15M > Expense 500k -> Green Day overall)
    (
        '00000000-0000-4000-a003-000000000011',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000102',
        'EXPENSE',
        500000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        'Zakat maal dan sedekah bulanan',
        'BAZNAS Pusat',
        NULL,
        NULL,
        NULL,
        'seed-tx-budi-011',
        'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        NULL
    ),
    -- Tx 12 (-27 days): EXPENSE Rp 400.000 (Cash) -> Red Day
    (
        '00000000-0000-4000-a003-000000000012',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000101',
        'EXPENSE',
        400000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '27 days',
        'Servis berkala kendaraan motor',
        'Bengkel AHASS Utama',
        -8.655000,
        115.225000,
        'seed-tx-budi-012',
        'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        CURRENT_TIMESTAMP - INTERVAL '27 days',
        CURRENT_TIMESTAMP - INTERVAL '27 days',
        NULL
    ),
    -- Tx 13 (-29 days): EXPENSE Rp 50.000 (Soft Deleted Test Tx)
    (
        '00000000-0000-4000-a003-000000000013',
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a001-000000000101',
        'EXPENSE',
        50000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '29 days',
        'Salah catat pengeluaran (dihapus)',
        NULL,
        NULL,
        NULL,
        'seed-tx-budi-013',
        'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
        CURRENT_TIMESTAMP - INTERVAL '29 days',
        CURRENT_TIMESTAMP - INTERVAL '28 days',
        CURRENT_TIMESTAMP - INTERVAL '28 days'
    ),

    -- Siti Transactions
    -- Tx 14 (-2 days): INCOME Rp 8.000.000 (Siti BRI) -> Green Day
    (
        '00000000-0000-4000-a003-000000000014',
        '00000000-0000-4000-a000-000000000002',
        '00000000-0000-4000-a002-000000000202',
        'INCOME',
        8000000,
        'Gaji Bulanan PT Sejahtera',
        CURRENT_TIMESTAMP - INTERVAL '2 days',
        'Gaji bulanan',
        NULL,
        NULL,
        NULL,
        'seed-tx-siti-001',
        'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        CURRENT_TIMESTAMP - INTERVAL '2 days',
        CURRENT_TIMESTAMP - INTERVAL '2 days',
        NULL
    ),
    -- Tx 15 (-1 day): EXPENSE Rp 250.000 (Siti ShopeePay) -> Red Day
    (
        '00000000-0000-4000-a003-000000000015',
        '00000000-0000-4000-a000-000000000002',
        '00000000-0000-4000-a002-000000000203',
        'EXPENSE',
        250000,
        NULL,
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        'Belanja online skincare',
        'Shopee Mall',
        NULL,
        NULL,
        NULL,
        'seed-tx-siti-002',
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        NULL
    )
ON CONFLICT (id) DO NOTHING;

-- 7. SEED TRANSACTION ATTACHMENTS
INSERT INTO transaction_attachments (user_id, transaction_id, media_asset_id, sort_order, created_at, updated_at)
VALUES
    (
        '00000000-0000-4000-a000-000000000001',
        '00000000-0000-4000-a003-000000000002',
        '00000000-0000-4000-a020-000000000002',
        0,
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        CURRENT_TIMESTAMP - INTERVAL '1 day'
    )
ON CONFLICT (transaction_id, media_asset_id) DO NOTHING;

-- 8. SEED EXPENSE ITEMS
-- Line totals are automatically computed as ROUND(quantity * unit_price)
INSERT INTO expense_items (id, transaction_id, name, quantity, unit_price, sort_order, created_at, updated_at)
VALUES
    -- Tx 1 Items (Total = 35000 + 10000 + 20000 = 65.000)
    ('00000000-0000-4000-a004-000000000001', '00000000-0000-4000-a003-000000000001', 'Nasi Goreng Special', 1, 35000, 0, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    ('00000000-0000-4000-a004-000000000002', '00000000-0000-4000-a003-000000000001', 'Es Teh Manis', 2, 5000, 1, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    ('00000000-0000-4000-a004-000000000003', '00000000-0000-4000-a003-000000000001', 'Kopi Susu Panas', 1, 20000, 2, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

    -- Tx 2 Items (Total = 70000 + 75000 + 60000 + 75000 + 70000 = 350.000)
    ('00000000-0000-4000-a004-000000000004', '00000000-0000-4000-a003-000000000002', 'Minyak Goreng 2L', 2, 35000, 0, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('00000000-0000-4000-a004-000000000005', '00000000-0000-4000-a003-000000000002', 'Beras Premium 5kg', 1, 75000, 1, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('00000000-0000-4000-a004-000000000006', '00000000-0000-4000-a003-000000000002', 'Telur Ayam 1kg', 2, 30000, 2, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('00000000-0000-4000-a004-000000000007', '00000000-0000-4000-a003-000000000002', 'Daging Sapi 500g', 1, 75000, 3, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('00000000-0000-4000-a004-000000000008', '00000000-0000-4000-a003-000000000002', 'Buah Apel Fuji 1kg', 1, 70000, 4, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),

    -- Tx 4 Items (Total = 140000 + 10000 = 150.000)
    ('00000000-0000-4000-a004-000000000009', '00000000-0000-4000-a003-000000000004', 'Pertamax Turbo 10L', 1, 140000, 0, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    ('00000000-0000-4000-a004-000000000010', '00000000-0000-4000-a003-000000000004', 'Parkir Gedung', 1, 10000, 1, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),

    -- Tx 5 Items (Total = 180000 + 100000 = 280.000)
    ('00000000-0000-4000-a004-000000000011', '00000000-0000-4000-a003-000000000005', 'Bebek Goreng Utuh Paket', 1, 180000, 0, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
    ('00000000-0000-4000-a004-000000000012', '00000000-0000-4000-a003-000000000005', 'Es Jeruk', 4, 25000, 1, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),

    -- Tx 6 Items (Total = 250000 + 200000 = 450.000)
    ('00000000-0000-4000-a004-000000000013', '00000000-0000-4000-a003-000000000006', 'Mouse Wireless Silent Click', 1, 250000, 0, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),
    ('00000000-0000-4000-a004-000000000014', '00000000-0000-4000-a003-000000000006', 'Mousepad Extended Desk Mat', 1, 200000, 1, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),

    -- Tx 8 Items (Total = 450000 + 300000 = 750.000)
    ('00000000-0000-4000-a004-000000000015', '00000000-0000-4000-a003-000000000008', 'Tagihan PLN Listrik Rumah', 1, 450000, 0, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
    ('00000000-0000-4000-a004-000000000016', '00000000-0000-4000-a003-000000000008', 'Tagihan IndiHome Internet 50Mbps', 1, 300000, 1, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),

    -- Tx 9 Items (Total = 400000 + 200000 = 600.000)
    ('00000000-0000-4000-a004-000000000017', '00000000-0000-4000-a003-000000000009', 'Kemeja Formal Oxford', 2, 200000, 0, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),
    ('00000000-0000-4000-a004-000000000018', '00000000-0000-4000-a003-000000000009', 'Celana Chino Slim Fit', 1, 200000, 1, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),

    -- Tx 11 Items (Total = 500.000)
    ('00000000-0000-4000-a004-000000000019', '00000000-0000-4000-a003-000000000011', 'Donasi & Zakat Maal BAZNAS', 1, 500000, 0, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),

    -- Tx 12 Items (Total = 300000 + 100000 = 400.000)
    ('00000000-0000-4000-a004-000000000020', '00000000-0000-4000-a003-000000000012', 'Oli Mesin Synth 4L', 1, 300000, 0, CURRENT_TIMESTAMP - INTERVAL '27 days', CURRENT_TIMESTAMP - INTERVAL '27 days'),
    ('00000000-0000-4000-a004-000000000021', '00000000-0000-4000-a003-000000000012', 'Jasa Tune Up & Servis', 1, 100000, 1, CURRENT_TIMESTAMP - INTERVAL '27 days', CURRENT_TIMESTAMP - INTERVAL '27 days'),

    -- Tx 13 Items (Deleted Tx item = 50.000)
    ('00000000-0000-4000-a004-000000000022', '00000000-0000-4000-a003-000000000013', 'Salah Input Barang', 1, 50000, 0, CURRENT_TIMESTAMP - INTERVAL '29 days', CURRENT_TIMESTAMP - INTERVAL '28 days'),

    -- Tx 15 Items (Siti EXPENSE Total = 250.000)
    ('00000000-0000-4000-a004-000000000023', '00000000-0000-4000-a003-000000000015', 'Sunscreen Gel SPF50', 1, 150000, 0, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('00000000-0000-4000-a004-000000000024', '00000000-0000-4000-a003-000000000015', 'Facial Wash Hydrating', 1, 100000, 1, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

COMMIT;
