import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { getHasPublishedInsights } from "@/lib/insights-availability";
import { INSIGHTS_NAV_TAG } from "@/lib/insights-nav-cache";

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((fn: () => Promise<boolean>) => fn),
}));

jest.mock("@/lib/db", () => ({
  db: {
    insight: {
      count: jest.fn(),
    },
  },
}));

const mockDb = db as jest.Mocked<typeof db>;
const mockUnstableCache = unstable_cache as jest.MockedFunction<typeof unstable_cache>;

describe("getHasPublishedInsights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when at least one published insight exists", async () => {
    mockDb.insight.count.mockResolvedValue(1);

    const result = await getHasPublishedInsights();

    expect(result).toBe(true);
    expect(mockDb.insight.count).toHaveBeenCalledWith({
      where: { status: "PUBLISHED" },
    });
  });

  it("returns false when no published insights", async () => {
    mockDb.insight.count.mockResolvedValue(0);

    const result = await getHasPublishedInsights();

    expect(result).toBe(false);
  });

  it("registers unstable_cache with insights nav tag", async () => {
    mockDb.insight.count.mockResolvedValue(0);

    await getHasPublishedInsights();

    expect(mockUnstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["has-published-insights"],
      { tags: [INSIGHTS_NAV_TAG] }
    );
  });
});
