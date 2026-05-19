import { revalidatePath, revalidateTag } from "next/cache";
import { INSIGHTS_NAV_TAG } from "@/lib/insights-nav-cache";
import { revalidatePublicInsightsNav } from "@/lib/revalidate-public-content";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

describe("revalidatePublicInsightsNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("revalidates insights nav tag and root layout", () => {
    revalidatePublicInsightsNav();

    expect(revalidateTag).toHaveBeenCalledWith(INSIGHTS_NAV_TAG);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("exports insights nav tag constant", () => {
    expect(INSIGHTS_NAV_TAG).toBe("insights-nav");
  });
});
