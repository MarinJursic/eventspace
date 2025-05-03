"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import CartIcon from "@/components/ui/CartIcon";
import UserDropdown from "./UserDropdown";
import { User } from "next-auth";

type DesktopNavbarProps = {
  isAuthenticated: boolean;
  user: User;
  openAuthModal: (tab: "login" | "signup") => void;
};

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  isAuthenticated,
  user,
  openAuthModal,
}) => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <Link
        href="/"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          pathname === "/"
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        Home
      </Link>
      <Link
        href="/venues"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          pathname.includes("/venues")
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        Venues
      </Link>
      <Link
        href="/services"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          pathname.includes("/services")
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        Services
      </Link>
      <CartIcon />
      {isAuthenticated ? (
        <UserDropdown user={user} />
      ) : (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAuthModal("login")}
          >
            Login
          </Button>
          <Button size="sm" onClick={() => openAuthModal("signup")}>
            Sign Up
          </Button>
        </div>
      )}
    </nav>
  );
};

export default DesktopNavbar;
