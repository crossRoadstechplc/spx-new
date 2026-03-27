import Image from "next/image";
import Link from "next/link";
import { isStrictInsightContent, type StrictInsightContent } from "@/lib/insight-blocks";

function getEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.replace("/", "");
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  } catch {
    return url;
  }
}

export function renderStrictInsightContent(value: unknown): React.ReactNode {
  if (!isStrictInsightContent(value)) return null;

  const content = value as StrictInsightContent;
  return content.blocks.map((block) => {
    if (block.type === "text") {
      return (
        <div key={block.id} className="my-6 space-y-4">
          {block.content
            .split(/\n{2,}/)
            .map((paragraph, index) => (
              <p key={`${block.id}-${index}`}>{paragraph}</p>
            ))}
        </div>
      );
    }

    if (block.type === "image") {
      return (
        <figure key={block.id} className="my-8">
          <Image
            src={block.url}
            alt={block.alt || ""}
            width={1200}
            height={700}
            className="w-full rounded-lg h-auto"
          />
          {block.caption ? (
            <figcaption className="text-sm text-muted-foreground text-center mt-2">{block.caption}</figcaption>
          ) : null}
        </figure>
      );
    }

    if (block.type === "quote") {
      return (
        <blockquote key={block.id} className="my-8 border-l-4 border-primary pl-5 italic text-muted-foreground">
          <p>{block.quote}</p>
          {block.attribution ? (
            <footer className="mt-2 not-italic text-sm text-foreground">- {block.attribution}</footer>
          ) : null}
        </blockquote>
      );
    }

    if (block.type === "divider") {
      return <hr key={block.id} className="my-10 border-border" />;
    }

    if (block.type === "link") {
      return (
        <p key={block.id} className="my-6">
          <Link
            href={block.url}
            target={block.openInNewTab ? "_blank" : "_self"}
            rel={block.openInNewTab ? "noreferrer noopener" : undefined}
            className="text-primary underline underline-offset-4"
          >
            {block.label}
          </Link>
        </p>
      );
    }

    if (block.type === "video") {
      return (
        <figure key={block.id} className="my-8">
          <div className="aspect-video overflow-hidden rounded-lg border border-border">
            <iframe
              src={getEmbedUrl(block.url)}
              title={block.caption || "Embedded video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.caption ? (
            <figcaption className="text-sm text-muted-foreground text-center mt-2">{block.caption}</figcaption>
          ) : null}
        </figure>
      );
    }

    return null;
  });
}

