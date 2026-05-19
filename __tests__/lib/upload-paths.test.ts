import path from "path";
import {
  getUploadFilePath,
  getUploadPublicUrl,
  getUploadRootDir,
  resolveUploadDiskPathFromPublicUrl,
  sanitizeUploadScope,
  toUploadPublicPath,
  UPLOAD_ROOT_RELATIVE,
} from "@/lib/upload-paths";

describe("upload-paths", () => {
  it("uses public/uploads under project root", () => {
    expect(getUploadRootDir()).toBe(
      path.join(process.cwd(), "public", "uploads")
    );
    expect(UPLOAD_ROOT_RELATIVE).toBe("public/uploads");
  });

  it("builds scoped disk and public paths", () => {
    expect(getUploadFilePath("library", "foo.png")).toBe(
      path.join(process.cwd(), "public", "uploads", "library", "foo.png")
    );
    expect(getUploadPublicUrl("library", "foo.png")).toBe(
      "/uploads/library/foo.png"
    );
  });

  it("sanitizes upload scope", () => {
    expect(sanitizeUploadScope("Draft_UUID-1")).toBe("draft-uuid-1");
    expect(sanitizeUploadScope("")).toBe("library");
  });

  it("normalizes public URLs", () => {
    expect(toUploadPublicPath("https://example.com/uploads/a/b.png")).toBe(
      "/uploads/a/b.png"
    );
    expect(toUploadPublicPath("public/uploads/library/x.png")).toBe(
      "/uploads/library/x.png"
    );
  });

  it("resolves disk path from public URL", () => {
    const disk = resolveUploadDiskPathFromPublicUrl("/uploads/library/x.png");
    expect(disk).toBe(
      path.join(process.cwd(), "public", "uploads", "library", "x.png")
    );
  });

  it("rejects path traversal in public URL", () => {
    expect(resolveUploadDiskPathFromPublicUrl("/uploads/../etc/passwd")).toBeNull();
  });
});
