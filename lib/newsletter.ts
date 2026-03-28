import { db } from "@/lib/db";
import {
  getNewsletterEnvelopeTo,
  sendInsightAnnouncementBcc,
  sendNewsletterWelcome,
} from "@/lib/mailer";

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

/**
 * Removes per-subscriber send records so the next transition to PUBLISHED
 * can notify everyone again (e.g. draft → publish → draft → publish).
 */
export async function clearInsightEmailDispatches(insightId: string): Promise<void> {
  await db.insightEmailDispatch.deleteMany({ where: { insightId } });
}

export async function notifySubscribersForInsight(insightId: string): Promise<void> {
  if (process.env.E2E_SKIP_EMAIL === "1") {
    return;
  }

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

  const appUrl = (process.env.APP_URL || "http://localhost:3002").replace(
    /\/$/,
    ""
  );
  const genericUnsubscribeUrl = `${appUrl}/newsletter/unsubscribe-email`;
  const envelopeTo = getNewsletterEnvelopeTo();

  const configured = parseInt(
    process.env.NEWSLETTER_BCC_BATCH_SIZE || "0",
    10
  );
  const chunkSize =
    Number.isFinite(configured) && configured > 0
      ? configured
      : pendingSubscribers.length;

  const batches = chunkArray(pendingSubscribers, chunkSize);

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    const bccEmails = batch.map((s) => s.email);

    const sent = await sendInsightAnnouncementBcc(
      envelopeTo,
      bccEmails,
      {
        title: insight.title,
        excerpt: insight.excerpt,
        slug: insight.slug,
      },
      genericUnsubscribeUrl
    );

    if (!sent) {
      console.error(
        "Insight newsletter BCC send failed for batch",
        b + 1,
        "of",
        batches.length
      );
      continue;
    }

    try {
      await db.insightEmailDispatch.createMany({
        data: batch.map((subscriber) => ({
          insightId: insight.id,
          subscriberId: subscriber.id,
        })),
      });
    } catch (error) {
      console.error("Failed to create insight dispatch records:", error);
    }

    if (b < batches.length - 1) {
      const delay = parseInt(
        process.env.NEWSLETTER_BCC_BATCH_DELAY_MS || "400",
        10
      );
      await new Promise((r) =>
        setTimeout(r, Number.isFinite(delay) && delay >= 0 ? delay : 400)
      );
    }
  }
}

function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0 || arr.length === 0) {
    return [arr];
  }
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    out.push(arr.slice(i, i + chunkSize));
  }
  return out;
}

/**
 * Unsubscribe using the email address (for use from BCC broadcast emails where
 * per-recipient token links are not included).
 */
export async function unsubscribeByEmail(
  email: string
): Promise<"unsubscribed" | "not_found"> {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return "not_found";
  }

  const updated = await db.newsletterSubscriber.updateMany({
    where: {
      email: normalized,
      status: "ACTIVE",
    },
    data: {
      status: "UNSUBSCRIBED",
      unsubscribedAt: new Date(),
    },
  });

  return updated.count > 0 ? "unsubscribed" : "not_found";
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
