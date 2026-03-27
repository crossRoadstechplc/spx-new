import { z } from "zod";

const baseBlockSchema = z.object({
  id: z.string().min(1),
});

const textBlockSchema = baseBlockSchema.extend({
  type: z.literal("text"),
  content: z.string().min(1, "Text block content is required"),
});

const imageBlockSchema = baseBlockSchema.extend({
  type: z.literal("image"),
  mediaId: z.string().min(1).optional(),
  url: z.string().min(1, "Image URL is required"),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const quoteBlockSchema = baseBlockSchema.extend({
  type: z.literal("quote"),
  quote: z.string().min(1, "Quote content is required"),
  attribution: z.string().optional(),
});

const dividerBlockSchema = baseBlockSchema.extend({
  type: z.literal("divider"),
});

const linkBlockSchema = baseBlockSchema.extend({
  type: z.literal("link"),
  url: z.string().url("Link URL must be valid"),
  label: z.string().min(1, "Link label is required"),
  openInNewTab: z.boolean().default(true),
});

const videoBlockSchema = baseBlockSchema.extend({
  type: z.literal("video"),
  url: z.string().url("Video URL must be valid"),
  caption: z.string().optional(),
});

export const insightBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  imageBlockSchema,
  quoteBlockSchema,
  dividerBlockSchema,
  linkBlockSchema,
  videoBlockSchema,
]);

export const strictInsightContentSchema = z.object({
  version: z.literal(2),
  blocks: z.array(insightBlockSchema).min(1, "At least one content block is required"),
});

export type InsightBlock = z.infer<typeof insightBlockSchema>;
export type StrictInsightContent = z.infer<typeof strictInsightContentSchema>;

export function isStrictInsightContent(value: unknown): value is StrictInsightContent {
  return strictInsightContentSchema.safeParse(value).success;
}

export function extractMediaIdsFromStrictContent(value: unknown): string[] {
  const parsed = strictInsightContentSchema.safeParse(value);
  if (!parsed.success) return [];

  return parsed.data.blocks
    .filter((block): block is Extract<InsightBlock, { type: "image" }> => block.type === "image")
    .map((block) => block.mediaId)
    .filter((id): id is string => Boolean(id));
}

