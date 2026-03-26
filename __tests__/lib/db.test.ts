/* Phase 2: Unit tests for Prisma singleton wiring */
describe("lib/db (Prisma singleton)", () => {
  beforeEach(() => {
    // @ts-expect-error - test-only setup
    globalThis.__spx_prisma = undefined;
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // Ensure the global singleton doesn't leak across tests.
    // @ts-expect-error - test-only cleanup
    globalThis.__spx_prisma = undefined;
  });

  it("returns the same instance across calls", async () => {
    jest.doMock("@prisma/client", () => {
      class PrismaClient {
        static instances = 0;
        constructor() {
          // @ts-expect-error - test-only property
          PrismaClient.instances += 1;
        }
      }
      return { PrismaClient };
    });

    const mod = await import("@/lib/db");
    expect(mod.getPrismaClient()).toBe(mod.getPrismaClient());
  });

  it("does not create multiple PrismaClient instances", async () => {
    let constructed = 0;
    jest.doMock("@prisma/client", () => {
      class PrismaClient {
        constructor() {
          constructed += 1;
        }
      }
      return { PrismaClient };
    });

    // @ts-expect-error - test-only setup
    globalThis.__spx_prisma = undefined;
    const mod = await import("@/lib/db");
    mod.getPrismaClient();
    mod.getPrismaClient();
    // One constructor call may happen at module import time (export const prisma = ...).
    expect(constructed).toBe(1);
  });
});

