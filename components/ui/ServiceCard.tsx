import React from "react"; // Import memo
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button"; // Assuming path is correct

interface ServiceCardProps {
  id: string; // Changed to required string (UUID or Mongoose ObjectId string)
  name: string;
  image: string; // URL string
  category: string; // Service type/category label
  price: string; // Pre-formatted price string (e.g., "$100 / hour")
  rating: number; // Average rating
  reviewCount: number;
  className?: string;
  children?: React.ReactNode; // For badges like 'Recommended' or 'Sponsored'
}

// Renamed component for use with memo
const ServiceCardComponent: React.FC<ServiceCardProps> = ({
  id, // No default needed, should always be provided
  name,
  image,
  category,
  price,
  rating,
  reviewCount,
  className,
  children, // Render any passed children (like badges)
}) => {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg", // Use card theme variables, ensure full height
        className
      )}
    >
      {/* Category Badge - Placed inside for better layering context */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-block bg-background/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium rounded-full border">
          {category}
        </span>
      </div>

      {/* Slot for additional badges/children (e.g., 'Recommended') */}
      {children}

      {/* Image Section */}
      <div className="aspect-[3/2] w-full overflow-hidden"> {/* Common aspect ratio */}
        {/* Use Next.js Image component in the future for optimization if applicable */}
        <img
          src={image}
          alt={`Image for ${name}`} // More descriptive alt text
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          width={300} // Provide width/height hints if known
          height={200}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-4"> {/* Slightly less padding */}
        {/* Name and Rating */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-base leading-snug flex-1 mr-1"> {/* Adjusted size/leading */}
            {/* Link wrapper for name could be added here if desired */}
            {name}
          </h3>
          {/* Rating Badge - only show if rating > 0 */}
          {rating > 0 && (
             <div className="flex shrink-0 items-center bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300/50">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                <span className="text-xs font-medium">{rating.toFixed(1)}</span>
             </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 text-sm"> {/* Adjusted margin */}
          <span className="font-medium text-foreground">{price}</span>
          {/* Potential addition: price model clarification if needed */}
          {/* {priceModel && <span className="text-muted-foreground text-xs"> ({priceModel})</span>} */}
        </div>

        {/* Review Count - only show if reviews exist */}
        {reviewCount > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </p>
        )}

        {/* Action Button - Pushed to bottom */}
        <div className="mt-auto pt-4">
          <Button
            variant="outline"
            size="sm" // Slightly smaller button
            className="w-full rounded-lg group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200"
            asChild
          >
            {/* Use the string ID in the link */}
            <Link href={`/services/${id}`} prefetch={false}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Wrap the component with React.memo for performance optimization
const ServiceCard = React.memo(ServiceCardComponent);

export default ServiceCard;