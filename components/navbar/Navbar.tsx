"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import MobileMenu from "./MobileMenu";
import AuthModal from "../auth/AuthModal";
import { useSession, signOut } from "next-auth/react";
import { useIsMobile } from "../../hooks/useMobile";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session);
  const user = session?.user;

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const openAuthModal = (tab: "login" | "signup") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-display font-bold text-lg md:text-xl">
            EventSpace
          </span>
        </Link>
        <DesktopNavbar
          isAuthenticated={isAuthenticated}
          user={user}
          openAuthModal={openAuthModal}
        />
        <MobileNavbar
          isAuthenticated={isAuthenticated}
          user={user}
          toggleMenu={toggleMenu}
          openAuthModal={openAuthModal}
        />
      </div>
      {isMobile && isMenuOpen && (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          toggleMenu={toggleMenu}
          handleLogout={handleLogout}
        />
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default Navbar;
