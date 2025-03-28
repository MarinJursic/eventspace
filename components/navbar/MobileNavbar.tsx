"use client";

import React from "react";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartIcon from "@/components/ui/CartIcon";

type MobileNavbarProps = {
  isAuthenticated: boolean;
  user: any;
  toggleMenu: () => void;
  openAuthModal: (tab: "login" | "signup") => void;
};

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  isAuthenticated,
  user,
  toggleMenu,
  openAuthModal,
}) => {
  return (
    <div className="flex items-center md:hidden">
      <CartIcon />
      {isAuthenticated ? (
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={toggleMenu}
        >
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => openAuthModal("login")}
          >
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
};

export default MobileNavbar;
