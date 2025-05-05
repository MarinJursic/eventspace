import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getVenueById } from "@/lib/actions/venueActions";
import VenueDetailClient from "@/components/venue/VenueDetailClient";

type VenueDetailParams = { params: Promise<{ id: string }> };

export default async function VenueDetailPage({ params }: VenueDetailParams) {
  const { id } = await params;

  // Fetch data using Server Actions
  const [venueData] = await Promise.all([getVenueById(id)]);

  // Handle Not Found early
  if (!venueData) {
    notFound();
  }

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
