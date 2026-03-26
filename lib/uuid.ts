/* Phase 1: UUID utilities and validation */
import { randomUUID } from "crypto";

/**
 * Generates a v4 UUID.
 * Uses Node.js crypto for security.
 */
export function generateUUID(): string {
  return randomUUID();
}

/**
 * Validates if a string is a valid UUID (v4).
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates and returns UUID, throws if invalid.
 */
export function requireValidUUID(uuid: string, fieldName = "UUID"): string {
  if (!isValidUUID(uuid)) {
    throw new Error(`Invalid ${fieldName}: ${uuid}`);
  }
  return uuid;
}
