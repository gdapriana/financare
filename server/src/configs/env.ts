import dotenv from "dotenv-flow";
dotenv.config();
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),

  DATABASE_URL: z.string().url(),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  CORS_ORIGIN: z.string().optional(),

  JWT_ACCESS_SECRET: z
    .string()
    .default("financare_access_super_secret_key_change_in_prod"),

  JWT_REFRESH_SECRET: z
    .string()
    .default("financare_refresh_super_secret_key_change_in_prod"),

  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),

  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  CLOUDINARY_CLOUD_NAME: z.string().default("demo"),

  CLOUDINARY_API_KEY: z.string().default("123456789012345"),

  CLOUDINARY_API_SECRET: z.string().default("abcdefghijklmnopqrstuvwxyz1")
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

export const env: Readonly<Env> = Object.freeze(result.data);

export default env;
