import { createHash } from "node:crypto";
import { db } from "@/lib/db";

export type DeviceType = "desktop" | "mobile" | "tablet" | "bot" | "unknown";

type TrackInput = {
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
};

type DateRange = {
  start: Date;
  end: Date;
};

type KpiValue = {
  today: number;
  last7Days: number;
  last30Days: number;
  delta7DaysPct: number;
  delta30DaysPct: number;
};

export type AnalyticsKpis = {
  views: KpiValue;
  uniqueVisitors: KpiValue;
  topPage30d: { path: string; views: number } | null;
  topReferrer30d: { referrer: string; visits: number } | null;
  deviceMix30d: {
    desktop: number;
    mobile: number;
    tablet: number;
    unknown: number;
  };
};

function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDaysUTC(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function getDayRange(day: Date): DateRange {
  const start = startOfDayUTC(day);
  const end = addDaysUTC(start, 1);
  return { start, end };
}

function getRollingRange(days: number): DateRange {
  const now = new Date();
  const todayStart = startOfDayUTC(now);
  return {
    start: addDaysUTC(todayStart, -(days - 1)),
    end: addDaysUTC(todayStart, 1),
  };
}

function getPreviousRange(days: number): DateRange {
  const current = getRollingRange(days);
  return {
    start: addDaysUTC(current.start, -days),
    end: current.start,
  };
}

function pctDelta(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function getAnalyticsSalt(): string {
  const salt = process.env.ANALYTICS_SALT;
  if (!salt || !salt.trim()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ANALYTICS_SALT is required in production.");
    }
    return "spx-dev-analytics-salt-change-me";
  }
  return salt;
}

function safePath(path: string): string {
  if (!path.startsWith("/")) return "/";
  return path.split("?")[0] || "/";
}

export function shouldTrackPath(path: string): boolean {
  const cleanPath = safePath(path);
  if (
    cleanPath.startsWith("/admin") ||
    cleanPath.startsWith("/api") ||
    cleanPath.startsWith("/_next") ||
    cleanPath.startsWith("/assets") ||
    cleanPath.startsWith("/uploads") ||
    cleanPath === "/favicon.ico" ||
    cleanPath === "/robots.txt" ||
    cleanPath === "/sitemap.xml"
  ) {
    return false;
  }
  return true;
}

export function classifyDevice(userAgent?: string | null): DeviceType {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();

  if (ua.includes("bot") || ua.includes("crawler") || ua.includes("spider") || ua.includes("slurp")) {
    return "bot";
  }
  if (ua.includes("ipad") || ua.includes("tablet") || ua.includes("kindle")) {
    return "tablet";
  }
  if (ua.includes("mobi") || ua.includes("android") || ua.includes("iphone")) {
    return "mobile";
  }
  if (ua.includes("windows") || ua.includes("macintosh") || ua.includes("linux")) {
    return "desktop";
  }
  return "unknown";
}

export function hashVisitorIdentity(ipAddress?: string | null, userAgent?: string | null): string {
  const salt = getAnalyticsSalt();
  const payload = `${ipAddress || "0.0.0.0"}|${userAgent || "unknown"}|${salt}`;
  return createHash("sha256").update(payload).digest("hex");
}

export function sanitizeReferrer(referrer?: string | null): string | null {
  if (!referrer || !referrer.trim()) return null;
  try {
    const url = new URL(referrer);
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return null;
  }
}

export async function trackPageView(input: TrackInput): Promise<void> {
  const path = safePath(input.path);
  if (!shouldTrackPath(path)) return;

  const deviceType = classifyDevice(input.userAgent);
  if (deviceType === "bot") return;

  const date = startOfDayUTC(new Date());
  const visitorHash = hashVisitorIdentity(input.ipAddress, input.userAgent);
  const referrer = sanitizeReferrer(input.referrer);
  const pageScope = `page:${path}`;
  const siteScope = "site";

  await db.$transaction(async (tx) => {
    await tx.trafficEvent.create({
      data: {
        path,
        visitorHash,
        referrer,
        userAgent: input.userAgent || null,
        deviceType,
      },
    });

    await tx.trafficDailyPage.upsert({
      where: { date_path: { date, path } },
      create: { date, path, views: 1, uniqueVisitors: 0 },
      update: { views: { increment: 1 } },
    });

    await tx.trafficDailySite.upsert({
      where: { date },
      create: { date, views: 1, uniqueVisitors: 0 },
      update: { views: { increment: 1 } },
    });

    const pageVisitor = await tx.trafficVisitorDaily.findUnique({
      where: {
        date_scope_visitorHash: {
          date,
          scope: pageScope,
          visitorHash,
        },
      },
    });

    if (!pageVisitor) {
      await tx.trafficVisitorDaily.create({
        data: { date, scope: pageScope, visitorHash },
      });
      await tx.trafficDailyPage.update({
        where: { date_path: { date, path } },
        data: { uniqueVisitors: { increment: 1 } },
      });
    }

    const siteVisitor = await tx.trafficVisitorDaily.findUnique({
      where: {
        date_scope_visitorHash: {
          date,
          scope: siteScope,
          visitorHash,
        },
      },
    });

    if (!siteVisitor) {
      await tx.trafficVisitorDaily.create({
        data: { date, scope: siteScope, visitorHash },
      });
      await tx.trafficDailySite.update({
        where: { date },
        data: { uniqueVisitors: { increment: 1 } },
      });
    }
  });
}

export async function getTrafficSummary(range: DateRange): Promise<{ views: number; uniqueVisitors: number }> {
  const [viewsAgg, uniqueAgg] = await Promise.all([
    db.trafficDailySite.aggregate({
      _sum: { views: true },
      where: { date: { gte: range.start, lt: range.end } },
    }),
    db.trafficVisitorDaily.count({
      where: {
        scope: "site",
        date: { gte: range.start, lt: range.end },
      },
    }),
  ]);

  return {
    views: viewsAgg._sum.views ?? 0,
    uniqueVisitors: uniqueAgg,
  };
}

export async function getTopPages(range: DateRange, limit = 10): Promise<Array<{ path: string; views: number }>> {
  const rows = await db.trafficDailyPage.groupBy({
    by: ["path"],
    _sum: { views: true },
    where: { date: { gte: range.start, lt: range.end } },
    orderBy: { _sum: { views: "desc" } },
    take: limit,
  });

  return rows.map((row) => ({ path: row.path, views: row._sum.views ?? 0 }));
}

export async function getTopReferrers(range: DateRange, limit = 10): Promise<Array<{ referrer: string; visits: number }>> {
  const rows = await db.trafficEvent.groupBy({
    by: ["referrer"],
    _count: { _all: true },
    where: {
      createdAt: { gte: range.start, lt: range.end },
      referrer: { not: null },
    },
    orderBy: { _count: { referrer: "desc" } },
    take: limit,
  });

  return rows
    .filter((row) => row.referrer)
    .map((row) => ({ referrer: row.referrer as string, visits: row._count._all }));
}

export async function getDeviceBreakdown(range: DateRange): Promise<Array<{ device: string; visits: number }>> {
  const rows = await db.trafficEvent.groupBy({
    by: ["deviceType"],
    _count: { _all: true },
    where: { createdAt: { gte: range.start, lt: range.end } },
    orderBy: { _count: { deviceType: "desc" } },
  });

  return rows.map((row) => ({ device: row.deviceType || "unknown", visits: row._count._all }));
}

export async function getDailyTrend(range: DateRange): Promise<Array<{ date: string; views: number; uniqueVisitors: number }>> {
  const rows = await db.trafficDailySite.findMany({
    where: { date: { gte: range.start, lt: range.end } },
    orderBy: { date: "asc" },
    select: { date: true, views: true, uniqueVisitors: true },
  });

  return rows.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    views: row.views,
    uniqueVisitors: row.uniqueVisitors,
  }));
}

