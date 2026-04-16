import { db } from "@/lib/db";

export const metadata = {
  title: "Newsletter",
  description: "Newsletter subscribers and delivery tracking.",
};

async function getNewsletterStats() {
  const [activeSubscribers, unsubscribedSubscribers, totalDispatches] = await Promise.all([
    db.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
    db.newsletterSubscriber.count({ where: { status: "UNSUBSCRIBED" } }),
    db.insightEmailDispatch.count(),
  ]);

  return {
    activeSubscribers,
    unsubscribedSubscribers,
    totalDispatches,
  };
}

export default async function AdminNewsletterPage() {
  const [stats, subscribers] = await Promise.all([
    getNewsletterStats(),
    db.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        email: true,
        status: true,
        subscribedAt: true,
        unsubscribedAt: true,
        createdAt: true,
        _count: {
          select: { dispatches: true },
        },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
        <p className="mt-2 text-muted-foreground">
          Manage subscribers and track insight email deliveries.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Active Subscribers" value={stats.activeSubscribers} />
        <StatCard label="Unsubscribed" value={stats.unsubscribedSubscribers} />
        <StatCard label="Emails Sent" value={stats.totalDispatches} />
      </div>

      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Recent Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Subscribed</th>
                  <th className="px-3 py-2">Unsubscribed</th>
                  <th className="px-3 py-2">Emails Sent</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-border/60 last:border-b-0">
                    <td className="px-3 py-2 font-medium">{subscriber.email}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          subscriber.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {new Date(subscriber.subscribedAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {subscriber.unsubscribedAt
                        ? new Date(subscriber.unsubscribedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{subscriber._count.dispatches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
