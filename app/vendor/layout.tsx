"use client";

import React from "react";
import Link from "next/link";
import VenueSidebar from "@/components/venue/sidebar/VenueSidebar";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { capitalizeString } from "@/lib/utils/capitalizeString";
import { isExcludedFromVenueSidebar } from "@/lib/constants/vendorLayout.constants";
import { vendorRoute } from "@/lib/constants/route.constants";

export default function VendorLayout (
  { children }
  : Readonly<{ children: React.ReactNode }>
) {

  const pathname = usePathname();
  const pathnames = pathname.split("/");
  const title = capitalizeString(pathnames[pathnames.length - 1]);

  return (
    <div className="mt-10 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow mt-5">
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={vendorRoute.value} className="hover:text-foreground">Vendor</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>{title.toLowerCase().includes("vendor") ? "Dashboard": title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-10">
          {
            isExcludedFromVenueSidebar(pathname) ? <></> : <VenueSidebar />
          }
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};