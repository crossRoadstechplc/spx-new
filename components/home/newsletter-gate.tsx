import { getHasPublishedInsights } from "@/lib/insights-availability";
import { NewsletterSection } from "./newsletter-section";

/** Renders the newsletter block only when there is published insight content to share. */
export async function NewsletterGate() {
  if (!(await getHasPublishedInsights())) return null;
  return <NewsletterSection />;
}
