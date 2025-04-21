import React from 'react';
import { MockService } from '@/lib/mockServices'; // Import type

interface ServiceImageGalleryProps {
  images: MockService['images'];
  mainImage: string;
  venueName: string; // Use venueName for consistency if ServiceCard uses it, otherwise serviceName
  onSelectImage: (url: string) => void;
}

const ServiceImageGallery: React.FC<ServiceImageGalleryProps> = ({
  images,
  mainImage,
  venueName,
  onSelectImage,
}) => {
  if (!images || images.length === 0) {
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
          src={mainImage}
          alt={images.find(img => img.url === mainImage)?.alt || `Main view of ${venueName}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          key={mainImage} // Trigger transition on change
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div
              key={image.url + index}
              className={`aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                mainImage === image.url
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-muted-foreground/50"
              }`}
              onClick={() => onSelectImage(image.url)}
              role="button"
              aria-label={image.caption || `View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.alt || `${venueName} - view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceImageGallery;