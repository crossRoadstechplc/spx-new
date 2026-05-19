/** Admin insight preview paths (iframe-friendly, auth required). */

export function getAdminInsightPreviewPath(insightId: string): string {
  return `/admin/insights/preview/${insightId}`;
}

export function getAdminInsightPreviewUrl(insightId: string, origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${getAdminInsightPreviewPath(insightId)}`;
}
