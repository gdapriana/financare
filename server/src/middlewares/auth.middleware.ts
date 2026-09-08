import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";
import { ApiError } from "../utils/api-error";
import { STATUS_CODES } from "../constants/status-codes";

export type UserRole = "USER" | "ADMIN";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        "Access denied. Authentication token not found."
      );
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    if (error?.name === "TokenExpiredError") {
      next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Access token has expired. Please refresh your token."
        )
      );
      return;
    }
    if (error?.name === "JsonWebTokenError") {
      next(
        new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "Invalid access token format."
        )
      );
      return;
    }
    next(
      new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        "Authentication failed."
      )
    );
  }
};

export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized("Access denied. Authentication required."));
      return;
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role as UserRole)) {
      next(ApiError.forbidden("Access denied. Insufficient permissions for this resource."));
      return;
    }

    next();
  };
};
