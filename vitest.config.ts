// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react"; // If using React components

export default defineConfig({
  plugins: [react()], // Add if testing React components
  test: {
    globals: true, // Use global APIs like describe, it, expect
    environment: "jsdom", // Simulate browser environment for React Testing Library
    setupFiles: "./vitest.setup.ts", // Optional setup file
    // Optional: Configure coverage
    // coverage: {
    //   provider: 'v8', // or 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
  },
  // Optional: Alias configuration to match tsconfig.json
  resolve: {
    alias: {
      "@": "/.", // Adjust if your alias is different
    },
  },
});
