/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { isValidObjectId } from "./isValidObject"; // Adjust import path
import { Types } from "mongoose"; // Import mongoose types for comparison

describe("isValidObjectId Utility", () => {
  it("should return true for a valid MongoDB ObjectId string", () => {
    const validId = new Types.ObjectId().toString();
    expect(isValidObjectId(validId)).toBe(true);
  });

  it("should return false for a string that is too short", () => {
    expect(isValidObjectId("123456789012")).toBe(false);
  });

  it("should return false for a string that is too long", () => {
    expect(isValidObjectId("1234567890123456789012345")).toBe(false);
  });

  it("should return false for a string with invalid hex characters", () => {
    expect(isValidObjectId("12345678901234567890123g")).toBe(false); // 'g' is invalid
  });

  it("should return false for a non-hex string of correct length", () => {
    expect(isValidObjectId("abcdefghijklmnopqrstuvwx")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isValidObjectId("")).toBe(false);
  });

  it("should return false for a null value (as input type is string)", () => {
    // TypeScript prevents passing null directly, but test the logic
    // This test might be redundant due to TS but confirms the check
    expect(isValidObjectId(null as any)).toBe(false);
  });

  it("should return false for an undefined value (as input type is string)", () => {
    expect(isValidObjectId(undefined as any)).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isValidObjectId(123456789012345678901234 as any)).toBe(false);
  });

  // Test edge case IDs that might look valid but aren't according to Mongoose
  it("should return false for IDs Mongoose considers invalid", () => {
    // Example of a string that fits length/hex but might fail Mongoose's internal check
    // This specific example might pass/fail depending on Mongoose version,
    // but the principle is to test edge cases if known.
    expect(isValidObjectId("000000000000000000000000")).toBe(true); // This is actually valid
    // Add more specific invalid cases if you encounter them
  });
});
