/**
 * Unit tests for insight create/update validation paths.
 */
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { notifySubscribersForInsight } from "@/lib/newsletter";
import { createInsightAction, updateInsightAction } from "@/app/admin/insights/actions";

jest.mock("@/lib/db", () => ({
  db: {
    insight: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    insightTag: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    media: {
      updateMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/session", () => ({
  requireAuth: jest.fn(),
}));

jest.mock("@/lib/newsletter", () => ({
  notifySubscribersForInsight: jest.fn(),
  clearInsightEmailDispatches: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    const error = new Error("NEXT_REDIRECT");
    throw error;
  }),
}));

const mockDb = db as jest.Mocked<typeof db>;
const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

const validContent = {
  version: 2 as const,
  blocks: [{ id: "b1", type: "text" as const, content: "Hello body" }],
};

function makeInsightFormData(overrides: Record<string, string> = {}): FormData {
  const formData = new FormData();
  formData.set("title", overrides.title ?? "Test Insight");
  formData.set("slug", overrides.slug ?? "test-insight");
  formData.set("status", overrides.status ?? "DRAFT");
  formData.set("contentJson", overrides.contentJson ?? JSON.stringify(validContent));
  formData.set("contentHtml", "");
  if (overrides.excerpt) formData.set("excerpt", overrides.excerpt);
  if (overrides.coverImageId) formData.set("coverImageId", overrides.coverImageId);
  return formData;
}

describe("createInsightAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue({ id: "admin-user" } as User);
    mockDb.insight.findUnique.mockResolvedValue(null);
    mockDb.insight.create.mockResolvedValue({ id: "insight-1", slug: "test-insight" } as never);
    mockDb.media.updateMany.mockResolvedValue({ count: 0 });
  });

  it("rejects missing title", async () => {
    const formData = makeInsightFormData();
    formData.set("title", "");
    const result = await createInsightAction(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Validation failed");
    }
  });

  it("rejects invalid strict content blocks", async () => {
    const formData = makeInsightFormData({
      contentJson: JSON.stringify({
        version: 2,
        blocks: [{ id: "b1", type: "text", content: "" }],
      }),
    });
    const result = await createInsightAction(formData);
    expect(result).toEqual({
      success: false,
      error: "Invalid content blocks. Please fix the editor blocks and try again.",
      fieldErrors: {
        contentJson: expect.arrayContaining([expect.any(String)]),
      },
    });
    expect(mockDb.insight.create).not.toHaveBeenCalled();
  });

  it("rejects duplicate slug", async () => {
    mockDb.insight.findUnique.mockResolvedValue({ id: "existing" } as never);
    const result = await createInsightAction(makeInsightFormData());
    expect(result).toEqual({
      success: false,
      error: "Slug already exists",
      fieldErrors: { slug: ["This slug is already in use"] },
    });
  });

  it("creates insight and redirects on success", async () => {
    await expect(createInsightAction(makeInsightFormData())).rejects.toThrow("NEXT_REDIRECT");
    expect(mockDb.insight.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Test Insight",
          slug: "test-insight",
          contentJson: validContent,
          createdById: "admin-user",
        }),
      })
    );
    expect(mockRedirect).toHaveBeenCalledWith("/admin/insights");
  });

  it("links cover image and block media on create", async () => {
    const content = {
      version: 2 as const,
      blocks: [
        { id: "b1", type: "text" as const, content: "Body" },
        {
          id: "b2",
          type: "image" as const,
          mediaId: "media-1",
          url: "/uploads/x.jpg",
        },
      ],
    };
    const formData = makeInsightFormData({
      contentJson: JSON.stringify(content),
      coverImageId: "media-cover",
    });

    await expect(createInsightAction(formData)).rejects.toThrow("NEXT_REDIRECT");
    expect(mockDb.media.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ["media-cover", "media-1"] } },
      data: { insightId: "insight-1" },
    });
  });

  it("notifies subscribers when publishing on create", async () => {
    const formData = makeInsightFormData({ status: "PUBLISHED" });
    await expect(createInsightAction(formData)).rejects.toThrow("NEXT_REDIRECT");
    expect(notifySubscribersForInsight).toHaveBeenCalledWith("insight-1");
  });
});

describe("updateInsightAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue({ id: "admin-user" } as User);
    mockDb.insight.findFirst.mockResolvedValue(null);
    mockDb.insight.findUnique.mockResolvedValue({
      id: "insight-1",
      status: "DRAFT",
      publishedAt: null,
    } as never);
    mockDb.insight.update.mockResolvedValue({} as never);
    mockDb.insightTag.deleteMany.mockResolvedValue({ count: 0 });
    mockDb.media.updateMany.mockResolvedValue({ count: 0 });
  });

  it("returns not found when insight is missing", async () => {
    mockDb.insight.findUnique.mockResolvedValue(null);
    const result = await updateInsightAction("missing", makeInsightFormData());
    expect(result).toEqual({ success: false, error: "Insight not found." });
  });

  it("unlinks media no longer referenced", async () => {
    const formData = makeInsightFormData();
    await expect(updateInsightAction("insight-1", formData)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockDb.media.updateMany).toHaveBeenCalledWith({
      where: { insightId: "insight-1" },
      data: { insightId: null },
    });
  });
});
