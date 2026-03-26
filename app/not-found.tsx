/* Phase 7: Custom 404 page */
import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          404 Error
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Contact Us
        </Link>
      </div>
    </main>
  );
}
