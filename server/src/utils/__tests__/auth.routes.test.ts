import { describe, it, expect, afterAll } from "bun:test";
import request from "supertest";
import app from "../../app";
import db from "@/configs/db";
import { usersTable } from "@/drizzle";
import { like } from "drizzle-orm";

describe("Auth Endpoints (/api/v1/auth)", () => {
  const randomEmail = `testuser_${Date.now()}@example.com`;
  let userAccessToken = "";

  afterAll(async () => {
    await db.delete(usersTable).where(like(usersTable.email, "testuser%"));
  });

  it("POST /api/v1/auth/register — should register a new user successfully", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: randomEmail,
      password: "Password123!",
      display_name: "Test User",
      timezone: "Asia/Jakarta"
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(randomEmail);
    expect(response.body.data.tokens.access_token).toBeDefined();

    userAccessToken = response.body.data.tokens.access_token;
  });

  it("POST /api/v1/auth/register — should reject duplicate email registration", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: randomEmail,
      password: "Password123!",
      display_name: "Test User Duplicate",
      timezone: "Asia/Jakarta"
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/v1/auth/login — should login successfully with valid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: randomEmail,
      password: "Password123!"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(randomEmail);
  });

  it("POST /api/v1/auth/login — should reject login with wrong password", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: randomEmail,
      password: "WrongPassword!"
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("GET /api/v1/auth/me — should fetch user profile with valid Bearer token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${userAccessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(randomEmail);
  });
});
