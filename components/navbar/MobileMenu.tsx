"use client";

import React from "react";
import Link from "next/link";
import { X, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { User } from "next-auth";

type MobileMenuProps = {
  isAuthenticated: boolean;
  user: User;
  toggleMenu: () => void;
  handleLogout: () => void;
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  isAuthenticated,
  user,
  toggleMenu,
  handleLogout,
}) => {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-background z-50 transform transition-transform duration-300">
      <div className="container relative mx-auto p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={toggleMenu}
        >
          <X className="h-6 w-6" />
        </Button>
        <nav className="flex flex-col items-start space-y-3 mt-12">
          {isAuthenticated && (
            <div className="w-full py-4 mb-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}{" "}
                    <span className="capitalize ml-1">
                      {user?.role === "admin" ? (
                        <span className="flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </span>
                      ) : (
                        `(${user?.role})`
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <Link
            href="/"
            className={`w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/venues"
            className={`w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.includes("/venues")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
            onClick={toggleMenu}
          >
            Venues
          </Link>
          <Link
            href="/services"
            className={`w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.includes("/services")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
            onClick={toggleMenu}
          >
            Services
          </Link>
          {isAuthenticated && (
            <>
              <div className="w-full h-px bg-border my-2"></div>
              {user?.role === "admin" ? (
                <>
                  <Link
                    href="/admin"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    href="/admin/approvals"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Approvals
                  </Link>
                  <Link
                    href="/admin/users"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    User Management
                  </Link>
                  <Link
                    href="/account"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Switch to Customer View
                  </Link>
                  <Link
                    href="/vendor"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Switch to Vendor View
                  </Link>
                </>
              ) : user?.role === "vendor" ? (
                <>
                  <Link
                    href="/vendor"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Vendor Dashboard
                  </Link>
                  <Link
                    href="/vendor/venues"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Manage Venues
                  </Link>
                  <Link
                    href="/vendor/bookings"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Booking Requests
                  </Link>
                  <Link
                    href="/vendor/earnings"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Earnings
                  </Link>
                  <Link
                    href="/vendor/profile"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Vendor Profile
                  </Link>
                  <Link
                    href="/account"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Switch to Customer View
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/account"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Customer Dashboard
                  </Link>
                  <Link
                    href="/account/bookings"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/account/favorites"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    My Favorites
                  </Link>
                  <Link
                    href="/account/reviews"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    My Reviews
                  </Link>
                  <Link
                    href="/vendor"
                    className="w-full block px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={toggleMenu}
                  >
                    Switch to Vendor View
                  </Link>
                </>
              )}

              <Button
                variant="destructive"
                className="w-full justify-start mt-4"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
