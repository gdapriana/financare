import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import {
  setRefreshCookie,
  clearRefreshCookie,
  REFRESH_COOKIE_NAME
} from "../utils/cookies";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import {
  registerSchema,
  loginSchema,
  updateMeSchema
} from "../validations/auth.validation";
import { getUserProfile } from "@/services/users.service";

export const register = AsyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest(
      "Invalid registration payload.",
      parsed.error.flatten().fieldErrors
    );
  }

  const result = await authService.registerUser({
    ...parsed.data,
    user_agent: req.headers["user-agent"]
  });

  setRefreshCookie(res, result.refreshToken);

  return ApiResponse.created(res, "Registration successful.", {
    user: result.user,
    tokens: result.tokens
  });
});

export const login = AsyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest(
      "Invalid email or password format.",
      parsed.error.flatten().fieldErrors
    );
  }

  const result = await authService.loginUser({
    ...parsed.data,
    user_agent: req.headers["user-agent"]
  });

  setRefreshCookie(res, result.refreshToken);

  return ApiResponse.ok(res, "Login successful.", {
    user: result.user,
    tokens: result.tokens
  });
});

export const refresh = AsyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    throw ApiError.unauthorized(
      "Refresh token cookie not found. Please log in again."
    );
  }

  try {
    const result = await authService.refreshSession(refreshToken);

    return ApiResponse.ok(
      res,
      "Access token refreshed successfully.",
      result.tokens
    );
  } catch (err) {
    clearRefreshCookie(res);
    throw err;
  }
});

export const logout = AsyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (refreshToken) {
    await authService.logoutUser(refreshToken);
  }
  clearRefreshCookie(res);

  return ApiResponse.ok(res, "Logout successful. Session revoked.");
});

export const getMe = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const user = await getUserProfile(req.user.userId);

  return ApiResponse.ok(res, "User profile retrieved successfully.", {
    user
  });
});

export const updateMe = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const parsed = updateMeSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest(
      "Invalid profile update payload.",
      parsed.error.flatten().fieldErrors
    );
  }

  const updatedUser = await authService.updateUserProfile(
    req.user.userId,
    parsed.data
  );

  return ApiResponse.ok(res, "User profile updated successfully.", {
    user: updatedUser
  });
});
