// components/ui/ServiceCard.tsx
import React from "react";
import Link from "next/link";
import { Star } from "lucide-react"; // Only Star needed here directly
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";
import { Badge } from "./badge"; // Import Badge
import Image from "next/image";

interface ServiceCardProps {
  id: string;
  name: string;
  image: string;
  category: string; // Service type/category label
  price: string; // Pre-formatted price string
  rating: number;
  reviewCount: number;
  className?: string;
  children?: React.ReactNode; // For Sponsored badge etc.
}

// Use React.FC directly
const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  image,
  category,
  price,
  rating,
  reviewCount,
  className,
  children, // Render children (e.g., Sponsored badge)
}) => {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg", // Consistent rounding, shadow
        className
      )}
    >
      {/* Category Badge (Top Left) */}
      {category && ( // Check if category exists
        <Badge
          variant="secondary" // Use secondary or outline
          className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm px-2.5 py-0.5 text-xs" // Consistent style
        >
          {category}
        </Badge>
      )}

      {/* Slot for other badges like Sponsored (Top Right) */}
      {children}

      {/* Image Section */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
        {" "}
        {/* Consistent Aspect Ratio & BG */}
        <Image
          src={image || "https://via.placeholder.com/400x267?text=No+Image"} // Fallback image
          alt={`Image for ${name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          width={400} // Hint
          height={240} // Hint
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-4">
        {" "}
        {/* Consistent padding */}
        {/* Name and Rating */}
        <div className="flex justify-between items-start gap-2 mb-1">
          {" "}
          {/* Consistent spacing */}
          <h3 className="font-semibold text-base leading-snug flex-1 mr-1">
            {" "}
            {/* Consistent font */}
            {/* Link the name */}
            <Link
              href={`/services/${id}`}
              className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
            >
              {name}
            </Link>
          </h3>
          {/* Rating */}
          {rating > 0 && (
            <div className="flex shrink-0 items-center bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300/50">
              {" "}
              {/* Consistent style */}
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        {/* Spacer to push price/reviews/button down */}
        <div className="flex-grow" />
        {/* Price */}
        <div className="mt-2 text-sm">
          {" "}
          {/* Consistent margin/size */}
          <span className="font-semibold text-foreground">{price} / day</span>
        </div>
        {/* Review Count */}
        {reviewCount > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
          </p>
        )}
        {/* View Details Button */}
        <div className="mt-4">
          {" "}
          {/* Consistent margin */}
          <Button
            variant="outline"
            size="sm" // Consistent size
            className="w-full rounded-lg group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200" // Consistent style
            asChild
          >
            <Link href={`/services/${id}`} prefetch={false}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Removed React.memo wrapper unless specifically needed and profiled
export default ServiceCard;
