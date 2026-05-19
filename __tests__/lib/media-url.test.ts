import { isUploadPath, normalizeMediaSrc, resolveMediaUrl, toUploadPath } from "@/lib/media-url";

describe("toUploadPath", () => {
  it("keeps relative upload paths", () => {
    expect(toUploadPath("/uploads/library/foo.png")).toBe("/uploads/library/foo.png");
  });

  it("strips production host", () => {
    expect(toUploadPath("https://spxafrica.com/uploads/library/foo.png")).toBe(
      "/uploads/library/foo.png"
    );
  });

  it("strips localhost with wrong port", () => {
    expect(toUploadPath("http://localhost:3000/uploads/draft/x.png")).toBe(
      "/uploads/draft/x.png"
    );
  });
});

describe("resolveMediaUrl", () => {
  it("uses provided origin", () => {
    expect(resolveMediaUrl("/uploads/a.png", "http://localhost:3002")).toBe(
      "http://localhost:3002/uploads/a.png"
    );
    expect(resolveMediaUrl("https://spxafrica.com/uploads/a.png", "https://spxafrica.com")).toBe(
      "https://spxafrica.com/uploads/a.png"
    );
  });
});

describe("normalizeMediaSrc", () => {
  it("returns path only without origin", () => {
    expect(normalizeMediaSrc("https://spxafrica.com/uploads/x.jpg", null)).toBe(
      "/uploads/x.jpg"
    );
  });

  it("returns absolute URL with origin", () => {
    expect(normalizeMediaSrc("https://spxafrica.com/uploads/x.jpg", "http://localhost:3002")).toBe(
      "http://localhost:3002/uploads/x.jpg"
    );
  });

  it("leaves non-upload URLs unchanged", () => {
    expect(normalizeMediaSrc("https://cdn.example.com/asset.png", "http://localhost:3002")).toBe(
      "https://cdn.example.com/asset.png"
    );
  });
});

describe("isUploadPath", () => {
  it("detects upload paths", () => {
    expect(isUploadPath("/uploads/a.png")).toBe(true);
    expect(isUploadPath("https://spxafrica.com/uploads/a.png")).toBe(true);
    expect(isUploadPath("/assets/logo.png")).toBe(false);
  });
});
