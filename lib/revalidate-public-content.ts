import { revalidatePath, revalidateTag } from "next/cache";
import { INSIGHTS_NAV_TAG } from "@/lib/insights-nav-cache";

export { INSIGHTS_NAV_TAG };

/** Invalidate nav/footer + newsletter gate everywhere insights availability matters. */
export function revalidatePublicInsightsNav(): void {
  revalidateTag(INSIGHTS_NAV_TAG);
  revalidatePath("/", "layout");
}
