// Phase 2: Prisma client singleton (safe for Next.js hot reload)
import { PrismaClient } from "@prisma/client";

declare global {
  var __spx_prisma: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (globalThis.__spx_prisma) return globalThis.__spx_prisma;
  globalThis.__spx_prisma = new PrismaClient();
  return globalThis.__spx_prisma;
}

export const prisma = getPrismaClient();
export const db = prisma; // Alias for consistency