export async function getKpiMetrics(): Promise<AnalyticsKpis> {
  const todayRange = getDayRange(new Date());
  const last7Range = getRollingRange(7);
  const last30Range = getRollingRange(30);
  const prev7Range = getPreviousRange(7);
  const prev30Range = getPreviousRange(30);

  const [today, last7, last30, prev7, prev30, topPages30d, topReferrers30d, devices30d] = await Promise.all([
    getTrafficSummary(todayRange),
    getTrafficSummary(last7Range),
    getTrafficSummary(last30Range),
    getTrafficSummary(prev7Range),
    getTrafficSummary(prev30Range),
    getTopPages(last30Range, 1),
    getTopReferrers(last30Range, 1),
    getDeviceBreakdown(last30Range),
  ]);

  const totalDeviceVisits = devices30d.reduce((sum, item) => sum + item.visits, 0);
  const deviceVisits = {
    desktop: 0,
    mobile: 0,
    tablet: 0,
    unknown: 0,
  };

  for (const row of devices30d) {
    if (row.device === "desktop") deviceVisits.desktop += row.visits;
    else if (row.device === "mobile") deviceVisits.mobile += row.visits;
    else if (row.device === "tablet") deviceVisits.tablet += row.visits;
    else deviceVisits.unknown += row.visits;
  }

  const deviceMix30d = {
    desktop: totalDeviceVisits ? Math.round((deviceVisits.desktop / totalDeviceVisits) * 100) : 0,
    mobile: totalDeviceVisits ? Math.round((deviceVisits.mobile / totalDeviceVisits) * 100) : 0,
    tablet: totalDeviceVisits ? Math.round((deviceVisits.tablet / totalDeviceVisits) * 100) : 0,
    unknown: totalDeviceVisits ? Math.round((deviceVisits.unknown / totalDeviceVisits) * 100) : 0,
  };

  return {
    views: {
      today: today.views,
      last7Days: last7.views,
      last30Days: last30.views,
      delta7DaysPct: pctDelta(last7.views, prev7.views),
      delta30DaysPct: pctDelta(last30.views, prev30.views),
    },
    uniqueVisitors: {
      today: today.uniqueVisitors,
      last7Days: last7.uniqueVisitors,
      last30Days: last30.uniqueVisitors,
      delta7DaysPct: pctDelta(last7.uniqueVisitors, prev7.uniqueVisitors),
      delta30DaysPct: pctDelta(last30.uniqueVisitors, prev30.uniqueVisitors),
    },
    topPage30d: topPages30d[0] ?? null,
    topReferrer30d: topReferrers30d[0] ?? null,
    deviceMix30d,
  };
}

export function getRangeForDays(days: number): DateRange {
  return getRollingRange(days);
}
