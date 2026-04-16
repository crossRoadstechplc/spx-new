"use client";

import { FormEvent, useState } from "react";
import { Container, SectionIntro } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as { success: boolean; message: string };

      if (!response.ok || !payload.success) {
        setFeedback({
          type: "error",
          message: payload.message || "Unable to subscribe right now. Please try again.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: payload.message || "You are registered and will be notified when new insights are published.",
      });
      setEmail("");
    } catch (error) {
      console.error("Newsletter submit failed:", error);
      setFeedback({
        type: "error",
        message: "Unable to subscribe right now. Please try again shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40">
      <Container size="narrow">
        <SectionIntro
          align="center"
          eyebrow="Newsletter"
          title="Get SPX Insights in Your Inbox"
          description="Subscribe for notes, updates, and perspectives from our team."
        />

        <form className="mx-auto mt-8 max-w-xl" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your work email"
              aria-label="Email address"
              className="h-11"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isSubmitting}
            />
            <Button type="submit" size="lg" className="sm:min-w-40" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          
          {feedback ? (
            <p
              className={`mt-3 text-center text-sm ${
                feedback.type === "success" ? "text-green-600" : "text-destructive"
              }`}
            >
              {feedback.message}
            </p>
          ) : null}
        </form>
      </Container>
    </section>
  );
}
