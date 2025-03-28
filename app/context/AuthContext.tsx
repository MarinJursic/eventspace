// app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useToast } from "@/hooks/useToast";

type RoleType = "customer" | "vendor" | "admin";

type User = {
  id: string;
  name: string;
  email: string;
  role: RoleType;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider?: "credentials" | "google" | "facebook") => void;
  logout: () => void;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role as RoleType,
      }
    : null;

  const login = (
    provider: "credentials" | "google" | "facebook" = "credentials"
  ) => {
    signIn(provider);
  };

  const logout = () => {
    signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
    setHasLoggedOut(true);
  };

  const isAdmin = () => user?.role === "admin";

  useEffect(() => {
    if (session?.user && !hasLoggedOut) {
      toast({
        title: "Login successful",
        description: `Welcome back, ${session.user.name}!`,
      });
    }
  }, [session, hasLoggedOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!session,
        isLoading: status === "loading",
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
