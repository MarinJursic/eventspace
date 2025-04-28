// components/service/details/ServiceImageGallery.tsx
"use client"; // Keep client directive if using state/hooks like onSelectImage

import React from 'react';
import { cn } from '@/lib/utils'; // Import cn

// --- Import or Define Serialized Types ---
interface SerializedImage {
    url: string;
    alt?: string;
    caption?: string;
}
// --- End Type Definitions ---

// --- Updated Props ---
interface ServiceImageGalleryProps {
    images: SerializedImage[]; // Use serialized type
    mainImage: string;
    serviceName: string; // Renamed prop for clarity
    onSelectImage: (url: string) => void;
}

const ServiceImageGallery: React.FC<ServiceImageGalleryProps> = ({
    images = [], // Default to empty array
    mainImage,
    serviceName, // Use renamed prop
    onSelectImage,
}) => {
    // Handle cases where images might be empty or mainImage not set initially
    const currentMainImageUrl = mainImage || images[0]?.url || "https://via.placeholder.com/800x450?text=No+Image";
    const currentMainImageAlt = images.find(img => img.url === currentMainImageUrl)?.alt || `Main view of ${serviceName}`;


    if (images.length === 0 && !mainImage) {
        return (
            <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No Image Available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md bg-muted">
                <img
                    src={currentMainImageUrl}
                    alt={currentMainImageAlt}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    key={currentMainImageUrl}
                />
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {images.map((image, index) => (
                        <div
                            key={image.url + index}
                            className={cn( // Use cn for conditional classes
                                "aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-all duration-200",
                                mainImage === image.url
                                ? "border-primary opacity-100"
                                : "border-transparent opacity-60 hover:opacity-100 hover:border-muted-foreground/50"
                            )}
                            onClick={() => onSelectImage(image.url)}
                            role="button"
                            aria-label={image.caption || `View image ${index + 1}`}
                        >
                            <img
                                src={image.url}
                                alt={image.alt || `${serviceName} - view ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy" // Lazy load thumbnails
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServiceImageGallery;