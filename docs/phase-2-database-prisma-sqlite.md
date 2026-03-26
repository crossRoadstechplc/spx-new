# Phase 2: Database (Prisma + SQLite)

## Overview
Phase 2 adds a production-oriented database layer using Prisma ORM with SQLite for local development, designed to remain migration-friendly when moving to PostgreSQL later.

## What Was Completed
- **Prisma foundation (Phase 2)**: Added `prisma/schema.prisma` with an `Insight` model.
- **Canonical editor storage (Phase 2)**: `Insight.contentJson` stores Tiptap JSON as the source of truth (never HTML-only).
- **Optional HTML cache (Phase 2)**: `Insight.contentHtml` exists only as a non-canonical optimization path for public rendering.
- **Prisma client singleton (Phase 2)**: Added `lib/db.ts` with a safe singleton pattern for Next.js dev/hot reload.
- **Seed script (Phase 2)**: Added `prisma/seed.ts` with a draft “Welcome to SPX” Insight entry.

## Commands
After you copy `.env.example` to `.env.local`:

```bash
npm run db:generate
npx prisma migrate dev --name init
npm run db:seed
```

## Environment Variables
- **`DATABASE_URL` (Phase 2)**: SQLite connection string (e.g. `file:./dev.db`)

## Ready for Next Phase
Next is **Phase 3 (Authentication)** for a secure admin login, followed by **Phase 4 (Public pages + navigation shell)** and **Phase 6 (Admin Insights editor with Tiptap)**.

