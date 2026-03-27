import {
  extractMediaIdsFromStrictContent,
  isStrictInsightContent,
  strictInsightContentSchema,
} from "@/lib/insight-blocks";

describe("strictInsightContentSchema", () => {
  it("accepts valid strict block content", () => {
    const value = {
      version: 2,
      blocks: [
        { id: "b1", type: "text", content: "Hello world" },
        { id: "b2", type: "divider" },
        { id: "b3", type: "image", mediaId: "m1", url: "/uploads/x.jpg", alt: "x" },
        { id: "b4", type: "quote", quote: "Q", attribution: "A" },
        { id: "b5", type: "link", url: "https://example.com", label: "Example", openInNewTab: true },
        { id: "b6", type: "video", url: "https://youtu.be/abc123" },
      ],
    };

    expect(strictInsightContentSchema.safeParse(value).success).toBe(true);
    expect(isStrictInsightContent(value)).toBe(true);
  });

  it("rejects invalid content", () => {
    const value = {
      type: "doc",
      content: [],
    };
    expect(strictInsightContentSchema.safeParse(value).success).toBe(false);
    expect(isStrictInsightContent(value)).toBe(false);
  });
});

describe("extractMediaIdsFromStrictContent", () => {
  it("returns only image block media ids", () => {
    const value = {
      version: 2,
      blocks: [
        { id: "b1", type: "text", content: "a" },
        { id: "b2", type: "image", mediaId: "m1", url: "/uploads/1.jpg" },
        { id: "b3", type: "image", mediaId: "m2", url: "/uploads/2.jpg" },
        { id: "b4", type: "image", url: "/uploads/3.jpg" },
      ],
    };

    expect(extractMediaIdsFromStrictContent(value)).toEqual(["m1", "m2"]);
  });

  it("returns empty array for non-strict payload", () => {
    expect(extractMediaIdsFromStrictContent({ type: "doc", content: [] })).toEqual([]);
  });
});

