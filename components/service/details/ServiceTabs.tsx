// components/service/details/ServiceTabs.tsx
"use client"; // Needed because ServiceReviewsTab uses useState

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Adjust path
import { Separator } from "@/components/ui/separator"; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path
import { Star, Check } from 'lucide-react'; // Import necessary icons

// --- Define Serialized Types (Matching Server Action Output) ---
// It's best practice to define these in a shared types file (e.g., types/service.types.ts or types/shared.types.ts)
// and import them here, but defining inline for completeness.

interface SerializedRating {
    average: number;
    count: number;
}

interface SerializedPolicyItem {
    name: string;
    description: string;
}

interface SerializedPolicies {
    listOfPolicies?: SerializedPolicyItem[];
    // bannedServices?: string[]; // Add if needed
}

// Main serialized service data structure needed by these tabs
interface SerializedServiceData {
    id: string; // or _id: string;
    name: string; // Used for context, though not directly displayed here
    description?: string;
    features?: string[]; // Assuming features are stored as simple strings
    policies?: SerializedPolicies;
    rating: SerializedRating; // Rating object is needed for the reviews tab summary
    // Add other fields if ServiceTabs or its children need them
}

// Structure for serialized review data
interface SerializedReviewData {
    id: string; // or _id: string;
    user: string; // User ID string or placeholder name
    rating: number;
    comment?: string;
    createdAt: string; // Date as ISO string
    updatedAt: string; // Date as ISO string
    // Add other review fields if needed and serialized
}
// --- End Type Definitions ---


// --- Tab Content Components ---

// About Tab Component
const ServiceAboutTab: React.FC<{ description?: string }> = ({ description }) => (
    <TabsContent value="about">
        <h3 className="font-semibold text-lg mb-2">Description</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">
            {description || "No description available."}
        </p>
    </TabsContent>
);

// Features Tab Component
const ServiceFeaturesTab: React.FC<{ features?: string[] }> = ({ features = [] }) => (
    <TabsContent value="features">
        <h3 className="font-semibold text-lg mb-3">What's Included</h3>
        {features.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((featureName, index) => (
                    <div key={index} className="flex items-start p-3 bg-secondary/30 rounded-lg border">
                        <Check className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{featureName}</span>
                    </div>
                ))}
            </div>
        ) : (
             <p className="text-sm text-muted-foreground">No specific features listed.</p>
        )}
    </TabsContent>
);

// Reviews Tab Component
const DEFAULT_VISIBLE_REVIEWS: number = 3; // Initial number of reviews to show

interface ServiceReviewsTabProps {
    reviews: SerializedReviewData[]; // Expect serialized reviews
    rating: SerializedRating; // Use SerializedRating
}
const ServiceReviewsTab: React.FC<ServiceReviewsTabProps> = ({ reviews = [], rating }) => {
     // State to manage how many reviews are visible
     const [visibleReviews, setVisibleReviews] = useState<number>(DEFAULT_VISIBLE_REVIEWS);

     // Calculate average and count safely
     const averageRating = rating?.average ?? 0;
     // Use rating.count from the service object as the source of truth for total count
     const totalReviewCount = rating?.count ?? reviews.length;

     // Handler for the "View More/Less" button
     const handleToggleReviews = () => {
        setVisibleReviews(prevVisible =>
            prevVisible === reviews.length ? DEFAULT_VISIBLE_REVIEWS : reviews.length
        );
     };

     return (
        <TabsContent value="reviews">
            {reviews.length > 0 ? (
                <div className="space-y-6"> {/* Added outer space-y */}
                    {/* Rating Summary */}
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-100/60 border border-amber-300/50 text-amber-900 px-3 py-2 rounded-lg flex items-center">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
                            <span className="font-semibold text-xl">{averageRating.toFixed(1)}</span>
                        </div>
                        <div>
                            <p className="font-medium">Based on {totalReviewCount} reviews</p>
                            {/* <p className="text-sm text-muted-foreground">From verified bookings</p> */}
                        </div>
                    </div>
                    {/* Review List */}
                    <div className="space-y-4">
                        {/* Slice the reviews array based on visibility state */}
                        {reviews.slice(0, visibleReviews).map((review) => (
                            <div key={review.id} className="border border-border rounded-lg p-4 bg-background">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        {/* Display user ID placeholder */}
                                        <p className="font-medium text-sm">User (...{review.user.slice(-6)})</p>
                                        {/* Format createdAt date string */}
                                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {/* Rating stars for individual review */}
                                    <div className="flex items-center bg-amber-100/60 px-1.5 py-0.5 rounded-full border border-amber-300/50">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                                        <span className="text-xs font-medium text-amber-900">{review.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment || "No comment provided."}</p>
                            </div>
                        ))}
                    </div>
                    {/* View More/Less Button */}
                    {/* Show button only if there are more reviews than initially visible */}
                    {totalReviewCount > DEFAULT_VISIBLE_REVIEWS && (
                        <Button variant="outline" className="w-full" onClick={handleToggleReviews}>
                            View {visibleReviews === reviews.length ? `Less (${DEFAULT_VISIBLE_REVIEWS})` : `More (${totalReviewCount - visibleReviews} remaining)`} Reviews
                        </Button>
                    )}
                </div>
            ) : (
                 <p className="text-sm text-muted-foreground">No reviews yet for this service.</p>
            )}
        </TabsContent>
     );
}

