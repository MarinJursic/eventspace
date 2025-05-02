// components/service/details/ServiceTabs.tsx
"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Star, Check } from "lucide-react";
// Import the icon mapping and default icon for features
import {
  serviceFeatureIconMap,
  DefaultFeatureIcon,
} from "./serviceFeatureIcons";

// --- Define Serialized Types (Matching Server Action Output) ---
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
}
// Define Populated Feature Type (matching Server Action output)
interface PopulatedFeatureClient {
  _id: string;
  id: string;
  key: string;
  label: string;
  icon?: string;
}
interface SerializedServiceData {
  id: string;
  _id: string;
  name: string;
  description?: string;
  features?: PopulatedFeatureClient[]; // Expect populated features
  policies?: SerializedPolicies;
  rating: SerializedRating;
  // Add other fields if needed by tabs
}
interface SerializedReviewData {
  id: string;
  _id: string;
  user: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
// --- End Type Definitions ---

// --- Tab Content Components ---

const ServiceAboutTab: React.FC<{ description?: string }> = ({
  description,
}) => (
  <TabsContent value="about">
    <h3 className="font-semibold text-lg mb-2">Description</h3>
    <p className="text-muted-foreground whitespace-pre-wrap">
      {description || "No description available."}
    </p>
  </TabsContent>
);

// Updated ServiceFeaturesTab to use PopulatedFeatureClient
interface ServiceFeaturesTabProps {
  features?: PopulatedFeatureClient[]; // Expect array of objects
}
const ServiceFeaturesTab: React.FC<ServiceFeaturesTabProps> = ({
  features = [],
}) => (
  <TabsContent value="features">
    <h3 className="font-semibold text-lg mb-3">What&apos;s Included</h3>
    {features.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((feature) => {
          // Get icon based on feature.key or feature.icon string
          const IconComponent =
            serviceFeatureIconMap[feature.key] || DefaultFeatureIcon;
          return (
            // Use feature.id (virtual) or _id for key
            <div
              key={feature.id || feature._id}
              className="flex items-start p-3 bg-secondary/30 rounded-lg border"
            >
              <IconComponent className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
              {/* Display the feature label */}
              <span className="text-sm">{feature.label}</span>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">
        No specific features listed.
      </p>
    )}
  </TabsContent>
);

// ServiceReviewsTab (Handles visibility state)
const DEFAULT_VISIBLE_REVIEWS: number = 3;
interface ServiceReviewsTabProps {
  reviews: SerializedReviewData[];
  rating: SerializedRating;
}
const ServiceReviewsTab: React.FC<ServiceReviewsTabProps> = ({
  reviews = [],
  rating,
}) => {
  const [visibleReviews, setVisibleReviews] = useState<number>(
    DEFAULT_VISIBLE_REVIEWS
  );
  const totalReviewCount = rating?.count ?? reviews.length;
  const averageRating = rating?.average ?? 0;
  const handleToggleReviews = () => {
    setVisibleReviews((v) =>
      v === reviews.length ? DEFAULT_VISIBLE_REVIEWS : reviews.length
    );
  };

  return (
    <TabsContent value="reviews">
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="flex items-center gap-4">
            <div className="bg-amber-100/60 border border-amber-300/50 text-amber-900 px-3 py-2 rounded-lg flex items-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
              <span className="font-semibold text-xl">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <div>
              <p className="font-medium">Based on {totalReviewCount} reviews</p>
            </div>
          </div>
          {/* Review List */}
          <div className="space-y-4">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="border border-border rounded-lg p-4 bg-background"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">
                      User (...{review.user.slice(-6)})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center bg-amber-100/60 px-1.5 py-0.5 rounded-full border border-amber-300/50">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                    <span className="text-xs font-medium text-amber-900">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment || "No comment provided."}
                </p>
              </div>
            ))}
          </div>
          {/* View More/Less Button */}
          {totalReviewCount > DEFAULT_VISIBLE_REVIEWS && (
            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={handleToggleReviews}
            >
              View{" "}
              {visibleReviews === reviews.length
                ? `Less (${DEFAULT_VISIBLE_REVIEWS})`
                : `More (${totalReviewCount - visibleReviews} remaining)`}{" "}
              Reviews
            </Button>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No reviews yet for this service.
        </p>
      )}
    </TabsContent>
  );
};

// ServicePoliciesTab Component
interface ServicePoliciesTabProps {
  policies?: SerializedPolicies;
}
const ServicePoliciesTab: React.FC<ServicePoliciesTabProps> = ({
  policies,
}) => (
  <TabsContent value="policies">
    <h3 className="font-semibold text-lg mb-3">Service Policies</h3>
    {policies?.listOfPolicies && policies.listOfPolicies.length > 0 ? (
      <div className="space-y-4">
        {policies.listOfPolicies.map((policy, index) => (
          <div key={policy.name + index}>
            <h4 className="font-medium mb-1 text-sm">{policy.name}</h4>
            <p className="text-sm text-muted-foreground">
              {policy.description}
            </p>
            {index < (policies.listOfPolicies?.length ?? 0) - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">
        No specific policies listed.
      </p>
    )}
  </TabsContent>
);

// --- Main Tabs Component Props ---
interface ServiceTabsProps {
  service: SerializedServiceData; // Expect serialized service data
  reviews: SerializedReviewData[]; // Expect serialized review data passed separately
}

// --- Main Tabs Component ---
const ServiceTabs: React.FC<ServiceTabsProps> = ({ service, reviews }) => {
  // Determine tab visibility based on the passed service object and reviews array
  const hasFeatures = service.features && service.features.length > 0;
  const hasReviews = reviews.length > 0;
  const hasPolicies =
    service.policies?.listOfPolicies &&
    service.policies.listOfPolicies.length > 0;
  const tabCount =
    1 + (hasFeatures ? 1 : 0) + (hasReviews ? 1 : 0) + (hasPolicies ? 1 : 0);

  return (
    <Tabs defaultValue="about" className="w-full">
      {/* Dynamic grid columns for TabsList */}
      <TabsList
        className={`grid w-full grid-cols-${tabCount} mb-6 bg-muted/50 rounded-lg p-1 h-auto`}
      >
        <TabsTrigger value="about">About</TabsTrigger>
        {hasFeatures && <TabsTrigger value="features">Features</TabsTrigger>}
        {hasReviews && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
        {hasPolicies && <TabsTrigger value="policies">Policies</TabsTrigger>}
      </TabsList>

      {/* Render Tab Content Components */}
      <ServiceAboutTab description={service.description} />
      {/* Pass the populated features array */}
      {hasFeatures && <ServiceFeaturesTab features={service.features || []} />}
      {/* Pass reviews array and rating object */}
      {hasReviews && (
        <ServiceReviewsTab reviews={reviews} rating={service.rating} />
      )}
      {hasPolicies && <ServicePoliciesTab policies={service.policies} />}
    </Tabs>
  );
};

export default ServiceTabs;
