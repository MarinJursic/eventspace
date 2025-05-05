"use client";

import React from "react";
import { MapPin, Star, Users, Sofa } from "lucide-react"; // Added Sofa for seating
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Venue } from "@/lib/mocks/mockVenues"; // Import Venue type to use its nested types

// --- Updated Props Interface ---
interface VenueOverviewProps {
  name: string;
  type?: string; // Optional venue type
  city?: string; // Optional city from location
  address?: string; // Full address from location
  rating: Venue["rating"]; // Pass the whole rating object
  capacity?: number; // Optional total capacity
  seating?: Venue["seating"]; // Optional seating details object
}

const VenueOverview: React.FC<VenueOverviewProps> = ({
  name,
  type,
  city,
  address,
  rating,
  capacity,
  seating,
}) => {
  // Determine the review count from the rating object
  const reviewCount = rating?.count ?? 0;
  // Determine the average rating, defaulting to 0 if no reviews
  const averageRating = rating?.average ?? 0;

  return (
    <div className="space-y-3">
      {" "}
      {/* Added spacing */}
      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
        {name}
      </h1>
      {/* Type Badge */}
      {type && <Badge variant="outline">{type}</Badge>}
      {/* Location */}
      {(city || address) && (
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span>
            {city ? `${city}` : ""}
            {city && address ? ", " : ""}
            {address || ""}
          </span>
        </div>
      )}
      {/* Rating, Capacity, Seating */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-2">
        {/* Rating */}
        {reviewCount > 0 ? (
          <div className="flex items-center text-amber-600">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 mr-1" />
            {/* Use averageRating calculated above */}
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            {/* Use reviewCount */}
            <span className="ml-1 text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </div>
        ) : (
          <div className="flex items-center text-muted-foreground">
            <Star className="w-4 h-4 text-muted-foreground mr-1" />
            <span>No reviews yet</span>
          </div>
        )}

        {/* Capacity */}
        {typeof capacity === "number" && capacity > 0 && (
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {/* Display capacity */}
            <span>Up to {capacity} guests</span>
          </div>
        )}

        {/* Seating Details */}
        {seating && (seating.seated > 0 || seating.standing > 0) && (
          <div className="flex items-center text-muted-foreground">
            <Sofa className="h-4 w-4 mr-1" />
            <span>
              {seating.seated > 0 ? `${seating.seated} seated` : ""}
              {seating.seated > 0 && seating.standing > 0 ? " / " : ""}
              {seating.standing > 0 ? `${seating.standing} standing` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueOverview;
