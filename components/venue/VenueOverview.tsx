"use client";

import React from "react";
import { MapPin, Star, Users } from "lucide-react";

interface VenueOverviewProps {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  capacity: string;
}

const VenueOverview: React.FC<VenueOverviewProps> = ({
  name,
  address,
  rating,
  reviewCount,
  capacity,
}) => {
  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl font-bold">{name}</h1>
      <div className="flex items-center mt-2 text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{address}</span>
      </div>
      <div className="flex items-center mt-2">
        <div className="flex items-center bg-primary/5 text-primary px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="mx-1 text-muted-foreground">•</span>
          <span className="text-muted-foreground">{reviewCount} reviews</span>
        </div>
        <div className="ml-3 flex items-center">
          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{capacity}</span>
        </div>
      </div>
    </div>
  );
};

export default VenueOverview;
