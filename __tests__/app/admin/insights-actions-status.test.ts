/**
 * Unit tests for insight list/bulk status actions and related delete paths.
 */
import type { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import {
  clearInsightEmailDispatches,
  notifySubscribersForInsight,
} from "@/lib/newsletter";
import {
  bulkDeleteInsightsAction,
  bulkSetInsightsStatusAction,
  deleteInsightAction,
  setInsightStatusAction,
} from "@/app/admin/insights/actions";

jest.mock("@/lib/db", () => ({
  db: {
    insight: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
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

const mockDb = db as jest.Mocked<typeof db>;
const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockNotify = notifySubscribersForInsight as jest.MockedFunction<
  typeof notifySubscribersForInsight
>;
const mockClearDispatches = clearInsightEmailDispatches as jest.MockedFunction<
  typeof clearInsightEmailDispatches
>;

describe("admin insight status and bulk actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue({ id: "admin-user" } as User);
  });

  describe("setInsightStatusAction", () => {
    it("returns invalid status when status is not a valid enum", async () => {
      const result = await setInsightStatusAction(
        "insight-1",
        // @ts-expect-error exercise Zod rejection for invalid status
        "NOT_A_STATUS"
      );
      expect(result).toEqual({ success: false, error: "Invalid status." });
      expect(mockDb.insight.findUnique).not.toHaveBeenCalled();
    });

    it("returns not found when insight does not exist", async () => {
      mockDb.insight.findUnique.mockResolvedValue(null);

      const result = await setInsightStatusAction("missing", "PUBLISHED");

      expect(result).toEqual({ success: false, error: "Insight not found." });
      expect(mockDb.insight.update).not.toHaveBeenCalled();
    });

    it("returns success without updating when status is unchanged", async () => {
      mockDb.insight.findUnique.mockResolvedValue({
        id: "i1",
        status: "DRAFT",
        publishedAt: null,
        slug: "my-slug",
      });

      const result = await setInsightStatusAction("i1", "DRAFT");

      expect(result).toEqual({ success: true });
      expect(mockDb.insight.update).not.toHaveBeenCalled();
      expect(mockNotify).not.toHaveBeenCalled();
    });

    it("publishes a draft: sets publishedAt, notifies subscribers, revalidates", async () => {
      mockDb.insight.findUnique.mockResolvedValue({
        id: "i1",
        status: "DRAFT",
        publishedAt: null,
        slug: "post-a",
      });
      mockDb.insight.update.mockResolvedValue({} as never);

      const result = await setInsightStatusAction("i1", "PUBLISHED");

      expect(result).toEqual({ success: true });
      expect(mockDb.insight.update).toHaveBeenCalledWith({
        where: { id: "i1" },
        data: {
          status: "PUBLISHED",
          publishedAt: expect.any(Date),
        },
      });
      expect(mockNotify).toHaveBeenCalledWith("i1");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/insights");
      expect(revalidatePath).toHaveBeenCalledWith("/insights");
      expect(revalidatePath).toHaveBeenCalledWith("/insights/post-a");
    });

    it("unpublishes to draft: clears publishedAt, clears newsletter dispatches, does not notify", async () => {
      const published = new Date("2024-06-01T00:00:00.000Z");
      mockDb.insight.findUnique.mockResolvedValue({
        id: "i1",
        status: "PUBLISHED",
        publishedAt: published,
        slug: "post-b",
      });
      mockDb.insight.update.mockResolvedValue({} as never);

      const result = await setInsightStatusAction("i1", "DRAFT");

      expect(result).toEqual({ success: true });
      expect(mockDb.insight.update).toHaveBeenCalledWith({
        where: { id: "i1" },
        data: { status: "DRAFT", publishedAt: null },
      });
      expect(mockClearDispatches).toHaveBeenCalledWith("i1");
      expect(mockNotify).not.toHaveBeenCalled();
    });

    it("archives while preserving publishedAt", async () => {
      const published = new Date("2024-01-15T00:00:00.000Z");
      mockDb.insight.findUnique.mockResolvedValue({
        id: "i1",
        status: "PUBLISHED",
        publishedAt: published,
        slug: "post-c",
      });
      mockDb.insight.update.mockResolvedValue({} as never);

      const result = await setInsightStatusAction("i1", "ARCHIVED");

      expect(result).toEqual({ success: true });
      expect(mockDb.insight.update).toHaveBeenCalledWith({
        where: { id: "i1" },
        data: { status: "ARCHIVED", publishedAt: published },
      });
      expect(mockClearDispatches).toHaveBeenCalledWith("i1");
    });
  });

  describe("bulkSetInsightsStatusAction", () => {
    it("rejects empty id list", async () => {
      const result = await bulkSetInsightsStatusAction([], "PUBLISHED");
      expect(result).toEqual({ success: false, error: "Invalid request." });
      expect(mockDb.insight.findMany).not.toHaveBeenCalled();
    });

    it("updates only rows whose status differs and counts updates", async () => {
      mockDb.insight.findMany.mockResolvedValue([
        {
          id: "a",
          status: "DRAFT",
          publishedAt: null,
          slug: "slug-a",
        },
        {
          id: "b",
          status: "PUBLISHED",
          publishedAt: new Date(),
          slug: "slug-b",
        },
      ]);
      mockDb.insight.update.mockResolvedValue({} as never);

      const result = await bulkSetInsightsStatusAction(
        ["a", "b"],
        "PUBLISHED"
      );

      expect(result.success).toBe(true);
      expect(result.updated).toBe(1);
      expect(mockDb.insight.update).toHaveBeenCalledTimes(1);
      expect(mockDb.insight.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "a" },
          data: expect.objectContaining({ status: "PUBLISHED" }),
        })
      );
      expect(mockNotify).toHaveBeenCalledWith("a");
      expect(mockClearDispatches).not.toHaveBeenCalled();
    });

    it("bulk draft clears dispatches for rows that were published", async () => {
      mockDb.insight.findMany.mockResolvedValue([
        {
          id: "x",
          status: "PUBLISHED",
          publishedAt: new Date(),
          slug: "was-pub",
        },
      ]);
      mockDb.insight.update.mockResolvedValue({} as never);

      await bulkSetInsightsStatusAction(["x"], "DRAFT");

      expect(mockClearDispatches).toHaveBeenCalledWith("x");
      expect(mockNotify).not.toHaveBeenCalled();
    });

    it("revalidates slug paths for all matched insights", async () => {
      mockDb.insight.findMany.mockResolvedValue([
        {
          id: "x",
          status: "DRAFT",
          publishedAt: null,
          slug: "one",
        },
      ]);
      mockDb.insight.update.mockResolvedValue({} as never);

      await bulkSetInsightsStatusAction(["x"], "DRAFT");

      expect(revalidatePath).toHaveBeenCalledWith("/insights/one");
    });
  });

  describe("bulkDeleteInsightsAction", () => {
    it("rejects empty ids", async () => {
      const result = await bulkDeleteInsightsAction([]);
      expect(result).toEqual({ success: false, error: "Invalid request." });
    });

    it("deletes many and returns count; revalidates each slug", async () => {
      mockDb.insight.findMany.mockResolvedValue([
        { slug: "alpha" },
        { slug: "beta" },
      ]);
      mockDb.insight.deleteMany.mockResolvedValue({ count: 2 });

      const result = await bulkDeleteInsightsAction(["id1", "id2"]);

      expect(result).toEqual({ success: true, deleted: 2 });
      expect(mockDb.insight.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ["id1", "id2"] } },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/insights/alpha");
      expect(revalidatePath).toHaveBeenCalledWith("/insights/beta");
    });
  });

  describe("deleteInsightAction", () => {
    it("loads slug before delete and revalidates insight path", async () => {
      mockDb.insight.findUnique.mockResolvedValue({ slug: "gone" });
      mockDb.insight.delete.mockResolvedValue({} as never);

      const result = await deleteInsightAction("del-id");

      expect(result).toEqual({ success: true });
      expect(mockDb.insight.findUnique).toHaveBeenCalledWith({
        where: { id: "del-id" },
        select: { slug: true },
      });
      expect(mockDb.insight.delete).toHaveBeenCalledWith({
        where: { id: "del-id" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/insights/gone");
    });
  });
});
