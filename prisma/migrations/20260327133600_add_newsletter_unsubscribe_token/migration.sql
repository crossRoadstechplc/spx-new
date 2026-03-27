-- RedefineTable
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsletterSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "unsubscribeToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "subscribedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_NewsletterSubscriber" ("createdAt", "email", "id", "status", "subscribedAt", "unsubscribedAt", "updatedAt", "unsubscribeToken")
SELECT "createdAt", "email", "id", "status", "subscribedAt", "unsubscribedAt", "updatedAt", lower(hex(randomblob(16)))
FROM "NewsletterSubscriber";
DROP TABLE "NewsletterSubscriber";
ALTER TABLE "new_NewsletterSubscriber" RENAME TO "NewsletterSubscriber";
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");
CREATE INDEX "NewsletterSubscriber_status_idx" ON "NewsletterSubscriber"("status");
CREATE INDEX "NewsletterSubscriber_createdAt_idx" ON "NewsletterSubscriber"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
