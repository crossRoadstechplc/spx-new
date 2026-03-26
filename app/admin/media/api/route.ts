/* Phase 6: Media API endpoint for editor media selector */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const media = await db.media.findMany({
      where: { type: "IMAGE" },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Media API error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
