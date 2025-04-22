import React from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useMobile";
import { signOut } from "next-auth/react";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";

export default function VenueSidebar(){
    const isMobile = useIsMobile();

    const router = useRouter();
    const handleLogout = () => {
        signOut();
        router.push("/");
    };

    return (<>
        {isMobile ? (
            <MobileSidebar handleLogout={handleLogout}/>
        ) : (
            <DesktopSidebar handleLogout={handleLogout}/>
        )}
    </>);
}