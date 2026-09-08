import { eq, and, isNull, gt, sql } from "drizzle-orm";
import db from "../configs/db";
import { usersTable, authSessionsTable } from "../drizzle";
import { comparePassword, hashPassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
  TokenPayload
} from "../utils/jwt";
import { ApiError } from "../utils/api-error";

export type UserSelect = typeof usersTable.$inferSelect;

export interface RegisterDTO {
  email: string;
  password: string;
  display_name: string;
  timezone?: string;
  user_agent?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  device_name?: string;
  user_agent?: string;
}

export interface UpdateProfileDTO {
  display_name?: string;
  timezone?: string;
}

export const formatUser = (user: UserSelect) => {
  return {
    id: user.id,
    email: user.email,
    display_name: user.displayName,
    role: user.role,
    timezone: user.timezone,
    currency_code: user.currencyCode,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };
};

export const registerUser = async (dto: RegisterDTO) => {
  const existingUser = await db.query.usersTable.findFirst({
    where: sql`LOWER(${usersTable.email}) = LOWER(${dto.email})`
  });

  if (existingUser) {
    throw ApiError.conflict("User with this email already exists.");
  }

  const passwordHash = await hashPassword(dto.password);

  const [newUser] = await db
    .insert(usersTable)
    .values({
      email: dto.email.toLowerCase(),
      passwordHash,
      displayName: dto.display_name,
      role: "USER",
      timezone: dto.timezone || "Asia/Makassar"
    })
    .returning();

  const payload: TokenPayload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(authSessionsTable).values({
    userId: newUser.id,
    refreshTokenHash,
    deviceName: dto.user_agent || "Unknown Device",
    expiresAt
  });

  return {
    user: formatUser(newUser),
    refreshToken,
    tokens: {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600
    }
  };
};

export const loginUser = async (dto: LoginDTO) => {
  const user = await db.query.usersTable.findFirst({
    where: sql`LOWER(${usersTable.email}) = LOWER(${dto.email})`
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const isPasswordValid = await comparePassword(
    dto.password,
    user.passwordHash
  );
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(authSessionsTable).values({
    userId: user.id,
    refreshTokenHash,
    deviceName: dto.device_name || dto.user_agent || "Unknown Device",
    expiresAt
  });

  return {
    user: formatUser(user),
    refreshToken,
    tokens: {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600
    }
  };
};

export const refreshSession = async (refreshToken: string) => {
  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (_err) {
    throw ApiError.unauthorized("Refresh token has expired or is invalid. Please log in again.");
  }

  const tokenHash = hashRefreshToken(refreshToken);

  const session = await db.query.authSessionsTable.findFirst({
    where: and(
      eq(authSessionsTable.refreshTokenHash, tokenHash),
      isNull(authSessionsTable.revokedAt),
      gt(authSessionsTable.expiresAt, new Date())
    )
  });

  if (!session) {
    throw ApiError.unauthorized("Refresh token has expired or session is revoked. Please log in again.");
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, payload.userId)
  });

  if (!user) {
    throw ApiError.unauthorized("User no longer exists. Please log in again.");
  }

  const newPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  const newAccessToken = generateAccessToken(newPayload);

  return {
    tokens: {
      access_token: newAccessToken,
      token_type: "Bearer",
      expires_in: 3600
    }
  };
};

export const logoutUser = async (refreshToken?: string) => {
  if (refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    await db
      .update(authSessionsTable)
      .set({ revokedAt: new Date() })
      .where(eq(authSessionsTable.refreshTokenHash, tokenHash));
  }
};

export const getUserById = async (userId: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId)
  });

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  return formatUser(user);
};

export const updateUserProfile = async (
  userId: string,
  dto: UpdateProfileDTO
) => {
  const [updatedUser] = await db
    .update(usersTable)
    .set({
      ...(dto.display_name && { displayName: dto.display_name }),
      ...(dto.timezone && { timezone: dto.timezone }),
      updatedAt: new Date()
    })
    .where(eq(usersTable.id, userId))
    .returning();

  if (!updatedUser) {
    throw ApiError.notFound("User not found.");
  }

  return formatUser(updatedUser);
};
