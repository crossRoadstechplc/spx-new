import { renderTiptapContent, type TiptapContent } from "@/lib/tiptap-renderer";
import { renderStrictInsightContent } from "@/lib/insight-block-renderer";
import {
  isStrictInsightContent,
  normalizeInsightContentMediaUrls,
  type StrictInsightContent,
} from "@/lib/insight-blocks";
import { toUploadPath } from "@/lib/media-url";
import { formatDate } from "@/lib/utils";
import { LazyImage } from "@/components/ui/lazy-image";

export type InsightArticleViewData = {
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  contentJson: unknown;
  author: { name: string } | null;
  category: { name: string } | null;
  coverImage: { url: string; alt: string | null } | null;
  tags: { id: string; tag: { name: string } }[];
};

interface InsightArticleViewProps {
  insight: InsightArticleViewData;
  /** When true, shows an admin preview banner (draft/archived visible). */
  isPreview?: boolean;
}

export function InsightArticleView({ insight, isPreview = false }: InsightArticleViewProps) {
  const coverSrc = insight.coverImage?.url ? toUploadPath(insight.coverImage.url) : null;

  let body: React.ReactNode;
  if (isStrictInsightContent(insight.contentJson)) {
    const normalized = normalizeInsightContentMediaUrls(
      insight.contentJson as StrictInsightContent
    );
    body = renderStrictInsightContent(normalized);
  } else {
    body = renderTiptapContent(insight.contentJson as unknown as TiptapContent);
  }

  return (
    <article className="min-w-0">
      {isPreview ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-50">
          <strong className="font-semibold">Preview</strong>
          {" — "}
          {insight.status === "PUBLISHED"
            ? "This is how the published insight appears on the site."
            : `Status: ${insight.status ?? "DRAFT"}. Only admins can see this preview.`}
        </div>
      ) : null}

      {coverSrc ? (
        <figure className="mb-10 overflow-hidden rounded-lg border border-border/60">
          <div className="relative aspect-[21/9] w-full bg-muted">
            <LazyImage
              src={coverSrc}
              alt={insight.coverImage?.alt || insight.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </figure>
      ) : null}

      <header className="mb-12 pb-8 border-b border-border/80">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          SPX Insights Desk
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-foreground">
          {insight.title}
        </h1>
        {insight.excerpt ? (
          <p className="text-lg leading-relaxed text-foreground/85 mb-6 max-w-3xl font-light">
            {insight.excerpt}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {insight.author ? (
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-semibold text-primary">
              By {insight.author.name}
            </span>
          ) : null}
          {insight.publishedAt ? <span>{formatDate(insight.publishedAt)}</span> : null}
          {insight.category ? (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
              {insight.category.name}
            </span>
          ) : null}
        </div>
      </header>

      <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-h2:mt-14 prose-h3:mt-10 prose-p:leading-8 prose-p:text-foreground/90 prose-p:my-6 prose-a:text-primary prose-a:font-medium prose-blockquote:border-primary prose-blockquote:text-foreground/80 prose-blockquote:bg-muted/30 prose-blockquote:px-5 prose-blockquote:py-3 prose-img:rounded-none prose-img:border prose-img:border-border/60 prose-img:shadow-sm first-letter:text-5xl first-letter:font-semibold first-letter:mr-1 first-letter:float-left first-letter:leading-none">
        {body}
      </div>

      {insight.tags.length > 0 ? (
        <div className="mt-14 pt-8 border-t border-border">
          <div className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
            Tagged As
          </div>
          <div className="flex flex-wrap gap-2.5">
            {insight.tags.map((insightTag) => (
              <span
                key={insightTag.id}
                className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/25 rounded-full text-xs font-semibold uppercase tracking-wide"
              >
                {insightTag.tag.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
