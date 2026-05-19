/** @jest-environment node */

/**
 * Unit tests for media upload/delete server actions.
 */
import type { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";

jest.mock("@/lib/db", () => ({
  db: {
    media: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("@/lib/session", () => ({
  requireAuth: jest.fn(),
}));

jest.mock("@/lib/env", () => ({
  envConfig: {
    maxUploadSizeBytes: 10485760,
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

const mockDb = db as jest.Mocked<typeof db>;
const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;

import { deleteMediaAction, uploadMediaAction } from "@/app/admin/media/actions";

function makeImageFile(
  name = "test.png",
  type = "image/png",
  sizeBytes = 1024
): File {
  const buffer = new Uint8Array(sizeBytes);
  return new File([buffer], name, { type, lastModified: Date.now() });
}

function makeFormData(file?: File, fields: Record<string, string> = {}): FormData {
  const formData = new FormData();
  if (file) {
    // Third argument helps Node FormData round-trip a real File on get().
    formData.append("file", file, file.name);
  }
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("uploadMediaAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue({ id: "admin-user" } as User);
    mockDb.media.create.mockResolvedValue({
      id: "media-1",
      url: "/uploads/library/library-test.png",
    } as never);
  });

  it("rejects when no file is provided", async () => {
    const result = await uploadMediaAction(makeFormData());
    expect(result).toEqual({ success: false, error: "No file provided" });
    expect(mockDb.media.create).not.toHaveBeenCalled();
  });

  it("rejects empty file", async () => {
    const empty = makeImageFile("empty.png", "image/png", 0);
    const result = await uploadMediaAction(makeFormData(empty));
    expect(result).toEqual({ success: false, error: "No file provided" });
  });

  it("rejects disallowed mime types", async () => {
    const pdf = new File([new Uint8Array(10)], "doc.pdf", { type: "application/pdf" });
    const result = await uploadMediaAction(makeFormData(pdf));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid file type");
    }
    expect(mockDb.media.create).not.toHaveBeenCalled();
  });

  it("rejects oversized files", async () => {
    const huge = makeImageFile("huge.png", "image/png", 10485761);
    const result = await uploadMediaAction(makeFormData(huge));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("File too large");
    }
  });

  it("returns generic error when auth fails", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Authentication required"));
    const result = await uploadMediaAction(makeFormData(makeImageFile()));
    expect(result).toEqual({
      success: false,
      error: "Failed to upload media. Please try again.",
    });
  });

  it("writes file under library scope by default", async () => {
    const result = await uploadMediaAction(makeFormData(makeImageFile()));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.url).toMatch(/^\/uploads\/library\//);
    }
    expect(mockDb.media.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          insightId: null,
          uploadedBy: "admin-user",
          type: "IMAGE",
          url: expect.stringMatching(/^\/uploads\/library\//),
        }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/media");
  });

  it("scopes uploads to insightId when provided", async () => {
    const insightId = "abc-123-def";
    mockDb.media.create.mockImplementation(async ({ data }) => ({
      id: "media-scoped",
      url: data.url,
    }));

    const result = await uploadMediaAction(
      makeFormData(makeImageFile(), { insightId, alt: "Hero", caption: "Cap" })
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.url).toMatch(/^\/uploads\/abc-123-def\//);
    }
    expect(mockDb.media.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          insightId,
          alt: "Hero",
          caption: "Cap",
          url: expect.stringMatching(/^\/uploads\/abc-123-def\//),
        }),
      })
    );
  });

  it("uses draftToken scope when insightId is absent", async () => {
    mockDb.media.create.mockImplementation(async ({ data }) => ({
      id: "media-draft",
      url: data.url,
    }));

    const result = await uploadMediaAction(
      makeFormData(makeImageFile(), { draftToken: "draft-uuid-1" })
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.url).toMatch(/^\/uploads\/draft-uuid-1\//);
    }
  });

  it("sanitizes upload scope characters", async () => {
    mockDb.media.create.mockImplementation(async ({ data }) => ({
      id: "media-sanitized",
      url: data.url,
    }));

    const result = await uploadMediaAction(
      makeFormData(makeImageFile(), { draftToken: "Draft!!!Scope###" })
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.url).toMatch(/^\/uploads\/draft-scope\//);
    }
  });

  it("returns media id and url on success", async () => {
    mockDb.media.create.mockResolvedValue({
      id: "media-99",
      url: "/uploads/library/library-test.png",
    } as never);
    const result = await uploadMediaAction(makeFormData(makeImageFile()));
    expect(result).toEqual({
      success: true,
      mediaId: "media-99",
      url: "/uploads/library/library-test.png",
    });
  });
});

describe("deleteMediaAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue({ id: "admin-user" } as User);
  });

  it("returns not found when media is missing", async () => {
    mockDb.media.findUnique.mockResolvedValue(null);
    const result = await deleteMediaAction("missing-id");
    expect(result).toEqual({ success: false, error: "Media not found" });
  });

  it("deletes media record and revalidates", async () => {
    mockDb.media.findUnique.mockResolvedValue({ id: "media-1" } as never);
    mockDb.media.delete.mockResolvedValue({} as never);

    const result = await deleteMediaAction("media-1");
    expect(result).toEqual({ success: true });
    expect(mockDb.media.delete).toHaveBeenCalledWith({ where: { id: "media-1" } });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/media");
  });
});
