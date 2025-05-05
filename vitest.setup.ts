// vitest.setup.ts
import "@testing-library/jest-dom"; // Extends expect with DOM matchers
import { vi } from "vitest";

// --- Mock Next.js Features ---

// Mock useRouter
vi.mock("next/navigation", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      // Add other methods if needed by your tests
    })),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    usePathname: vi.fn(() => "/"), // Default pathname
  };
});

// Mock useSession
vi.mock("next-auth/react", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("next-auth/react");
  return {
    ...actual,
    useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })), // Default to unauthenticated
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

// Mock useToast (if needed in tested components)
vi.mock("@/hooks/useToast", () => ({
  // Adjust path
  useToast: vi.fn(() => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
  })),
}));

// Mock useCart (if needed in tested components)
vi.mock("@/app/context/CartContext", () => ({
  // Adjust path
  useCart: vi.fn(() => ({
    cart: null,
    addVenue: vi.fn(),
    addExternalVenue: vi.fn(),
    addService: vi.fn(),
    removeService: vi.fn(),
    clearCart: vi.fn(),
    hasVenue: false,
    selectedDates: [],
    eventTimeSlot: "",
    isMultiDay: false,
  })),
}));

// --- Add other global mocks if necessary ---
// e.g., Mocking fetch, localStorage, etc.

// Clean up after each test (optional but recommended)
// afterEach(() => {
//   cleanup(); // From @testing-library/react
// });
