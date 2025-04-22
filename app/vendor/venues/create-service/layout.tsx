import type { Metadata } from "next";
import Provider from "@/components/Provider";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/Toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

export const metadata: Metadata = {
    title: "EventSpace",
    description: "Make your next event unforgettable",
};

export default async function RootLayout(
    { children }
        : Readonly<{ children: React.ReactNode; }>
) {
    const session = await getServerSession(authOptions);

    return (
        <section>
            <Provider session={session}>
                <Toaster />
                <Navbar />
                {children}
            </Provider>
        </section>
    );
}
