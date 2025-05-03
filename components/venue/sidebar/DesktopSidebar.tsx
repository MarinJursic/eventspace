import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Calendar,
  DollarSign,
  MessageSquare,
  UserCircle,
  Star,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export default function DesktopSidebar({
  handleLogout,
}: {
  handleLogout(): void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/vendor" },
    { icon: Store, label: "Venues & Services", href: "/vendor/venues" },
    { icon: Calendar, label: "Bookings", href: "/vendor/bookings" },
    { icon: DollarSign, label: "Earnings", href: "/vendor/earnings" },
    { icon: MessageSquare, label: "Messages", href: "/vendor/messages" },
    { icon: UserCircle, label: "Profile", href: "/vendor/profile" },
    { icon: Star, label: "Reviews", href: "/vendor/reviews" },
  ];

  return (
    <>
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-card rounded-xl border border-border shadow-sm p-4 sticky top-20">
          <div className="flex items-center space-x-3 mb-6 p-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {session?.user?.name || "Vendor Account"}
              </p>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email || "vendor@example.com"}
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
                  pathname === item.href && "bg-primary text-primary-foreground"
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="pt-6 mt-6 border-t border-border">
            {session?.user?.role === "vendor" && (
              <Button
                variant="outline"
                className="justify-start w-full mb-3"
                onClick={() => router.push("/account")}
              >
                Switch to Customer View
              </Button>
            )}
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
    </>
  );
}
