import type { Metadata } from "next";
import { UnsubscribeEmailForm } from "./unsubscribe-email-form";

export const metadata: Metadata = {
  title: {
    absolute: "Unsubscribe | SPX Newsletter",
  },
  description: "Unsubscribe from SPX insight announcement emails.",
  robots: { index: false, follow: false },
};

export default function NewsletterUnsubscribeEmailPage() {
  return (
    <main className="min-h-[60vh] bg-muted/20 px-4 py-16">
      <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Unsubscribe</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the email you used to subscribe. We will remove you from insight
          announcement emails.
        </p>
        <div className="mt-8">
          <UnsubscribeEmailForm />
        </div>
        <p className="mt-8 text-xs text-muted-foreground border-t border-border pt-6">
          One-click unsubscribe from an older email? Use the link in that
          message (it contains your private token).
        </p>
      </div>
    </main>
  );
}
