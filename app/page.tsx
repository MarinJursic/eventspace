// app/page.tsx
import React from "react";
import Hero from "@/components/home/Hero";
import FeaturedVenues from "@/components/home/FeaturedVenues";
import FeaturedServices from "@/components/home/FeaturedServices"; // Import updated component
import HowItWorks from "@/components/home/HowItWorks";
import { getFeaturedVenues } from "@/lib/actions/venueActions";
import { getFeaturedServices } from "@/lib/actions/serviceActions"; // Import service action

export default async function Page() {

    // Fetch data concurrently
    const [featuredVenuesData, featuredServicesData] = await Promise.all([
        getFeaturedVenues(4),
        getFeaturedServices(4)
    ]);

    const featuredVenues = Array.isArray(featuredVenuesData) ? featuredVenuesData : [];
    const featuredServices = Array.isArray(featuredServicesData) ? featuredServicesData : [];

    return (
        <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
            <Hero />
            <FeaturedVenues venues={featuredVenues} />
            <FeaturedServices services={featuredServices} />
            <HowItWorks />
        </main>
        </div>
    );
}