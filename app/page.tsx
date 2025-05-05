import Hero from "@/components/home/Hero";
import { getFeaturedVenues } from "@/lib/actions/venueActions";
import { getFeaturedServices } from "@/lib/actions/serviceActions";
import dynamic from "next/dynamic";

const DynamicFeaturedVenues = dynamic(
  () => import("@/components/home/FeaturedVenues")
);
const DynamicFeaturedServices = dynamic(
  () => import("@/components/home/FeaturedServices")
);
const DynamicHowItWorks = dynamic(() => import("@/components/home/HowItWorks"));

export default async function Page() {
  // Fetch data concurrently
  const [featuredVenuesData, featuredServicesData] = await Promise.all([
    getFeaturedVenues(4),
    getFeaturedServices(4),
  ]);

  const featuredVenues = Array.isArray(featuredVenuesData)
    ? featuredVenuesData
    : [];
  const featuredServices = Array.isArray(featuredServicesData)
    ? featuredServicesData
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <DynamicFeaturedVenues venues={featuredVenues} />
        <DynamicFeaturedServices services={featuredServices} />
        <DynamicHowItWorks />
      </main>
    </div>
  );
}
