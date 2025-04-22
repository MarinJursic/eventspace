"use client";

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
    ChevronRight,
    Menu,
    ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/vendor" },
  { icon: Store, label: "Venues & Services", href: "/vendor/venues" },
  { icon: Calendar, label: "Bookings", href: "/vendor/bookings" },
  { icon: DollarSign, label: "Earnings", href: "/vendor/earnings" },
  { icon: MessageSquare, label: "Messages", href: "/vendor/messages" },
  { icon: UserCircle, label: "Profile", href: "/vendor/profile" },
  { icon: Star, label: "Reviews", href: "/vendor/reviews" },
];

export default function MobileSidebar(
    {handleLogout} 
    : {handleLogout(): void}
){

    const router = useRouter();
    const pathname = usePathname();

    return (<>
        <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                className="mb-4 w-full justify-between"
            >
                <span className="flex items-center">
                <Menu className="mr-2 h-4 w-4" />
                Vendor Menu
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
    </>);
}