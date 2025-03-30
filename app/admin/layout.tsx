"use client";

import React, { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FilePlus,
  BarChart,
  Settings,
  Building,
  Package,
  LogOut,
  ChevronLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut();
    router.push("/");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  const adminMenuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
    },
    {
      name: "Approvals",
      path: "/admin/approvals",
      icon: <FilePlus className="mr-2 h-5 w-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="mr-2 h-5 w-5" />,
    },
    {
      name: "Venues",
      path: "/admin/venues",
      icon: <Building className="mr-2 h-5 w-5" />,
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: <Package className="mr-2 h-5 w-5" />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <BarChart className="mr-2 h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="mr-2 h-5 w-5" />,
    },
  ];

  const title =
    adminMenuItems.find((item) => item.path === pathname)?.name || "Admin";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 pt-20 pb-16 flex-1 flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-6 p-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {session?.user?.name || "Admin User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.email || "admin@example.com"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {adminMenuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={pathname === item.path ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.path &&
                        "bg-primary text-primary-foreground"
                    )}
                    onClick={() => router.push(item.path)}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => router.push("/")}
                >
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Back to Site
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive mt-1"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
