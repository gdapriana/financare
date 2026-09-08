import { sql } from "drizzle-orm";
import db from "../configs/db";
import {
  usersTable,
  authSessionsTable,
  accountsTable,
  mediaAssetsTable,
  userProfileImagesTable,
  transactionsTable,
  transactionAttachmentsTable,
  expenseItemsTable
} from "./index";

async function seed() {
  console.log("🌱 Starting FinanCare Drizzle seeding...");

  console.log("🧹 Clearing existing database data...");
  await db.execute(
    sql`TRUNCATE TABLE transaction_attachments, user_profile_images, expense_items, transactions, media_assets, accounts, auth_sessions, users RESTART IDENTITY CASCADE;`
  );

  const now = new Date();
  const daysAgo = (days: number, hours = 0) =>
    new Date(now.getTime() - (days * 24 + hours) * 60 * 60 * 1000);
  const daysInFuture = (days: number) =>
    new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  console.log("👤 Seeding users...");
  const [budi, siti] = await db
    .insert(usersTable)
    .values([
      {
        id: "00000000-0000-4000-a000-000000000001",
        email: "budi@example.com",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$dummyhashbudisantoso",
        displayName: "Budi Santoso",
        role: "ADMIN",
        timezone: "Asia/Makassar",
        currencyCode: "IDR",
        createdAt: daysAgo(60),
        updatedAt: daysAgo(60)
      },
      {
        id: "00000000-0000-4000-a000-000000000002",
        email: "siti@example.com",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$dummyhashsitirahma",
        displayName: "Siti Rahma",
        role: "USER",
        timezone: "Asia/Jakarta",
        currencyCode: "IDR",
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45)
      }
    ])
    .returning();

  const budiId = budi?.id || "00000000-0000-4000-a000-000000000001";
  const sitiId = siti?.id || "00000000-0000-4000-a000-000000000002";

  console.log("🔑 Seeding auth sessions...");
  await db
    .insert(authSessionsTable)
    .values([
      {
        id: "00000000-0000-4000-a010-000000000001",
        userId: budiId,
        refreshTokenHash: "hash_refresh_budi_iphone_15_pro_token_active",
        deviceName: "iPhone 15 Pro",
        expiresAt: daysInFuture(30),
        createdAt: daysAgo(5),
        updatedAt: daysAgo(5)
      },
      {
        id: "00000000-0000-4000-a010-000000000002",
        userId: sitiId,
        refreshTokenHash: "hash_refresh_siti_samsung_s24_token_active",
        deviceName: "Samsung Galaxy S24",
        expiresAt: daysInFuture(30),
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2)
      }
    ]);

  console.log("💳 Seeding accounts...");
  await db
    .insert(accountsTable)
    .values([
      {
        id: "00000000-0000-4000-a001-000000000101",
        userId: budiId,
        name: "Uang Tunai / Cash",
        type: "CASH",
        institutionName: null,
        openingBalance: 500000,
        color: "#10B981",
        icon: "wallet",
        isArchived: false,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(60)
      },
      {
        id: "00000000-0000-4000-a001-000000000102",
        userId: budiId,
        name: "BCA Utama",
        type: "BANK",
        institutionName: "BCA",
        openingBalance: 12500000,
        color: "#3B82F6",
        icon: "credit-card",
        isArchived: false,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(60)
      },
      {
        id: "00000000-0000-4000-a001-000000000103",
        userId: budiId,
        name: "GoPay",
        type: "EWALLET",
        institutionName: "GoPay",
        openingBalance: 350000,
        color: "#F59E0B",
        icon: "smartphone",
        isArchived: false,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(60)
      },
      {
        id: "00000000-0000-4000-a001-000000000104",
        userId: budiId,
        name: "Mandiri Tabungan Lama",
        type: "BANK",
        institutionName: "Bank Mandiri",
        openingBalance: 5000000,
        color: "#6366F1",
        icon: "building-bank",
        isArchived: true,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(10)
      },

      {
        id: "00000000-0000-4000-a002-000000000201",
        userId: sitiId,
        name: "Cash",
        type: "CASH",
        institutionName: null,
        openingBalance: 250000,
        color: "#10B981",
        icon: "wallet",
        isArchived: false,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45)
      },
      {
        id: "00000000-0000-4000-a002-000000000202",
        userId: sitiId,
        name: "BRI Tabungan",
        type: "BANK",
        institutionName: "BRI",
        openingBalance: 8000000,
        color: "#0284C7",
        icon: "credit-card",
        isArchived: false,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45)
      },
      {
        id: "00000000-0000-4000-a002-000000000203",
        userId: sitiId,
        name: "ShopeePay",
        type: "EWALLET",
        institutionName: "ShopeePay",
        openingBalance: 150000,
        color: "#EF4444",
        icon: "smartphone",
        isArchived: false,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45)
      }
    ]);

  console.log("🖼️ Seeding media assets...");
  await db
    .insert(mediaAssetsTable)
    .values([
      {
        id: "00000000-0000-4000-a020-000000000001",
        ownerUserId: budiId,
        provider: "CLOUDINARY",
        providerAssetId: "cld_asset_budi_avatar_001",
        publicId: "financare/users/avatar_budi",
        resourceType: "image",
        deliveryType: "upload",
        format: "jpg",
        originalFilename: "budi_profile.jpg",
        mimeType: "image/jpeg",
        bytes: 154000,
        width: 400,
        height: 400,
        version: 1,
        secureUrl: "https://res.cloudinary.com/financare/image/upload/v1/financare/users/avatar_budi.jpg",
        status: "ATTACHED",
        uploadExpiresAt: daysInFuture(365),
        uploadedAt: daysAgo(50),
        createdAt: daysAgo(50),
        updatedAt: daysAgo(50)
      },
      {
        id: "00000000-0000-4000-a020-000000000002",
        ownerUserId: budiId,
        provider: "CLOUDINARY",
        providerAssetId: "cld_asset_nota_supermarket_002",
        publicId: "financare/attachments/nota_supermarket_002",
        resourceType: "image",
        deliveryType: "authenticated",
        format: "png",
        originalFilename: "nota_belanja_supermarket.png",
        mimeType: "image/png",
        bytes: 520000,
        width: 800,
        height: 1200,
        version: 1,
        secureUrl: "https://res.cloudinary.com/financare/image/upload/v1/financare/attachments/nota_supermarket_002.png",
        status: "ATTACHED",
        uploadExpiresAt: daysInFuture(365),
        uploadedAt: daysAgo(1),
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a020-000000000003",
        ownerUserId: sitiId,
        provider: "CLOUDINARY",
        providerAssetId: "cld_asset_siti_avatar_003",
        publicId: "financare/users/avatar_siti",
        resourceType: "image",
        deliveryType: "upload",
        format: "jpg",
        originalFilename: "siti_profile.jpg",
        mimeType: "image/jpeg",
        bytes: 182000,
        width: 400,
        height: 400,
        version: 1,
        secureUrl: "https://res.cloudinary.com/financare/image/upload/v1/financare/users/avatar_siti.jpg",
        status: "ATTACHED",
        uploadExpiresAt: daysInFuture(365),
        uploadedAt: daysAgo(40),
        createdAt: daysAgo(40),
        updatedAt: daysAgo(40)
      }
    ]);

  console.log("👤 Seeding profile images...");
  await db
    .insert(userProfileImagesTable)
    .values([
      {
        userId: budiId,
        mediaAssetId: "00000000-0000-4000-a020-000000000001",
        isPrimary: true,
        sortOrder: 0,
        createdAt: daysAgo(50),
        updatedAt: daysAgo(50)
      },
      {
        userId: sitiId,
        mediaAssetId: "00000000-0000-4000-a020-000000000003",
        isPrimary: true,
        sortOrder: 0,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(40)
      }
    ]);

  console.log("💸 Seeding transactions...");
  await db
    .insert(transactionsTable)
    .values([
      {
        id: "00000000-0000-4000-a003-000000000001",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000101",
        type: "EXPENSE",
        amount: 65000,
        sourceName: null,
        occurredAt: daysAgo(0, 2),
        note: "Makan siang dan kopi di warung",
        locationName: "Warung Makan Pak Edi",
        latitude: "-8.650000",
        longitude: "115.220000",
        idempotencyKey: "seed-tx-budi-001",
        idempotencyRequestHash: "1111111111111111111111111111111111111111111111111111111111111111",
        createdAt: daysAgo(0, 2),
        updatedAt: daysAgo(0, 2)
      },
      {
        id: "00000000-0000-4000-a003-000000000002",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000102",
        type: "EXPENSE",
        amount: 350000,
        sourceName: null,
        occurredAt: daysAgo(1),
        note: "Belanja kebutuhan dapur mingguan",
        locationName: "Supermarket Tip Top",
        latitude: "-6.210000",
        longitude: "106.850000",
        idempotencyKey: "seed-tx-budi-002",
        idempotencyRequestHash: "2222222222222222222222222222222222222222222222222222222222222222",
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a003-000000000003",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000102",
        type: "INCOME",
        amount: 3500000,
        sourceName: "Project Freelance Web App",
        occurredAt: daysAgo(3),
        note: "Pembayaran termin pertama aplikasi e-commerce",
        locationName: null,
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-budi-003",
        idempotencyRequestHash: "3333333333333333333333333333333333333333333333333333333333333333",
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3)
      },
      {
        id: "00000000-0000-4000-a003-000000000004",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000103",
        type: "EXPENSE",
        amount: 150000,
        sourceName: null,
        occurredAt: daysAgo(5),
        note: "Isi bensin Pertamax Turbo & Parkir",
        locationName: "SPBU Pertamina Sudirman",
        latitude: "-6.208800",
        longitude: "106.845600",
        idempotencyKey: "seed-tx-budi-004",
        idempotencyRequestHash: "4444444444444444444444444444444444444444444444444444444444444444",
        createdAt: daysAgo(5),
        updatedAt: daysAgo(5)
      },
      {
        id: "00000000-0000-4000-a003-000000000005",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000102",
        type: "EXPENSE",
        amount: 280000,
        sourceName: null,
        occurredAt: daysAgo(7),
        note: "Makan malam bersama keluarga",
        locationName: "Resto Bebek Tepi Sawah",
        latitude: "-6.225000",
        longitude: "106.808000",
        idempotencyKey: "seed-tx-budi-005",
        idempotencyRequestHash: "5555555555555555555555555555555555555555555555555555555555555555",
        createdAt: daysAgo(7),
        updatedAt: daysAgo(7)
      },
      {
        id: "00000000-0000-4000-a003-000000000006",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000103",
        type: "EXPENSE",
        amount: 450000,
        sourceName: null,
        occurredAt: daysAgo(10),
        note: "Aksesori laptop dan mouse wireless",
        locationName: "Tokopedia Official Store",
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-budi-006",
        idempotencyRequestHash: "6666666666666666666666666666666666666666666666666666666666666666",
        createdAt: daysAgo(10),
        updatedAt: daysAgo(10)
      },
      {
        id: "00000000-0000-4000-a003-000000000007",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000103",
        type: "INCOME",
        amount: 200000,
        sourceName: "Cashback Promo Tokopedia",
        occurredAt: daysAgo(12),
        note: "Bonus cashback transaksi belanja",
        locationName: null,
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-budi-007",
        idempotencyRequestHash: "7777777777777777777777777777777777777777777777777777777777777777",
        createdAt: daysAgo(12),
        updatedAt: daysAgo(12)
      },
      {
        id: "00000000-0000-4000-a003-000000000008",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000102",
        type: "EXPENSE",
        amount: 750000,
        sourceName: null,
        occurredAt: daysAgo(15),
        note: "Pembayaran tagihan rutin bulanan",
        locationName: null,
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-budi-008",
        idempotencyRequestHash: "8888888888888888888888888888888888888888888888888888888888888888",
        createdAt: daysAgo(15),
        updatedAt: daysAgo(15)
      },
      {
        id: "00000000-0000-4000-a003-000000000009",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000102",
        type: "EXPENSE",
        amount: 600000,
        sourceName: null,
        occurredAt: daysAgo(20),
        note: "Belanja pakaian kerja",
        locationName: "Uniqlo Grand Indonesia",
        latitude: "-6.195000",
        longitude: "106.820000",
        idempotencyKey: "seed-tx-budi-009",
        idempotencyRequestHash: "9999999999999999999999999999999999999999999999999999999999999999",
        createdAt: daysAgo(20),
        updatedAt: daysAgo(20)
      },
      {
        id: "00000000-0000-4000-a003-000000000010",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000102",
        type: "INCOME",
        amount: 15000000,
        sourceName: "Gaji Utama PT Teknologi Nusa",
        occurredAt: daysAgo(25),
        note: "Gaji bulanan",
        locationName: null,
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-budi-010",
        idempotencyRequestHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25)
      },
      {
        id: "00000000-0000-4000-a003-000000000011",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000102",
        type: "EXPENSE",
        amount: 500000,
        sourceName: null,
        occurredAt: daysAgo(25),
        note: "Zakat maal dan sedekah bulanan",
        locationName: "BAZNAS Pusat",
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-budi-011",
        idempotencyRequestHash: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25)
      },
      {
        id: "00000000-0000-4000-a003-000000000012",
        userId: budiId,
        accountId: "00000000-0000-4000-a001-000000000101",
        type: "EXPENSE",
        amount: 400000,
        sourceName: null,
        occurredAt: daysAgo(27),
        note: "Servis berkala kendaraan motor",
        locationName: "Bengkel AHASS Utama",
        latitude: "-8.655000",
        longitude: "115.225000",
        idempotencyKey: "seed-tx-budi-012",
        idempotencyRequestHash: "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
        createdAt: daysAgo(27),
        updatedAt: daysAgo(27)
      },
      {
        id: "00000000-0000-4000-a003-000000000014",
        userId: sitiId,
        accountId: "00000000-0000-4000-a002-000000000202",
        type: "INCOME",
        amount: 8000000,
        sourceName: "Gaji Bulanan PT Sejahtera",
        occurredAt: daysAgo(2),
        note: "Gaji bulanan",
        locationName: null,
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-siti-001",
        idempotencyRequestHash: "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2)
      },
      {
        id: "00000000-0000-4000-a003-000000000015",
        userId: sitiId,
        accountId: "00000000-0000-4000-a002-000000000203",
        type: "EXPENSE",
        amount: 250000,
        sourceName: null,
        occurredAt: daysAgo(1),
        note: "Belanja online skincare",
        locationName: "Shopee Mall",
        latitude: null,
        longitude: null,
        idempotencyKey: "seed-tx-siti-002",
        idempotencyRequestHash: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      }
    ]);

  console.log("📎 Seeding transaction attachments...");
  await db
    .insert(transactionAttachmentsTable)
    .values([
      {
        userId: budiId,
        transactionId: "00000000-0000-4000-a003-000000000002",
        mediaAssetId: "00000000-0000-4000-a020-000000000002",
        sortOrder: 0,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      }
    ]);

  console.log("🛒 Seeding expense items...");
  await db
    .insert(expenseItemsTable)
    .values([
      {
        id: "00000000-0000-4000-a004-000000000001",
        transactionId: "00000000-0000-4000-a003-000000000001",
        name: "Nasi Goreng Special",
        quantity: "1",
        unitPrice: 35000,
        sortOrder: 0,
        createdAt: daysAgo(0, 2),
        updatedAt: daysAgo(0, 2)
      },
      {
        id: "00000000-0000-4000-a004-000000000002",
        transactionId: "00000000-0000-4000-a003-000000000001",
        name: "Es Teh Manis",
        quantity: "2",
        unitPrice: 5000,
        sortOrder: 1,
        createdAt: daysAgo(0, 2),
        updatedAt: daysAgo(0, 2)
      },
      {
        id: "00000000-0000-4000-a004-000000000003",
        transactionId: "00000000-0000-4000-a003-000000000001",
        name: "Kopi Susu Panas",
        quantity: "1",
        unitPrice: 20000,
        sortOrder: 2,
        createdAt: daysAgo(0, 2),
        updatedAt: daysAgo(0, 2)
      },
      {
        id: "00000000-0000-4000-a004-000000000004",
        transactionId: "00000000-0000-4000-a003-000000000002",
        name: "Minyak Goreng 2L",
        quantity: "2",
        unitPrice: 35000,
        sortOrder: 0,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a004-000000000005",
        transactionId: "00000000-0000-4000-a003-000000000002",
        name: "Beras Premium 5kg",
        quantity: "1",
        unitPrice: 75000,
        sortOrder: 1,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a004-000000000006",
        transactionId: "00000000-0000-4000-a003-000000000002",
        name: "Telur Ayam 1kg",
        quantity: "2",
        unitPrice: 30000,
        sortOrder: 2,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a004-000000000007",
        transactionId: "00000000-0000-4000-a003-000000000002",
        name: "Daging Sapi 500g",
        quantity: "1",
        unitPrice: 75000,
        sortOrder: 3,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a004-000000000008",
        transactionId: "00000000-0000-4000-a003-000000000002",
        name: "Buah Apel Fuji 1kg",
        quantity: "1",
        unitPrice: 70000,
        sortOrder: 4,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a004-000000000009",
        transactionId: "00000000-0000-4000-a003-000000000004",
        name: "Pertamax Turbo 10L",
        quantity: "1",
        unitPrice: 140000,
        sortOrder: 0,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(5)
      },
      {
        id: "00000000-0000-4000-a004-000000000010",
        transactionId: "00000000-0000-4000-a003-000000000004",
        name: "Parkir Gedung",
        quantity: "1",
        unitPrice: 10000,
        sortOrder: 1,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(5)
      },
      {
        id: "00000000-0000-4000-a004-000000000011",
        transactionId: "00000000-0000-4000-a003-000000000005",
        name: "Bebek Goreng Utuh Paket",
        quantity: "1",
        unitPrice: 180000,
        sortOrder: 0,
        createdAt: daysAgo(7),
        updatedAt: daysAgo(7)
      },
      {
        id: "00000000-0000-4000-a004-000000000012",
        transactionId: "00000000-0000-4000-a003-000000000005",
        name: "Es Jeruk",
        quantity: "4",
        unitPrice: 25000,
        sortOrder: 1,
        createdAt: daysAgo(7),
        updatedAt: daysAgo(7)
      },
      {
        id: "00000000-0000-4000-a004-000000000013",
        transactionId: "00000000-0000-4000-a003-000000000006",
        name: "Mouse Wireless Silent Click",
        quantity: "1",
        unitPrice: 250000,
        sortOrder: 0,
        createdAt: daysAgo(10),
        updatedAt: daysAgo(10)
      },
      {
        id: "00000000-0000-4000-a004-000000000014",
        transactionId: "00000000-0000-4000-a003-000000000006",
        name: "Mousepad Extended Desk Mat",
        quantity: "1",
        unitPrice: 200000,
        sortOrder: 1,
        createdAt: daysAgo(10),
        updatedAt: daysAgo(10)
      },
      {
        id: "00000000-0000-4000-a004-000000000015",
        transactionId: "00000000-0000-4000-a003-000000000008",
        name: "Tagihan PLN Listrik Rumah",
        quantity: "1",
        unitPrice: 450000,
        sortOrder: 0,
        createdAt: daysAgo(15),
        updatedAt: daysAgo(15)
      },
      {
        id: "00000000-0000-4000-a004-000000000016",
        transactionId: "00000000-0000-4000-a003-000000000008",
        name: "Tagihan IndiHome Internet 50Mbps",
        quantity: "1",
        unitPrice: 300000,
        sortOrder: 1,
        createdAt: daysAgo(15),
        updatedAt: daysAgo(15)
      },
      {
        id: "00000000-0000-4000-a004-000000000017",
        transactionId: "00000000-0000-4000-a003-000000000009",
        name: "Kemeja Formal Oxford",
        quantity: "2",
        unitPrice: 200000,
        sortOrder: 0,
        createdAt: daysAgo(20),
        updatedAt: daysAgo(20)
      },
      {
        id: "00000000-0000-4000-a004-000000000018",
        transactionId: "00000000-0000-4000-a003-000000000009",
        name: "Celana Chino Slim Fit",
        quantity: "1",
        unitPrice: 200000,
        sortOrder: 1,
        createdAt: daysAgo(20),
        updatedAt: daysAgo(20)
      },
      {
        id: "00000000-0000-4000-a004-000000000019",
        transactionId: "00000000-0000-4000-a003-000000000011",
        name: "Donasi & Zakat Maal BAZNAS",
        quantity: "1",
        unitPrice: 500000,
        sortOrder: 0,
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25)
      },
      {
        id: "00000000-0000-4000-a004-000000000020",
        transactionId: "00000000-0000-4000-a003-000000000012",
        name: "Oli Mesin Synth 4L",
        quantity: "1",
        unitPrice: 300000,
        sortOrder: 0,
        createdAt: daysAgo(27),
        updatedAt: daysAgo(27)
      },
      {
        id: "00000000-0000-4000-a004-000000000021",
        transactionId: "00000000-0000-4000-a003-000000000012",
        name: "Jasa Tune Up & Servis",
        quantity: "1",
        unitPrice: 100000,
        sortOrder: 1,
        createdAt: daysAgo(27),
        updatedAt: daysAgo(27)
      },
      {
        id: "00000000-0000-4000-a004-000000000023",
        transactionId: "00000000-0000-4000-a003-000000000015",
        name: "Sunscreen Gel SPF50",
        quantity: "1",
        unitPrice: 150000,
        sortOrder: 0,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        id: "00000000-0000-4000-a004-000000000024",
        transactionId: "00000000-0000-4000-a003-000000000015",
        name: "Facial Wash Hydrating",
        quantity: "1",
        unitPrice: 100000,
        sortOrder: 1,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      }
    ]);

  console.log("✅ Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
