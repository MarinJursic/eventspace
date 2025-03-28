"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "../ui/separator";
import { MapPin } from "lucide-react";
import { Button } from "../ui/button";

interface Amenity {
  name: string;
  icon: React.ComponentType<any>;
}

interface Review {
  id: number;
  user: string;
  date: string;
  rating: number;
  comment: string;
}

interface Policies {
  cancellation: string;
  security: string;
  noise: string;
  cleaning: string;
}

interface VenueTabsProps {
  longDescription: string;
  address: string;
  amenities: Amenity[];
  reviews: Review[];
  policies: Policies;
}

const VenueTabs: React.FC<VenueTabsProps> = ({
  longDescription,
  address,
  amenities,
  reviews,
  policies,
}) => {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="space-y-6">
        <div>
          <h3 className="font-display text-lg font-semibold mb-2">
            Description
          </h3>
          <p className="text-muted-foreground">{longDescription}</p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold mb-2">Location</h3>
          <div className="aspect-[16/9] overflow-hidden rounded-lg bg-secondary/50 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                Interactive map would be displayed here
              </p>
              <p className="font-medium mt-2">{address}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="amenities" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-secondary/20 rounded-lg"
            >
              <amenity.icon className="h-5 w-5 mr-3 text-primary" />
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary/5 text-primary px-3 py-2 rounded-lg flex items-center mr-4">
            <span className="font-semibold text-xl">
              {reviews[0]?.rating.toFixed(1)}
            </span>
          </div>
          <div>
            <p className="font-medium">{reviews.length} reviews</p>
            <p className="text-sm text-muted-foreground">
              From verified bookings
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-border rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.user}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                <div className="flex items-center bg-primary/5 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full">
          View All Reviews
        </Button>
      </TabsContent>

      <TabsContent value="policies" className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Cancellation Policy</h4>
            <p className="text-sm text-muted-foreground">
              {policies.cancellation}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-1">Security Deposit</h4>
            <p className="text-sm text-muted-foreground">{policies.security}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-1">Noise Restrictions</h4>
            <p className="text-sm text-muted-foreground">{policies.noise}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-1">Cleaning</h4>
            <p className="text-sm text-muted-foreground">{policies.cleaning}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default VenueTabs;
