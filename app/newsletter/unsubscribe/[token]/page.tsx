import Link from "next/link";
import { unsubscribeFromNewsletter } from "@/lib/newsletter";

export const metadata = {
  title: "Newsletter Preferences | SPX",
  description: "Manage your SPX newsletter subscription preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

interface UnsubscribePageProps {
  params: Promise<{ token: string }>;
}

export default async function NewsletterUnsubscribePage({ params }: UnsubscribePageProps) {
  const { token } = await params;
  const result = await unsubscribeFromNewsletter(token);

  const message =
    result === "unsubscribed"
      ? "You have been unsubscribed from SPX insight emails."
      : "This unsubscribe link is invalid or has expired.";

  return (
    <main className="min-h-[60vh] bg-muted/20 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">SPX Newsletter</h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
        <div className="mt-8">
          <Link href="/" className="text-primary font-medium hover:underline">
            Return to SPX website
          </Link>
        </div>
      </div>
    </main>
  );
}
