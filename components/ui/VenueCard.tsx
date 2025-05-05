import React from "react";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";
import { Badge } from "./badge";
import Image from "next/image";
import { formatDisplayPrice } from "@/lib/utils/formatDisplayPrice";

// --- Define Serialized Types (matching VenueListClient and Server Action Output) ---
// Define the structure of the populated/serialized amenity data
interface PopulatedAmenity {
  _id: string;
  id?: string; // Optional virtual ID
  key: string; // e.g., 'parking', 'wifi'
  label: string; // e.g., 'Parking', 'WiFi'
  icon?: string; // Optional: icon name string if stored/populated
}

// Define the serialized venue data type expected as a prop
interface SerializedVenue {
  id: string; // Virtual 'id' from Mongoose _id
  _id: string; // Keep original _id if used as key sometimes
  name: string;
  location: {
    address: string;
    city?: string;
    // Add other location fields if needed for display
  };
  price: {
    basePrice: number;
    model: "hour" | "day" | "week";
  };
  images: {
    url: string;
    alt?: string;
    caption?: string;
    // Removed width/height as they might not be reliably serialized/needed here
  }[];
  rating: {
    average: number;
    count: number;
  };
  type?: string; // Optional venue type
  capacity?: number; // Optional capacity
  amenities?: PopulatedAmenity[]; // Array of populated/serialized amenity objects
  sponsored?: {
    isActive: boolean;
    // Add other sponsored fields if needed
  };
  // Add any other fields from your server action serialization used here
}

// --- Component Props Interface ---
interface VenueCardProps {
  venue: SerializedVenue; // Use the specific serialized type
  className?: string;
}

// --- Venue Card Component ---
const VenueCard: React.FC<VenueCardProps> = ({ venue, className }) => {
  // Safe access for image URL and Alt text
  const imageUrl =
    venue.images?.[0]?.url ||
    "https://via.placeholder.com/400x267?text=No+Image"; // Fallback image
  const imageAlt = venue.images?.[0]?.alt || `Image of ${venue.name}`; // Fallback alt text

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg", // Standard card styling
        className
      )}
    >
      {/* Venue Type Badge (Top Left) - Conditionally rendered */}
      {venue.type && (
        <Badge
          variant="secondary" // Use secondary or outline for visual difference from sponsored
          className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm px-2.5 py-0.5 text-xs capitalize" // Capitalize type
        >
          {venue.type}
        </Badge>
      )}

      {/* Sponsored Badge (Top Right) - Conditionally rendered */}
      {venue.sponsored?.isActive && (
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none px-2 py-0.5 text-xs"
        >
          Sponsored
        </Badge>
      )}

      {/* Image Section */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
        {" "}
        {/* Standard aspect ratio and bg */}
        <Image
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy" // Lazy load images below the fold
          width={400} // Provide image dimensions hint for performance
          height={240}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-4">
        {" "}
        {/* Standard padding */}
        {/* Name and Rating Row */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold text-base leading-snug flex-1 mr-1">
            {" "}
            {/* Standard text size */}
            {/* Link wrapping the name */}
            <Link
              href={`/venues/${venue._id}`}
              className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
            >
              {venue.name}
            </Link>
          </h3>
          {/* Rating Display (only if rating exists and average > 0) */}
          {venue.rating && venue.rating.average > 0 && (
            <div className="flex shrink-0 items-center bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300/50">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
              <span className="text-xs font-medium">
                {venue.rating.average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        {/* Location Display */}
        {venue.location?.city && (
          <p className="flex items-center text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            {venue.location.city}
            {/* Optionally add more location details if needed */}
            {/* {venue.location.address ? `, ${venue.location.address}` : ''} */}
          </p>
        )}
        {/* Spacer Element */}
        <div className="flex-grow" /> {/* Pushes price/reviews/button down */}
        {/* Price Display */}
        <div className="mt-2 text-sm">
          {" "}
          {/* Consistent margin */}
          <span className="font-semibold text-foreground">
            {formatDisplayPrice(venue.price.basePrice, venue.price.model)}
          </span>
        </div>
        {/* Review Count Display */}
        {venue.rating && venue.rating.count > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            ({venue.rating.count} review{venue.rating.count !== 1 ? "s" : ""})
          </p>
        )}
        {/* View Details Button */}
        <div className="mt-4">
          {" "}
          {/* Consistent margin */}
          <Button
            variant="outline"
            size="sm" // Consistent button size
            className="w-full rounded-lg group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200" // Consistent hover effect
            asChild // Use asChild for Link composability
          >
            {/* Use the serialized string 'id' for the link */}
            <Link href={`/venues/${venue._id}`} prefetch={false}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
