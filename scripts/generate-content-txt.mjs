/**
 * Builds root content.txt from every app page.tsx file plus published insights (CMS body).
 * Plain text only: strips JSX/HTML-like fragments from string literals. No network required.
 *
 * Usage: node scripts/generate-content-txt.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = join(__dirname, "..");
const appRoot = join(repoRoot, "app");

function loadDotenv() {
  const envPath = join(repoRoot, ".env");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadDotenv();

function walkPageTsx(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "api" || name.startsWith("_")) continue;
      walkPageTsx(p, out);
    } else if (name === "page.tsx") {
      out.push(p);
    }
  }
  return out;
}

function routeFromPath(absPath) {
  const rel = relative(appRoot, absPath).replace(/\\/g, "/");
  const segs = rel.replace(/\/page\.tsx$/, "").split("/").filter(Boolean);
  if (segs.length === 0) return "/";
  return "/" + segs.join("/");
}

function decodeJsString(s) {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function stripAngleMarkup(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/<Link[^>]*>/gi, " ")
    .replace(/<\/Link>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanLine(s) {
  const t = stripAngleMarkup(decodeJsString(s));
  if (t.length < 2) return null;
  if (/^[:)(}{[\]]+$/.test(t)) return null;
  if (t === ") : (" || t.match(/^\)\s*:\s*\($/)) return null;
  return t;
}

function extractMetadataTitle(src) {
  const abs = src.match(/title:\s*\{\s*absolute:\s*["']([^"']+)["']/);
  if (abs) return stripAngleMarkup(decodeJsString(abs[1]));
  const metaBlock = src.match(/export\s+const\s+metadata[^=]*=\s*\{([\s\S]*?)\n\};/);
  const block = metaBlock ? metaBlock[1] : src;
  const t1 = block.match(/title:\s*["']([^"']+)["']/);
  if (t1) return stripAngleMarkup(decodeJsString(t1[1]));
  const t2 = block.match(/title:\s*`([^`]+)`/);
  if (t2) return stripAngleMarkup(decodeJsString(t2[1]));
  const gen = src.match(/return\s*\{[\s\S]*?title:\s*["']([^"']+)["']/);
  if (gen) return stripAngleMarkup(decodeJsString(gen[1]));
  return null;
}

function extractStrings(src) {
  const texts = [];
  const propRe =
    /(?:title|description|eyebrow|label|placeholder|imageAlt|alt|aria-label|summary|message|subtitle)\s*=\s*(["'])((?:\\\1|.)*?)\1/g;
  let m;
  while ((m = propRe.exec(src)) !== null) {
    const v = cleanLine(m[2]);
    if (
      v &&
      !v.startsWith("/") &&
      !v.startsWith("http") &&
      !v.includes("className") &&
      !v.includes("proseBodyClass")
    ) {
      texts.push(v);
    }
  }

  const pairRe =
    /title:\s*["']((?:\\.|[^'"\\])*)["']\s*,\s*description:\s*["']((?:\\.|[^'"\\])*)["']/g;
  while ((m = pairRe.exec(src)) !== null) {
    const a = cleanLine(m[1]);
    const b = cleanLine(m[2]);
    if (a) texts.push(a);
    if (b) texts.push(b);
  }

  const betweenRe = />\s*([^<>{}\n]+?)\s*</g;
  while ((m = betweenRe.exec(src)) !== null) {
    const v = cleanLine(m[1]);
    if (v && v.length > 2) texts.push(v);
  }

  const pRe = /<p[^>]*>\s*([\s\S]*?)\s*<\/p>/g;
  while ((m = pRe.exec(src)) !== null) {
    let inner = m[1].replace(/\{[^}]+\}/g, " ").replace(/\s+/g, " ").trim();
    inner = inner.replace(/^[^{]*\{[^}]*\}[^}]*/g, "").trim();
    const v = stripAngleMarkup(inner);
    if (v.length > 8 && !v.includes("className")) texts.push(v);
  }

  const hRe = /<h[1-6][^>]*>\s*([\s\S]*?)\s*<\/h[1-6]>/g;
  while ((m = hRe.exec(src)) !== null) {
    const v = cleanLine(m[1].replace(/\{[^}]+\}/g, " ").replace(/\s+/g, " ").trim());
    if (v && v.length > 2) texts.push(v);
  }

  const seen = new Set();
  const ordered = [];
  for (const t of texts) {
    if (!seen.has(t)) {
      seen.add(t);
      ordered.push(t);
    }
  }
  return ordered;
}

