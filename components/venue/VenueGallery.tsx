"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Import cn if needed for styling consistency
import Image from "next/image";

interface VenueGalleryProps {
  images: {
    // This structure matches Venue['images']
    url: string;
    alt?: string; // Make alt optional as per schema
    width?: number;
    height?: number;
    caption?: string; // Make caption optional
  }[];
  mainImage: string; // Current main image URL
  onSelectImage: (imageUrl: string) => void; // Callback to change main image
  venueName: string; // Name for alt text fallbacks
}

const VenueGallery: React.FC<VenueGalleryProps> = ({
  images = [], // Default to empty array to prevent errors
  mainImage,
  onSelectImage,
  venueName,
}) => {
  // Determine the source for the main image, providing a fallback
  const currentMainImageUrl =
    mainImage ||
    images[0]?.url ||
    "https://via.placeholder.com/800x450?text=No+Image";
  const currentMainImageAlt =
    images.find((img) => img.url === currentMainImageUrl)?.alt ||
    `Main view of ${venueName}`;

  return (
    <div className="space-y-3">
      {" "}
      {/* Use space-y-3 for consistency */}
      {/* Main Image Display */}
      <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md bg-muted">
        {" "}
        {/* Added shadow/bg */}
        <Image
          src={currentMainImageUrl}
          alt={currentMainImageAlt}
          className="w-full h-full object-cover transition-opacity duration-300"
          key={currentMainImageUrl} // Key helps with transitions
          fill
        />
      </div>
      {/* Thumbnails (only if more than one image) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div
              key={image.url + index} // More unique key
              className={cn(
                // Use cn for conditional classes
                "aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-all duration-200",
                mainImage === image.url
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-muted-foreground/50"
              )}
              onClick={() => onSelectImage(image.url)}
              role="button"
              aria-label={image.caption || `View image ${index + 1}`}
            >
              <Image
                fill
                src={image.url}
                // Provide better alt text fallback
                alt={image.alt || `${venueName} - view ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy" // Add lazy loading to thumbnails
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueGallery;