// Policies Tab Component
interface ServicePoliciesTabProps {
    policies?: SerializedPolicies; // Use SerializedPolicies
}
const ServicePoliciesTab: React.FC<ServicePoliciesTabProps> = ({ policies }) => (
    <TabsContent value="policies">
        <h3 className="font-semibold text-lg mb-3">Service Policies</h3>
        {/* Check specifically for listOfPolicies */}
        {(policies?.listOfPolicies && policies.listOfPolicies.length > 0) ? (
            <div className="space-y-4">
                {policies.listOfPolicies.map((policy, index) => (
                    <div key={policy.name + index}> {/* Use name + index for key */}
                        <h4 className="font-medium mb-1 text-sm">{policy.name}</h4>
                        <p className="text-sm text-muted-foreground">{policy.description}</p>
                        {/* Add separator only if NOT the last item */}
                        {index < (policies.listOfPolicies?.length ?? 0) - 1 && <Separator className="my-4" />}
                    </div>
                ))}
            </div>
        ) : (
             <p className="text-sm text-muted-foreground">No specific policies listed.</p>
        )}
    </TabsContent>
);

// --- Main Tabs Component Props ---
interface ServiceTabsProps {
    service: SerializedServiceData; // Expect serialized service data
    reviews: SerializedReviewData[]; // Expect serialized review data passed separately
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ service, reviews }) => {
    // Determine tab visibility based on the passed service object and reviews array
    const hasFeatures = service.features && service.features.length > 0;
    const hasReviews = reviews.length > 0;
    const hasPolicies = service.policies?.listOfPolicies && service.policies.listOfPolicies.length > 0;
    // Calculate tab count based on available content
    const tabCount = 1 + (hasFeatures ? 1 : 0) + (hasReviews ? 1 : 0) + (hasPolicies ? 1 : 0);

    return (
        <Tabs defaultValue="about" className="w-full">
            {/* Dynamic grid columns for TabsList */}
            <TabsList className={`grid w-full grid-cols-${tabCount} mb-6 bg-muted/50 rounded-lg p-1 h-auto`}>
                <TabsTrigger value="about">About</TabsTrigger>
                {hasFeatures && <TabsTrigger value="features">Features</TabsTrigger>}
                {hasReviews && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
                {hasPolicies && <TabsTrigger value="policies">Policies</TabsTrigger>}
            </TabsList>

            {/* Render Tab Content Components */}
            <ServiceAboutTab description={service.description} />
            {hasFeatures && <ServiceFeaturesTab features={service.features || []} />}
            {/* Pass reviews array and rating object */}
            {hasReviews && <ServiceReviewsTab reviews={reviews} rating={service.rating} />}
            {hasPolicies && <ServicePoliciesTab policies={service.policies} />}
        </Tabs>
    );
};

export default ServiceTabs;