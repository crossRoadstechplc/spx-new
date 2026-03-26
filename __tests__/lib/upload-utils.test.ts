/* Phase 1: Unit tests for upload utilities */
import {
  sanitizeFilename,
  generateUniqueFilename,
  isAllowedImageType,
  isAllowedFileSize,
  getUploadUrl,
  validateUpload,
} from "@/lib/upload-utils";

// Mock env config
jest.mock("@/lib/env", () => ({
  env: {
    UPLOAD_DIR: "./public/uploads",
    MAX_UPLOAD_SIZE: "10485760",
    ALLOWED_IMAGE_TYPES: "image/jpeg,image/png,image/webp,image/gif",
  },
  envConfig: {
    maxUploadSizeBytes: 10485760,
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
}));

describe("sanitizeFilename", () => {
  it("converts to lowercase", () => {
    expect(sanitizeFilename("MyFile.jpg")).toBe("myfile.jpg");
  });

  it("replaces spaces with hyphens", () => {
    expect(sanitizeFilename("my file name.png")).toBe("my-file-name.png");
  });

  it("removes special characters", () => {
    expect(sanitizeFilename("my@file#name!.jpg")).toBe("my-file-name.jpg");
  });

  it("preserves file extension", () => {
    expect(sanitizeFilename("image.JPEG")).toBe("image.jpeg");
  });

  it("removes leading and trailing hyphens", () => {
    expect(sanitizeFilename("---file---.png")).toBe("file.png");
  });
});

describe("generateUniqueFilename", () => {
  it("generates unique filename with timestamp and random string", () => {
    const original = "test-image.jpg";
    const unique = generateUniqueFilename(original);
    expect(unique).toMatch(/^test-image-\d+-[a-z0-9]{6}\.jpg$/);
  });

  it("sanitizes original filename", () => {
    const original = "Test Image!!.jpg";
    const unique = generateUniqueFilename(original);
    expect(unique).toMatch(/^test-image-\d+-[a-z0-9]{6}\.jpg$/);
  });

  it("preserves file extension", () => {
    const unique = generateUniqueFilename("file.PNG");
    expect(unique).toMatch(/\.png$/);
  });
});

describe("isAllowedImageType", () => {
  it("allows JPEG", () => {
    expect(isAllowedImageType("image/jpeg")).toBe(true);
  });

  it("allows PNG", () => {
    expect(isAllowedImageType("image/png")).toBe(true);
  });

  it("allows WebP", () => {
    expect(isAllowedImageType("image/webp")).toBe(true);
  });

  it("allows GIF", () => {
    expect(isAllowedImageType("image/gif")).toBe(true);
  });

  it("rejects SVG", () => {
    expect(isAllowedImageType("image/svg+xml")).toBe(false);
  });

  it("rejects PDF", () => {
    expect(isAllowedImageType("application/pdf")).toBe(false);
  });
});

describe("isAllowedFileSize", () => {
  it("allows files under max size", () => {
    expect(isAllowedFileSize(5000000)).toBe(true);
  });

  it("allows files exactly at max size", () => {
    expect(isAllowedFileSize(10485760)).toBe(true);
  });

  it("rejects files over max size", () => {
    expect(isAllowedFileSize(10485761)).toBe(false);
  });
});

describe("getUploadUrl", () => {
  it("generates URL from relative path", () => {
    expect(getUploadUrl("insights/image.jpg")).toBe("/uploads/insights/image.jpg");
  });

  it("strips public/ prefix if present", () => {
    expect(getUploadUrl("public/uploads/test.jpg")).toBe("/uploads/uploads/test.jpg");
  });

  it("handles paths with slashes", () => {
    expect(getUploadUrl("2024/03/photo.png")).toBe("/uploads/2024/03/photo.png");
  });
});

describe("validateUpload", () => {
  it("validates allowed image type and size", () => {
    const result = validateUpload("image/jpeg", 5000000);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("rejects disallowed MIME type", () => {
    const result = validateUpload("application/pdf", 1000);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("not allowed");
  });

  it("rejects oversized file", () => {
    const result = validateUpload("image/jpeg", 20000000);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("exceeds maximum");
  });

  it("provides helpful error message for type mismatch", () => {
    const result = validateUpload("image/svg+xml", 1000);
    expect(result.error).toContain("image/svg+xml");
    expect(result.error).toContain("Allowed:");
  });

  it("provides helpful error message for size mismatch", () => {
    const result = validateUpload("image/jpeg", 99999999);
    expect(result.error).toContain("99999999 bytes");
    expect(result.error).toContain("10485760 bytes");
  });
});
