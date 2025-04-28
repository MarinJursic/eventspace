// src/components/venue/VenueTabs.tsx
"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator"; // Corrected path
import { Button } from "@/components/ui/button"; // Corrected path
import { IReview } from "@/lib/database/schemas/review"; // Use Mongoose type
import 'leaflet/dist/leaflet.css'

// Import amenity mapping and default icon
import { amenityIconMap, DefaultAmenityIcon } from './amenityIcons'; // Adjust path

// Import icons needed within this component
import { MapPin, Star } from "lucide-react"; // Removed Check unless needed elsewhere

// Dynamically import VenueMap
const VenueMap = dynamic(() => import('./VenueMap'), {
  ssr: false,
  loading: () => ( <div className="aspect-[16/9] w-full rounded-lg bg-muted animate-pulse flex items-center justify-center border"><p className="text-muted-foreground text-sm">Loading Map...</p></div> ),
});

// --- Define type for populated/serialized Amenity Enum ---
// Adjust this based on the actual structure you fetch/serialize
interface PopulatedAmenity {
    _id: string; // Or ObjectId if not serialized fully
    id?: string; // Virtual id if added
    key: string; // The identifier used in amenityIconMap (e.g., 'wifi', 'parking')
    label: string; // The display name (e.g., 'WiFi', 'Parking')
    icon?: string; // Optional: Icon name string if stored in DB
}

// --- Define type for serialized Review data passed as prop ---
// (Similar to previous SerializedReview, ensure fields match)
interface SerializedReviewData {
    id: string;
    user: string; // User ObjectId as string
    rating: number;
    comment?: string;
    createdAt: string; // Date as string
    updatedAt: string; // Date as string
}


// --- Updated Props Interface ---
interface VenueTabsProps {
  name: string;
  description: string;
  location: {
      address: string;
      city?: string;
      lat?: number;
      lng?: number;
  };
  // Expect populated or detailed amenity data
  amenities: PopulatedAmenity[];
  reviews: SerializedReviewData[]; // Use the serialized type
  policies: { name: string; description: string }[];
}

const DEFAULT_VISIBLE_REVIEWS: number = 3;

const VenueTabs: React.FC<VenueTabsProps> = ({
  name,
  description,
  location,
  amenities = [],
  reviews = [],
  policies = [],
}) => {
  const [visibleReviews, setVisibleReviews] = useState<number>(DEFAULT_VISIBLE_REVIEWS);

  const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const totalReviewCount = reviews.length;

  console.log("U Venue Tab: ");
  console.log(location)

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50 rounded-lg p-1 h-auto">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
      </TabsList>

      {/* About Tab */}
      <TabsContent value="about" className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {description || "No description provided."}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Location</h3>
            <VenueMap
              latitude={location.lat}
              longitude={location.lng}
              venueName={name}
              address={location.address}
            />
        </div>
      </TabsContent>

      {/* Amenities Tab */}
      <TabsContent value="amenities">
         <h3 className="font-semibold text-lg mb-3">Amenities</h3>
         {amenities && amenities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Map over PopulatedAmenity objects */}
                {amenities.map((amenity) => {
                    // Use the 'key' field for mapping, fallback to label if key unavailable
                    const iconKey = amenity.key || amenity.label.toLowerCase().trim();
                    const IconComponent = amenityIconMap[iconKey] || DefaultAmenityIcon;
                    return (
                    // Use amenity._id or amenity.id for a stable key
                    <div key={amenity._id || amenity.id || amenity.label} className="flex items-start p-3 bg-secondary/30 rounded-lg border">
                        <IconComponent className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                         {/* Display the label */}
                        <span className="text-sm">{amenity.label}</span>
                    </div>
                    );
                })}
            </div>
         ) : (
            <p className="text-muted-foreground text-sm">No specific amenities listed.</p>
         )}
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews" className="space-y-6">
         {reviews && reviews.length > 0 ? (
            <>
                {/* Rating summary */}
                <div className="flex items-center mb-4 gap-4">
                  <div className="bg-amber-100/60 border border-amber-300/50 text-amber-900 px-3 py-2 rounded-lg flex items-center">
                     <span className="font-semibold text-xl">{averageRating.toFixed(1)}</span>
                     <Star className="w-5 h-5 text-amber-500 fill-amber-500 ml-2" />
                  </div>
                  <div>
                    <p className="font-medium">Based on {totalReviewCount} reviews</p>
                    <p className="text-sm text-muted-foreground">From verified bookings</p>
                  </div>
                </div>
                 {/* Review List */}
                 <div className="space-y-4">
                    {reviews.slice(0, visibleReviews).map((review) => (
                        <div key={review.id} className="border border-border rounded-lg p-4 bg-background">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                <p className="font-medium text-sm">User (...{review.user.slice(-6)})</p>
                                {/* Use createdAt string from SerializedReviewData */}
                                <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center bg-amber-100/60 px-1.5 py-0.5 rounded-full border border-amber-300/50">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                                <span className="text-xs font-medium text-amber-900">{review.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment || "No comment."}</p>
                        </div>
                    ))}
                 </div>
                 {/* View More/Less Button */}
                 {totalReviewCount > DEFAULT_VISIBLE_REVIEWS &&
                 <Button variant="outline" className="w-full" onClick={() => setVisibleReviews( V => V === totalReviewCount ? DEFAULT_VISIBLE_REVIEWS : totalReviewCount )}>
                     View {visibleReviews === totalReviewCount ? "Less" : "More"} Reviews
                 </Button>}
            </>
         ) : (
             <p className="text-muted-foreground text-sm">No reviews yet for this venue.</p>
         )}
      </TabsContent>

      {/* Policies Tab */}
      <TabsContent value="policies">
         <h3 className="font-semibold text-lg mb-3">Venue Policies</h3>
         {policies && policies.length > 0 ? (
             <div className="space-y-4">
                {policies.map((policy, i) => (
                    <div key={policy.name + i}>
                        <div>
                            <h4 className="font-medium mb-1 text-sm">{policy.name}</h4>
                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                        {i < policies.length - 1 && <Separator className="my-4" />}
                    </div>
                ))}
            </div>
         ) : (
             <p className="text-muted-foreground text-sm">No specific policies listed.</p>
         )}
      </TabsContent>
    </Tabs>
  );
};

export default VenueTabs;