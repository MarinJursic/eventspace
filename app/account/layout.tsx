"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  Settings,
  Package,
  Heart,
  Star,
  Home,
  LogOut,
  ChevronRight,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useMobile";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/account",
  },
  {
    icon: Package,
    label: "My Bookings",
    href: "/account/bookings",
  },
  {
    icon: Heart,
    label: "Favorites",
    href: "/account/favorites",
  },
  {
    icon: Star,
    label: "Reviews",
    href: "/account/reviews",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/account/settings",
  },
];

interface AccountLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const title =
    navItems.find((item) => item.href === pathname)?.label || "Account";

  return (
    <div className="mt-10 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Account</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>{title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="mb-4 w-full justify-between"
                >
                  <span className="flex items-center">
                    <Menu className="mr-2 h-4 w-4" />
                    Account Menu
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-2 py-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => router.push("/")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Site
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-card rounded-xl border border-border shadow-sm p-4 sticky top-20">
                <div className="flex items-center space-x-3 mb-6 p-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {session?.user?.name || "John Doe"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email || "john@example.com"}
                    </p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={cn(
                        "justify-start",
                        pathname === item.href &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>

                <div className="pt-6 mt-6 border-t border-border">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted mb-3"
                    onClick={() => router.push("/")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Site
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
