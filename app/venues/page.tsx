import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getAllVenues, getDbCities } from "@/lib/actions/venueActions";
import VenueListClient from "@/components/venue/VenueListClient";

// Define SearchParams type
interface VenuesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// --- Loading Component ---
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

// --- Make the page component async ---
export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const [initialVenuesData, citiesData] = await Promise.all([
    getAllVenues(await searchParams),
    getDbCities(),
  ]);

  // Basic error handling or check if data is as expected
  const initialVenues = Array.isArray(initialVenuesData)
    ? initialVenuesData
    : [];
  const allCities = Array.isArray(citiesData) ? citiesData : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Render the Client Component Wrapper */}
      {/* Pass initial data fetched on the server */}
      {/* Wrap in Suspense */}
      <Suspense fallback={<LoadingState />}>
        <VenueListClient initialVenues={initialVenues} allCities={allCities} />
      </Suspense>
    </div>
  );
}
