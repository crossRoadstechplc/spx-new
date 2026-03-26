/* Phase 4: Authentication utilities */
import { compare, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { db } from "./db";
import type { User, Session } from "@prisma/client";

const SALT_ROUNDS = 12;
const SESSION_EXPIRY_HOURS = 24;

// ============================================
// Password Utilities
// ============================================

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}

// ============================================
// Session Management
// ============================================

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<Session> {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

  const session = await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Update user's lastLoginAt
  await db.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });

  return session;
}

/**
 * Get a session by token (null if expired or not found)
 */
export async function getSessionByToken(
  token: string
): Promise<(Session & { user: User }) | null> {
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  await db.session.delete({ where: { token } }).catch(() => {
    // Ignore errors if session doesn't exist
  });
}

/**
 * Delete all expired sessions (cleanup task)
 */
export async function deleteExpiredSessions(): Promise<number> {
  const result = await db.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result.count;
}

// ============================================
// User Authentication
// ============================================

/**
 * Authenticate a user by email and password
 * Returns user object if successful, null otherwise
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  return db.user.findUnique({
    where: { id },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

// ============================================
// Authorization Helpers
// ============================================

/**
 * Check if user has admin role
 */
export function isAdmin(user: User): boolean {
  return user.role === "ADMIN";
}

/**
 * Check if user has editor or admin role
 */
export function canEdit(user: User): boolean {
  return user.role === "ADMIN" || user.role === "EDITOR";
}

/**
 * Require admin role (throws error if not)
 */
export function requireAdmin(user: User | null): asserts user is User {
  if (!user) {
    throw new Error("Authentication required");
  }
  if (!isAdmin(user)) {
    throw new Error("Admin access required");
  }
}

/**
 * Require editor or admin role (throws error if not)
 */
export function requireEditor(user: User | null): asserts user is User {
  if (!user) {
    throw new Error("Authentication required");
  }
  if (!canEdit(user)) {
    throw new Error("Editor access required");
  }
}
