/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  DragEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus, X } from "lucide-react";
import { IServiceClientState } from "@/types/service.types";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Type for the image object within the state during this step
type ServiceImageUploadState = IServiceClientState["images"][0];

export default function MediaStep({
  service,
  setService,
}: {
  service: IServiceClientState;
  setService: Dispatch<SetStateAction<IServiceClientState>>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = (files: File[]) => {
    const validFilesToAdd: ServiceImageUploadState[] = []; // Use correct type alias
    const MAX_SIZE_MB = 10;
    // Get current image identifiers (name + size) to check for duplicates
    const currentImageSignatures = new Set(
      (service.images || []).map(
        (img) => `${img.file?.name || img.caption}-${img.file?.size}`
      )
    );

    files.forEach((file) => {
      const signature = `${file.name}-${file.size}`;

      // --- Duplicate Check ---
      if (currentImageSignatures.has(signature)) {
        toast({
          title: "Duplicate Image",
          description: `${file.name} has already been added.`,
          variant: "default",
        }); // Use default/warning variant
        return; // Skip this file
      }
      // -----------------------

      // Validation
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type
        )
      ) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not supported.`,
          variant: "destructive",
        });
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds ${MAX_SIZE_MB}MB.`,
          variant: "destructive",
        });
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      validFilesToAdd.push({
        file: file,
        url: previewUrl,
        alt: `Preview of ${service.name || file.name}`, // Adjust service/service
        caption: file.name,
      });
      // Add signature to prevent adding the same file multiple times *within the same batch*
      currentImageSignatures.add(signature);
    });

    if (validFilesToAdd.length > 0) {
      setService((prev) => ({
        // Adjust setService/setService
        ...prev,
        images: [...(prev.images || []), ...validFilesToAdd],
      }));
    }
  };

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData();
      }
    },
    [processFiles]
  );

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = service.images?.[index]; // Use optional chaining

    if (imageToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setService((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [], // Handle case where images might be undefined
    }));
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    const currentImages = service.images; // Capture current images
    return () => {
      currentImages?.forEach((image) => {
        if (image.url?.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [service.images]); // Rerun if images array reference changes

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl pb-5">Media</h1>
      <p className="text-muted-foreground" style={{ marginTop: "-1.5rem" }}>
        Upload high-quality images of your service.
      </p>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          `border-2 border-dashed rounded-lg p-10 transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }
                    flex flex-col items-center justify-center text-center`
        )}
      >
        <ImagePlus size={50} className="text-muted-foreground mb-4" />
        <p className="font-medium text-lg mb-2">Drag and drop images here</p>
        <p className="text-sm text-muted-foreground mb-4">or</p>

        <label htmlFor="service-file-upload" className="cursor-pointer">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-base font-medium flex items-center hover:bg-primary/90 transition-colors">
            <Upload className="mr-2 h-5 w-5" /> Select Images
          </div>
          <input
            id="service-file-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
        <p className="text-xs text-muted-foreground mt-3">
          Max file size: 10MB. Allowed types: JPG, PNG, WEBP, GIF.
        </p>
      </div>

      {service.images && service.images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">
            Image Previews ({service.images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {service.images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={image.url}
                  alt={image.alt || `Service image ${index + 1}`}
                  className="w-full h-full object-cover rounded-md border"
                  fill
                />
                <Button
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
                  onClick={() => handleRemoveImage(index)}
                  variant="destructive"
                  type="button"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate text-center">
                    {image.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
