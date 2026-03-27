import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const destination = `/newsletter/unsubscribe/${encodeURIComponent(token)}`;
  const url = new URL(destination, request.url);
  return NextResponse.redirect(url);
}
