// app/venues/page.tsx
// NO "use client"

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Import Server Actions
import { getAllVenues, getDbCities } from "@/lib/actions/venueActions"; // Adjust path

// Import the Client Component Wrapper
import VenueListClient from "@/components/venue/VenueListClient"; // Adjust path

// Define SearchParams type
interface VenuesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // This is the type Next.js passes
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
  // --- Pass searchParams DIRECTLY to the action ---
  // The action's type ReadonlyURLSearchParams can handle the object
  const [initialVenuesData, citiesData] = await Promise.all([
    getAllVenues(await searchParams), // Pass the object directly, use 'as any' if TS complains initially
    getDbCities(),
  ]);

  // --- End Direct Pass ---

  // Basic error handling or check if data is as expected
  const initialVenues = Array.isArray(initialVenuesData)
    ? initialVenuesData
    : [];
  const allCities = Array.isArray(citiesData) ? citiesData : [];

  // Note: No need to handle notFound here unless getAllVenues throws an error
  // An empty list is a valid result for the listing page.

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
