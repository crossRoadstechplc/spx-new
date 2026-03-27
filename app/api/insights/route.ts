import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const requestedLimit = Number(searchParams.get("limit") || String(DEFAULT_LIMIT));
  const limit = Math.min(MAX_LIMIT, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;

  const insights = await db.insight.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    skip,
    take: limit + 1,
    include: {
      author: {
        select: { name: true },
      },
      coverImage: {
        select: { url: true, alt: true, filename: true },
      },
      category: {
        select: { name: true },
      },
      tags: {
        include: {
          tag: {
            select: { name: true },
          },
        },
      },
    },
  });

  const hasMore = insights.length > limit;
  const pageItems = hasMore ? insights.slice(0, limit) : insights;

  return NextResponse.json({
    items: pageItems.map((item) => ({
      ...item,
      publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
    })),
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  });
}
