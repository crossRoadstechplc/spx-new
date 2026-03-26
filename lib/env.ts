/* Phase 1: Typed environment variable validation using Zod */
import { z } from "zod";

/**
 * Environment variable schema with validation rules.
 * Validates at build time and runtime to catch configuration errors early.
 */
const envSchema = z.object({
  // Application core
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Authentication (optional until Phase 3)
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),

  // Email / SMTP (optional until Phase 7)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(), // Can include name and email like "Name <email@example.com>"
  CONTACT_RECIPIENT_EMAIL: z.string().optional(),
  CAREERS_RECIPIENT_EMAIL: z.string().optional(),

  // File uploads (Phase 1)
  UPLOAD_DIR: z.string().default("./public/uploads"),
  MAX_UPLOAD_SIZE: z.string().default("10485760"),
  ALLOWED_IMAGE_TYPES: z.string().default("image/jpeg,image/png,image/webp,image/gif"),
});

/**
 * Parsed and validated environment variables.
 * Throws an error if validation fails.
 */
function parseEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

/**
 * Type-safe environment variables.
 * Access via: `env.DATABASE_URL`
 */
export const env = parseEnv();

/**
 * Derived/computed environment values
 */
export const envConfig = {
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
  maxUploadSizeBytes: parseInt(env.MAX_UPLOAD_SIZE, 10),
  allowedImageTypes: env.ALLOWED_IMAGE_TYPES.split(",").map((t) => t.trim()),
} as const;

/**
 * Validates environment on import.
 * Use this in server-side code only (not client components).
 */
export function validateEnv() {
  return env;
}
