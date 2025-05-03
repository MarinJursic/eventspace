"use client";

import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

type UserDropdownProps = {
  user: User;
};

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const router = useRouter();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const renderCustomerMenuItems = () => (
    <>
      <DropdownMenuItem asChild>
        <Link href="/account">Customer Dashboard</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/account/bookings">My Bookings</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/account/favorites">My Favorites</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/account/reviews">My Reviews</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/account/settings">Account Settings</Link>
      </DropdownMenuItem>
    </>
  );

  const renderVendorMenuItems = () => (
    <>
      <DropdownMenuItem asChild>
        <Link href="/vendor">Vendor Dashboard</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/vendor/venues">Manage Venues</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/vendor/bookings">Booking Requests</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/vendor/earnings">Earnings</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/vendor/profile">Vendor Profile</Link>
      </DropdownMenuItem>
    </>
  );

  const renderAdminMenuItems = () => (
    <>
      <DropdownMenuItem asChild>
        <Link href="/admin">Admin Dashboard</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/admin/approvals">Approvals</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/admin/users">User Management</Link>
      </DropdownMenuItem>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="font-medium">
          {user?.name}
          <span className="ml-2 text-xs text-muted-foreground capitalize">
            {user?.role === "admin" ? (
              <span className="flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </span>
            ) : (
              user?.role
            )}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {user?.role === "admin"
          ? renderAdminMenuItems()
          : user?.role === "vendor"
            ? renderVendorMenuItems()
            : renderCustomerMenuItems()}

        {user?.role === "vendor" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">Switch to Customer View</Link>
            </DropdownMenuItem>
          </>
        )}

        {user?.role === "customer" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/vendor">Switch to Vendor View</Link>
            </DropdownMenuItem>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">Switch to Customer View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/vendor">Switch to Vendor View</Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
