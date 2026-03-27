import { db } from "@/lib/db";
import { sendInsightAnnouncement, sendNewsletterWelcome } from "@/lib/mailer";

export type SubscribeResult = {
  status: "subscribed" | "already_subscribed";
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  const normalized = normalizeEmail(email);
  const existing = await db.newsletterSubscriber.findUnique({
    where: { email: normalized },
    select: { id: true, status: true, unsubscribeToken: true },
  });

  if (existing && existing.status === "ACTIVE") {
    return { status: "already_subscribed" };
  }

  let unsubscribeToken = existing?.unsubscribeToken ?? null;

  if (existing) {
    const updated = await db.newsletterSubscriber.update({
      where: { id: existing.id },
      data: {
        status: "ACTIVE",
        subscribedAt: new Date(),
        unsubscribedAt: null,
      },
      select: { unsubscribeToken: true },
    });
    unsubscribeToken = updated.unsubscribeToken;
  } else {
    const created = await db.newsletterSubscriber.create({
      data: {
        email: normalized,
        status: "ACTIVE",
      },
      select: { unsubscribeToken: true },
    });
    unsubscribeToken = created.unsubscribeToken;
  }

  sendNewsletterWelcome(normalized, unsubscribeToken).catch((error) => {
    console.error("Failed to send newsletter welcome email:", error);
  });

  return { status: "subscribed" };
}

export async function notifySubscribersForInsight(insightId: string): Promise<void> {
  const insight = await db.insight.findUnique({
    where: { id: insightId },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      status: true,
      publishedAt: true,
    },
  });

  if (!insight || insight.status !== "PUBLISHED") {
    return;
  }

  const subscribers = await db.newsletterSubscriber.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, email: true, unsubscribeToken: true },
  });

  if (subscribers.length === 0) {
    return;
  }

  const alreadyDispatched = await db.insightEmailDispatch.findMany({
    where: { insightId: insight.id },
    select: { subscriberId: true },
  });
  const alreadySentIds = new Set(alreadyDispatched.map((row) => row.subscriberId));
  const pendingSubscribers = subscribers.filter((subscriber) => !alreadySentIds.has(subscriber.id));

  if (pendingSubscribers.length === 0) {
    return;
  }

  const BATCH_SIZE = 20;
  const BATCH_DELAY_MS = 400;
  for (let start = 0; start < pendingSubscribers.length; start += BATCH_SIZE) {
    const batch = pendingSubscribers.slice(start, start + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (subscriber) => {
        const sent = await sendInsightAnnouncement(
          subscriber.email,
          {
            title: insight.title,
            excerpt: insight.excerpt,
            slug: insight.slug,
          },
          subscriber.unsubscribeToken
        );

        if (!sent) {
          return;
        }

        try {
          await db.insightEmailDispatch.create({
            data: {
              insightId: insight.id,
              subscriberId: subscriber.id,
            },
          });
        } catch (error) {
          console.error("Failed to create insight dispatch record:", error);
        }
      })
    );

    const hasRemaining = start + BATCH_SIZE < pendingSubscribers.length;
    if (hasRemaining) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }
}

export async function unsubscribeFromNewsletter(token: string): Promise<"unsubscribed" | "not_found"> {
  const normalizedToken = token.trim();
  if (!normalizedToken) {
    return "not_found";
  }

  const updated = await db.newsletterSubscriber.updateMany({
    where: {
      unsubscribeToken: normalizedToken,
      status: "ACTIVE",
    },
    data: {
      status: "UNSUBSCRIBED",
      unsubscribedAt: new Date(),
    },
  });

  if (updated.count > 0) {
    return "unsubscribed";
  }

  const existing = await db.newsletterSubscriber.findUnique({
    where: { unsubscribeToken: normalizedToken },
    select: { id: true },
  });

  return existing ? "unsubscribed" : "not_found";
}
