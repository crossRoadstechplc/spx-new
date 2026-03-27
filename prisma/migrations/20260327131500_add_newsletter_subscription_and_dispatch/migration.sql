-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "subscribedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InsightEmailDispatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "insightId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InsightEmailDispatch_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "Insight" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InsightEmailDispatch_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_status_idx" ON "NewsletterSubscriber"("status");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_createdAt_idx" ON "NewsletterSubscriber"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InsightEmailDispatch_insightId_subscriberId_key" ON "InsightEmailDispatch"("insightId", "subscriberId");

-- CreateIndex
CREATE INDEX "InsightEmailDispatch_insightId_idx" ON "InsightEmailDispatch"("insightId");

-- CreateIndex
CREATE INDEX "InsightEmailDispatch_subscriberId_idx" ON "InsightEmailDispatch"("subscriberId");

-- CreateIndex
CREATE INDEX "InsightEmailDispatch_sentAt_idx" ON "InsightEmailDispatch"("sentAt");
