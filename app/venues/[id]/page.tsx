// app/venues/[id]/page.tsx
// NO "use client"

import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // For loading fallback

// Import Server Actions
import { getVenueById } from '@/lib/actions/venueActions'; // Adjust path

// Import the Client Component Wrapper
import VenueDetailClient from '@/components/venue/VenueDetailClient'; // Adjust path

type VenueDetailParams = { params: Promise<{ id: string }> };

export default async function VenueDetailPage({ params }: VenueDetailParams) {
  const { id } = await params;

  // Fetch data using Server Actions
  const [venueData] = await Promise.all([
      getVenueById(id)
  ]);

  // Handle Not Found early
  if (!venueData) {
    notFound();
  }

  // Render ONLY the client component, passing the data
  // Wrap in Suspense if the client component uses useSearchParams or other hooks that trigger it
  return (
      <Suspense fallback={<LoadingState />}>
         <VenueDetailClient venue={venueData} />
      </Suspense>
  );
}

// Define a simple loading component (or import one)
function LoadingState() {
   return (
       <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
       </div>
   );
}