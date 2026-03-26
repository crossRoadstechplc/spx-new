/* Phase 4: Auth utilities tests */
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  authenticateUser,
  isAdmin,
  canEdit,
  requireAdmin,
  requireEditor,
} from "@/lib/auth";
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

// Mock db
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe("Password Utilities", () => {
  it("should hash a password", async () => {
    const password = "testpassword123";
    const hashed = await hashPassword(password);

    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(20);
  });

  it("should verify a correct password", async () => {
    const password = "testpassword123";
    const hashed = await hashPassword(password);

    const isValid = await verifyPassword(password, hashed);
    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "testpassword123";
    const wrongPassword = "wrongpassword";
    const hashed = await hashPassword(password);

    const isValid = await verifyPassword(wrongPassword, hashed);
    expect(isValid).toBe(false);
  });
});

describe("Session Token Generation", () => {
  it("should generate a session token", () => {
    const token = generateSessionToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should generate unique tokens", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();

    expect(token1).not.toBe(token2);
  });
});

describe("authenticateUser", () => {
  const mockUser: User = {
    id: "user-123",
    email: "test@spx.com",
    passwordHash: "$2a$12$abcdefghijklmnopqrstuv", // Mock hash
    name: "Test User",
    role: "EDITOR",
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if user not found", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await authenticateUser("test@spx.com", "password");
    expect(result).toBeNull();
  });

  it("should return null if user is inactive", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockUser,
      isActive: false,
    });

    const result = await authenticateUser("test@spx.com", "password");
    expect(result).toBeNull();
  });

  it("should return null if password is incorrect", async () => {
    const hashedPassword = await hashPassword("correctpassword");
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockUser,
      passwordHash: hashedPassword,
    });

    const result = await authenticateUser("test@spx.com", "wrongpassword");
    expect(result).toBeNull();
  });

  it("should return user if authentication succeeds", async () => {
    const password = "correctpassword";
    const hashedPassword = await hashPassword(password);
    (db.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockUser,
      passwordHash: hashedPassword,
    });

    const result = await authenticateUser("test@spx.com", password);
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@spx.com");
  });
});

describe("Authorization Helpers", () => {
  const adminUser: User = {
    id: "admin-123",
    email: "admin@spx.com",
    passwordHash: "hash",
    name: "Admin",
    role: "ADMIN",
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const editorUser: User = {
    ...adminUser,
    id: "editor-123",
    email: "editor@spx.com",
    name: "Editor",
    role: "EDITOR",
  };

  describe("isAdmin", () => {
    it("should return true for admin user", () => {
      expect(isAdmin(adminUser)).toBe(true);
    });

    it("should return false for editor user", () => {
      expect(isAdmin(editorUser)).toBe(false);
    });
  });

  describe("canEdit", () => {
    it("should return true for admin user", () => {
      expect(canEdit(adminUser)).toBe(true);
    });

    it("should return true for editor user", () => {
      expect(canEdit(editorUser)).toBe(true);
    });
  });

  describe("requireAdmin", () => {
    it("should throw if user is null", () => {
      expect(() => requireAdmin(null)).toThrow("Authentication required");
    });

    it("should throw if user is not admin", () => {
      expect(() => requireAdmin(editorUser)).toThrow("Admin access required");
    });

    it("should not throw for admin user", () => {
      expect(() => requireAdmin(adminUser)).not.toThrow();
    });
  });

  describe("requireEditor", () => {
    it("should throw if user is null", () => {
      expect(() => requireEditor(null)).toThrow("Authentication required");
    });

    it("should not throw for editor user", () => {
      expect(() => requireEditor(editorUser)).not.toThrow();
    });

    it("should not throw for admin user", () => {
      expect(() => requireEditor(adminUser)).not.toThrow();
    });
  });
});
