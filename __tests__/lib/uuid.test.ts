/* Phase 1: Unit tests for UUID utilities */
import { generateUUID, isValidUUID, requireValidUUID } from "@/lib/uuid";

describe("generateUUID", () => {
  it("generates a valid v4 UUID", () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("generates unique UUIDs", () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    expect(uuid1).not.toBe(uuid2);
  });

  it("generates UUIDs with version 4 marker", () => {
    const uuid = generateUUID();
    const versionChar = uuid.charAt(14);
    expect(versionChar).toBe("4");
  });
});

describe("isValidUUID", () => {
  it("validates correct v4 UUID", () => {
    expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("validates UUID with uppercase letters", () => {
    expect(isValidUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
  });

  it("rejects UUID with wrong version", () => {
    expect(isValidUUID("550e8400-e29b-31d4-a716-446655440000")).toBe(false);
  });

  it("rejects UUID with wrong format", () => {
    expect(isValidUUID("not-a-uuid")).toBe(false);
  });

  it("rejects UUID without hyphens", () => {
    expect(isValidUUID("550e8400e29b41d4a716446655440000")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidUUID("")).toBe(false);
  });

  it("rejects null/undefined", () => {
    expect(isValidUUID(null as any)).toBe(false);
    expect(isValidUUID(undefined as any)).toBe(false);
  });
});

describe("requireValidUUID", () => {
  it("returns valid UUID unchanged", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(requireValidUUID(uuid)).toBe(uuid);
  });

  it("throws for invalid UUID", () => {
    expect(() => requireValidUUID("invalid")).toThrow("Invalid UUID");
  });

  it("includes custom field name in error", () => {
    expect(() => requireValidUUID("invalid", "insightId")).toThrow("Invalid insightId");
  });

  it("accepts uppercase UUIDs", () => {
    const uuid = "550E8400-E29B-41D4-A716-446655440000";
    expect(requireValidUUID(uuid)).toBe(uuid);
  });
});
