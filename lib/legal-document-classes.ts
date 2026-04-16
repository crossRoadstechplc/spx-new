/**
 * Shared Tailwind Typography (`prose`) tuning for policy / legal pages.
 * Requires `@tailwindcss/typography` in tailwind.config.
 */
export const LEGAL_DOCUMENT_PROSE =
  [
    "prose prose-slate prose-lg max-w-none",
    "prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tight",
    "prose-h2:mt-12 prose-h2:mb-5 prose-h2:scroll-mt-24",
    "[&_h2:first-of-type]:mt-8",
    "prose-h3:mt-10 prose-h3:mb-4",
    "prose-p:my-6 prose-p:leading-[1.75] prose-p:text-foreground/90",
    "prose-ul:my-6 prose-ul:space-y-2.5",
    "prose-ol:my-6 prose-ol:space-y-2.5",
    "prose-li:my-0.5 prose-li:leading-relaxed prose-li:marker:text-primary/70",
    "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-2",
    "prose-strong:text-foreground prose-strong:font-semibold",
    "prose-hr:my-10 prose-hr:border-border",
  ].join(" ");

/** “Last updated” strip above flowing prose */
export const LEGAL_DOCUMENT_META =
  "not-prose mb-10 border-b border-border/60 pb-8";
