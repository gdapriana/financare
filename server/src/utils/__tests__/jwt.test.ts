import { describe, it, expect } from "bun:test";
import { generateAccessToken, verifyAccessToken, TokenPayload } from "../jwt";

describe("JWT Utilities", () => {
  it("should generate and verify access token correctly", () => {
    const mockPayload: TokenPayload = {
      userId: "00000000-0000-4000-a000-000000000001",
      email: "budi@example.com",
      role: "ADMIN"
    };
    const token = generateAccessToken(mockPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(mockPayload.userId);
    expect(decoded.email).toBe(mockPayload.email);
    expect(decoded.role).toBe(mockPayload.role);
  });
});
