"use client";

import React from "react";

interface VenueGalleryProps {
  images: string[];
  mainImage: string;
  onSelectImage: (image: string) => void;
  venueName: string;
}

const VenueGallery: React.FC<VenueGalleryProps> = ({
  images,
  mainImage,
  onSelectImage,
  venueName,
}) => {
  return (
    <div className="space-y-4">
      <div className="aspect-[16/9] overflow-hidden rounded-xl">
        <img
          src={mainImage || images[0]}
          alt={venueName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`aspect-square overflow-hidden rounded-lg cursor-pointer border-2 ${
              mainImage === image ? "border-primary" : "border-transparent"
            }`}
            onClick={() => onSelectImage(image)}
          >
            <img
              src={image}
              alt={`${venueName} - view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueGallery;
