import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, BarChart3, ExternalLink, Globe, MousePointerClick, Users } from "lucide-react";
import { getDailyTrend, getDeviceBreakdown, getKpiMetrics, getRangeForDays, getTopPages, getTopReferrers } from "@/lib/analytics";

export const metadata = {
  title: "Analytics | SPX Admin",
  description: "Website traffic analytics and KPI dashboard.",
};

function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function DeltaBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
        positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {formatPercent(value)}
    </span>
  );
}

function KpiCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      {children}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const range30 = getRangeForDays(30);

  const [kpis, topPages, topReferrers, dailyTrend, deviceBreakdown] = await Promise.all([
    getKpiMetrics(),
    getTopPages(range30, 10),
    getTopReferrers(range30, 10),
    getDailyTrend(range30),
    getDeviceBreakdown(range30),
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Website Analytics</h1>
        <p className="text-muted-foreground">
          Persistent traffic metrics across page views, unique visitors, referrers, and device mix.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Views" icon={<MousePointerClick className="h-5 w-5" />}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Today</span>
              <span className="font-semibold">{kpis.views.today.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last 7 days</span>
              <span className="font-semibold">{kpis.views.last7Days.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last 30 days</span>
              <span className="font-semibold">{kpis.views.last30Days.toLocaleString()}</span>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>7d vs previous 7d</span>
                <DeltaBadge value={kpis.views.delta7DaysPct} />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>30d vs previous 30d</span>
                <DeltaBadge value={kpis.views.delta30DaysPct} />
              </div>
            </div>
          </div>
        </KpiCard>

        <KpiCard title="Unique Visitors" icon={<Users className="h-5 w-5" />}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Today</span>
              <span className="font-semibold">{kpis.uniqueVisitors.today.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last 7 days</span>
              <span className="font-semibold">{kpis.uniqueVisitors.last7Days.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last 30 days</span>
              <span className="font-semibold">{kpis.uniqueVisitors.last30Days.toLocaleString()}</span>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>7d vs previous 7d</span>
                <DeltaBadge value={kpis.uniqueVisitors.delta7DaysPct} />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>30d vs previous 30d</span>
                <DeltaBadge value={kpis.uniqueVisitors.delta30DaysPct} />
              </div>
            </div>
          </div>
        </KpiCard>

        <KpiCard title="Top Performing" icon={<BarChart3 className="h-5 w-5" />}>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Top page (30d)</p>
              {kpis.topPage30d ? (
                <div className="mt-1 flex items-center justify-between gap-3">
                  <Link href={kpis.topPage30d.path} className="truncate font-medium hover:underline">
                    {kpis.topPage30d.path}
                  </Link>
                  <span className="text-xs text-muted-foreground">{kpis.topPage30d.views} views</span>
                </div>
              ) : (
                <p className="mt-1 text-muted-foreground">No data yet.</p>
              )}
            </div>

            <div>
              <p className="text-muted-foreground">Top referrer (30d)</p>
              {kpis.topReferrer30d ? (
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="truncate font-medium">{kpis.topReferrer30d.referrer}</span>
                  <span className="text-xs text-muted-foreground">{kpis.topReferrer30d.visits} visits</span>
                </div>
              ) : (
                <p className="mt-1 text-muted-foreground">No referrers yet.</p>
              )}
            </div>

            <div>
              <p className="text-muted-foreground">Device mix (30d)</p>
              <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                <span>Desktop: {kpis.deviceMix30d.desktop}%</span>
                <span>Mobile: {kpis.deviceMix30d.mobile}%</span>
                <span>Tablet: {kpis.deviceMix30d.tablet}%</span>
                <span>Unknown: {kpis.deviceMix30d.unknown}%</span>
              </div>
            </div>
          </div>
        </KpiCard>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Pages (30 days)</h2>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          {topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tracked page views yet.</p>
          ) : (
            <div className="space-y-2">
              {topPages.map((row) => (
                <div key={row.path} className="flex items-center justify-between rounded-md border border-border/70 p-2 text-sm">
                  <Link href={row.path} className="truncate font-medium hover:underline">
                    {row.path}
                  </Link>
                  <span className="text-muted-foreground">{row.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Referrers (30 days)</h2>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          {topReferrers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No referrer data yet.</p>
          ) : (
            <div className="space-y-2">
              {topReferrers.map((row) => (
                <div
                  key={row.referrer}
                  className="flex items-center justify-between rounded-md border border-border/70 p-2 text-sm"
                >
                  <span className="truncate font-medium">{row.referrer}</span>
                  <span className="text-muted-foreground">{row.visits.toLocaleString()} visits</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Daily Traffic Trend (30 days)</h2>
          {dailyTrend.length === 0 ? (
            <p className="text-sm text-muted-foreground">No daily trend data yet.</p>
          ) : (
            <div className="space-y-2">
              {dailyTrend.map((row) => (
                <div key={row.date} className="flex items-center justify-between border-b border-border/60 pb-2 text-sm last:border-b-0">
                  <span className="text-muted-foreground">{row.date}</span>
                  <div className="flex items-center gap-4">
                    <span>{row.views} views</span>
                    <span>{row.uniqueVisitors} unique</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Device Breakdown (30 days)</h2>
          {deviceBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">No device data yet.</p>
          ) : (
            <div className="space-y-2">
              {deviceBreakdown.map((row) => (
                <div key={row.device} className="flex items-center justify-between border-b border-border/60 pb-2 text-sm last:border-b-0">
                  <span className="capitalize text-muted-foreground">{row.device}</span>
                  <span>{row.visits.toLocaleString()} visits</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
