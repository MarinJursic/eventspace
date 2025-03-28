// types/next-auth.d.ts
import "@auth/core/types";

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "vendor" | "customer";
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
    role: "admin" | "vendor" | "customer";
  }

  interface JWT {
    id: string;
    role: "admin" | "vendor" | "customer";
  }
}
