/* Phase 1: Unit tests for environment variable validation */

describe("lib/env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("validates required DATABASE_URL", async () => {
    process.env.DATABASE_URL = "file:./test.db";
    const { env } = await import("@/lib/env");
    expect(env.DATABASE_URL).toBe("file:./test.db");
  });

  it("throws if DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    await expect(async () => {
      await import("@/lib/env");
    }).rejects.toThrow("Invalid environment variables");
  });

  it("applies default values for optional fields", async () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.NODE_ENV = "development";
    const { env } = await import("@/lib/env");
    expect(env.NODE_ENV).toBe("development");
    expect(env.APP_URL).toBe("http://localhost:3000");
    expect(env.UPLOAD_DIR).toBe("./public/uploads");
  });

  it("validates NODE_ENV enum", async () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.NODE_ENV = "production";
    const { env } = await import("@/lib/env");
    expect(env.NODE_ENV).toBe("production");
  });

  it("exports envConfig with derived values", async () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.NODE_ENV = "production";
    process.env.MAX_UPLOAD_SIZE = "5242880";
    const { envConfig } = await import("@/lib/env");
    expect(envConfig.isProduction).toBe(true);
    expect(envConfig.isDevelopment).toBe(false);
    expect(envConfig.maxUploadSizeBytes).toBe(5242880);
  });

  it("parses ALLOWED_IMAGE_TYPES into array", async () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.ALLOWED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
    const { envConfig } = await import("@/lib/env");
    expect(envConfig.allowedImageTypes).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
  });

  it("validates email format for optional email fields", async () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.ADMIN_EMAIL = "invalid-email";
    await expect(async () => {
      await import("@/lib/env");
    }).rejects.toThrow();
  });
});
