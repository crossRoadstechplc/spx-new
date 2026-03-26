/* Phase 5: Slug generation tests */
import { generateSlug, isValidSlug, makeUniqueSlug } from "@/lib/slug";

describe("generateSlug", () => {
  it("should convert title to lowercase slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("should replace spaces with hyphens", () => {
    expect(generateSlug("This is a Test")).toBe("this-is-a-test");
  });

  it("should remove special characters", () => {
    expect(generateSlug("Test@#$%123")).toBe("test123");
  });

  it("should handle multiple spaces", () => {
    expect(generateSlug("Too   Many    Spaces")).toBe("too-many-spaces");
  });

  it("should remove leading and trailing hyphens", () => {
    expect(generateSlug("-Test-")).toBe("test");
  });

  it("should handle empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("should handle complex titles", () => {
    expect(generateSlug("SPX's Guide to Systems Thinking (2024)")).toBe(
      "spxs-guide-to-systems-thinking-2024"
    );
  });
});

describe("isValidSlug", () => {
  it("should accept valid slugs", () => {
    expect(isValidSlug("hello-world")).toBe(true);
    expect(isValidSlug("test123")).toBe(true);
    expect(isValidSlug("a-b-c-123")).toBe(true);
  });

  it("should reject invalid slugs", () => {
    expect(isValidSlug("Hello World")).toBe(false); // Uppercase
    expect(isValidSlug("test_slug")).toBe(false); // Underscore
    expect(isValidSlug("test slug")).toBe(false); // Space
    expect(isValidSlug("-test")).toBe(false); // Leading hyphen
    expect(isValidSlug("test-")).toBe(false); // Trailing hyphen
    expect(isValidSlug("")).toBe(false); // Empty
  });
});

describe("makeUniqueSlug", () => {
  it("should return base slug if not in existing list", () => {
    const result = makeUniqueSlug("test-slug", ["other-slug"]);
    expect(result).toBe("test-slug");
  });

  it("should append -1 if base slug exists", () => {
    const result = makeUniqueSlug("test-slug", ["test-slug"]);
    expect(result).toBe("test-slug-1");
  });

  it("should increment counter until unique", () => {
    const result = makeUniqueSlug("test-slug", [
      "test-slug",
      "test-slug-1",
      "test-slug-2",
    ]);
    expect(result).toBe("test-slug-3");
  });

  it("should handle empty existing slugs list", () => {
    const result = makeUniqueSlug("test-slug", []);
    expect(result).toBe("test-slug");
  });
});