function tiptapDocToPlain(doc) {
  if (!doc || typeof doc !== "object") return "";
  const chunks = [];

  function walk(node) {
    if (!node || typeof node !== "object") return;
    const t = node.type;
    if (t === "text" && typeof node.text === "string") {
      chunks.push(node.text);
      return;
    }
    if (t === "hardBreak") {
      chunks.push("\n");
      return;
    }
    if (t === "image") {
      const alt = node.attrs && typeof node.attrs.alt === "string" ? node.attrs.alt.trim() : "";
      if (alt) chunks.push("\n", alt, "\n");
      return;
    }
    if (t === "horizontalRule") {
      chunks.push("\n---\n");
      return;
    }
    if (!Array.isArray(node.content)) return;

    const isBlock =
      t === "paragraph" ||
      t === "heading" ||
      t === "blockquote" ||
      t === "listItem" ||
      t === "codeBlock";

    for (const child of node.content) {
      walk(child);
    }
    if (isBlock) chunks.push("\n\n");
  }

  if (doc.type === "doc" && Array.isArray(doc.content)) {
    for (const n of doc.content) walk(n);
  } else {
    walk(doc);
  }

  return chunks
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function strictBlocksToPlain(value) {
  if (!value || typeof value !== "object" || value.version !== 2 || !Array.isArray(value.blocks)) {
    return "";
  }
  const parts = [];
  for (const b of value.blocks) {
    switch (b.type) {
      case "text":
        if (b.content) parts.push(String(b.content));
        break;
      case "image":
        if (b.caption) parts.push(String(b.caption));
        else if (b.alt) parts.push(String(b.alt));
        break;
      case "quote":
        parts.push(String(b.quote));
        if (b.attribution) parts.push(`— ${b.attribution}`);
        break;
      case "divider":
        parts.push("---");
        break;
      case "link":
        parts.push(String(b.label));
        break;
      case "video":
        if (b.caption) parts.push(String(b.caption));
        break;
      default:
        break;
    }
  }
  return parts.join("\n\n").trim();
}

function insightBodyToPlain(contentJson) {
  const j = contentJson;
  if (j && typeof j === "object" && j.version === 2 && Array.isArray(j.blocks)) {
    const s = strictBlocksToPlain(j);
    if (s) return s;
  }
  return tiptapDocToPlain(j);
}

function formatSection(title, body) {
  const text = (body || "").trim();
  return `${title.trim()}\n\n${text},\n`;
}

function isInsightsSlugPage(relFromApp) {
  return relFromApp.replace(/\\/g, "/") === "insights/[slug]/page.tsx";
}

async function main() {
  const prisma = new PrismaClient();
  const files = walkPageTsx(appRoot).sort((a, b) =>
    routeFromPath(a).localeCompare(routeFromPath(b)),
  );

  const sections = [];

  for (const file of files) {
    const relApp = relative(appRoot, file).replace(/\\/g, "/");
    if (isInsightsSlugPage(relApp)) continue;

    const route = routeFromPath(file);
    const src = readFileSync(file, "utf8");
    let title = extractMetadataTitle(src);
    if (!title) {
      title = route === "/" ? "SPX | Strategy-to-Implementation Platform" : `Untitled — ${route}`;
    }

    const strings = extractStrings(src);
    const body =
      strings.length > 0
        ? strings.join("\n\n")
        : "No extractable copy matched this extractor for page.tsx (content may live only in imported components).";

    sections.push({ sortKey: route, title, body });
  }

  const notFoundPath = join(appRoot, "not-found.tsx");
  if (existsSync(notFoundPath)) {
    const src = readFileSync(notFoundPath, "utf8");
    let title = extractMetadataTitle(src) || "Page Not Found";
    const strings = extractStrings(src);
    const body =
      strings.length > 0
        ? strings.join("\n\n")
        : "No extractable copy for not-found.tsx.";
    sections.push({ sortKey: "/not-found", title: `${title} (404)`, body });
  }

  const insights = await prisma.insight.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }],
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
  });

  for (const insight of insights) {
    const pageTitle = insight.metaTitle || insight.title;
    const bits = [];
    if (insight.excerpt) bits.push(insight.excerpt);
    const main = insightBodyToPlain(insight.contentJson);
    if (main) bits.push(main);
    const meta = [];
    if (insight.author?.name) meta.push(`By ${insight.author.name}`);
    if (insight.category?.name) meta.push(insight.category.name);
    if (insight.tags?.length) {
      meta.push(`Tags: ${insight.tags.map((t) => t.tag.name).join(", ")}`);
    }
    if (meta.length) bits.push(meta.join("\n"));
    const body = bits.join("\n\n").trim() || "(Empty body.)";
    sections.push({
      sortKey: `/insights/${insight.slug}`,
      title: pageTitle,
      body,
    });
  }

  await prisma.$disconnect();

  sections.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  let out = "";
  for (const s of sections) {
    out += formatSection(s.title, s.body);
    out += "\n";
  }

  const outPath = join(repoRoot, "content.txt");
  writeFileSync(outPath, out, "utf8");
  console.log(
    "Wrote",
    outPath,
    `(${sections.length} sections: ${files.length - 1} page routes, not-found, + ${insights.length} published insight(s))`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
