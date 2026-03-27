import { DEFAULT_INSIGHT_CATEGORIES } from "@/lib/insight-categories";

describe("DEFAULT_INSIGHT_CATEGORIES", () => {
  it("contains only required fixed categories", () => {
    expect(DEFAULT_INSIGHT_CATEGORIES.map((item) => item.name)).toEqual([
      "Reports",
      "Articles",
      "Events",
    ]);
    expect(DEFAULT_INSIGHT_CATEGORIES.map((item) => item.slug)).toEqual([
      "reports",
      "articles",
      "events",
    ]);
  });
});

