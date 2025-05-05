import { describe, it, expect, vi } from "vitest";
import { capitalizeString } from "./capitalizeString"; // Adjust import path if needed

// Mock the dependency since capitalizeString relies on it
vi.mock("./sanitizeString", () => ({
  // Provide a mock implementation that matches the expected behavior for these tests
  replaceSpecialWithSpace: vi.fn((str: string) =>
    str
      .replace(/[^\p{L}\p{N} ]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
  ),
}));

describe("capitalizeString Utility", () => {
  it("should capitalize the first letter of each word", () => {
    // Removed trailing space expectation
    expect(capitalizeString("hello world")).toBe("Hello World");
  });

  it("should handle single words", () => {
    // Removed trailing space expectation
    expect(capitalizeString("event")).toBe("Event");
  });

  it("should handle already capitalized words", () => {
    // Removed trailing space expectation
    expect(capitalizeString("New York")).toBe("New York");
  });

  it("should handle empty strings (returns empty string)", () => {
    // Updated expectation
    expect(capitalizeString("")).toBe("");
  });

  it("should handle strings with leading/trailing spaces (trimmed by mock)", () => {
    // Removed trailing space expectation
    expect(capitalizeString("  leading space")).toBe("Leading Space");
    expect(capitalizeString("trailing space  ")).toBe("Trailing Space");
  });

  it("should handle strings with multiple spaces between words (collapsed by mock)", () => {
    // Removed trailing space expectation
    expect(capitalizeString("multiple   spaces")).toBe("Multiple Spaces");
  });

  it("should handle strings with special characters (removed by mock)", () => {
    // Removed trailing space expectation
    expect(capitalizeString("event-space!")).toBe("Event Space");
    expect(capitalizeString("venue@123")).toBe("Venue 123");
  });

  it("should handle strings with numbers", () => {
    // Removed trailing space expectation
    expect(capitalizeString("event 123 go")).toBe("Event 123 Go");
  });

  it("should handle mixed case input", () => {
    // Removed trailing space expectation
    expect(capitalizeString("mIxEd CaSe")).toBe("Mixed Case");
  });
});
