import { describe, it, expect } from "vitest";
import { sanitizeString, replaceSpecialWithSpace } from "./sanitizeString"; // Adjust import path

describe("sanitizeString Utilities", () => {
  // Tests for sanitizeString (removes special chars, collapses spaces, trims)
  describe("sanitizeString", () => {
    // ... (keep existing passing tests for sanitizeString) ...
    it("should remove special characters", () => {
      expect(sanitizeString("hello!@#$%^&*()world")).toBe("helloworld");
    });

    it("should keep letters, numbers, and spaces", () => {
      expect(sanitizeString("Event Space 123 Go")).toBe("Event Space 123 Go");
    });

    it("should collapse multiple spaces into one", () => {
      expect(sanitizeString("multiple   spaces")).toBe("multiple spaces");
    });

    it("should trim leading and trailing spaces", () => {
      expect(sanitizeString("  leading and trailing  ")).toBe(
        "leading and trailing"
      );
    });

    it("should handle mixed special chars and spaces", () => {
      expect(sanitizeString("  test!@#  with   stuff&*(  ")).toBe(
        "test with stuff"
      );
    });

    it("should handle unicode letters", () => {
      expect(sanitizeString("你好 世界 123")).toBe("你好 世界 123"); // Example with Chinese characters
      expect(sanitizeString("Crème brûlée")).toBe("Crème brûlée");
    });

    it("should return empty string for input with only special chars/spaces", () => {
      expect(sanitizeString("!@#$%^&*() ")).toBe("");
    });

    it("should return empty string for empty input", () => {
      expect(sanitizeString("")).toBe("");
    });
  });

  // Tests for replaceSpecialWithSpace (replaces special chars with space, optionally collapses/trims)
  describe("replaceSpecialWithSpace", () => {
    // ... (keep existing passing tests) ...
    it("should replace special characters with a single space (default options)", () => {
      expect(replaceSpecialWithSpace("hello!@#world")).toBe("hello world");
    });

    it("should collapse multiple resulting spaces (default options)", () => {
      expect(replaceSpecialWithSpace("hello!@#$%^&*()world")).toBe(
        "hello world"
      );
      expect(replaceSpecialWithSpace("test ! @ # test")).toBe("test test");
    });

    it("should trim leading/trailing spaces (default options)", () => {
      expect(replaceSpecialWithSpace(" !@#test ")).toBe("test");
    });

    it("should keep letters, numbers, and existing spaces", () => {
      expect(replaceSpecialWithSpace("Event Space 123 Go")).toBe(
        "Event Space 123 Go"
      );
    });

    it("should handle unicode letters", () => {
      expect(replaceSpecialWithSpace("你好 世界 123!")).toBe("你好 世界 123");
      expect(replaceSpecialWithSpace("Crème brûlée!")).toBe("Crème brûlée");
    });

    it("should return empty string for empty input", () => {
      expect(replaceSpecialWithSpace("")).toBe("");
    });

    it("should return empty string if only special chars (default options)", () => {
      expect(replaceSpecialWithSpace("!@#$%^&*()")).toBe("");
    });
  });
});
