"use client";

import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  DragEvent,
  ChangeEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus, X } from "lucide-react";
// Import both types - the component needs to handle either
import { IVenueClientState } from "@/types/venue.types"; // Adjust path if needed
import { IServiceClientState } from "@/types/service.types"; // Adjust path
import { useToast } from "@/hooks/useToast"; // Adjust path if needed
import { cn } from "@/lib/utils"; // Adjust path if needed
import Image from "next/image";

// Type for the image object within the state during this step (used for previews)
// This structure should be compatible with both IVenueClientState['images'] and IServiceClientState['images']
type ImageUploadPreviewState = {
  file?: File; // Keep track of the file associated with the preview
  url: string; // Blob URL for preview
  alt: string;
  caption: string;
};

// Use a generic type for the state object passed in
type EntityClientState = IVenueClientState | IServiceClientState;

// Props for the generic MediaStep component
interface MediaStepProps<T extends EntityClientState> {
  entity: T; // Use generic 'entity' instead of 'venue' or 'service'
  setEntity: Dispatch<SetStateAction<T>>; // Use generic setter
  onFilesUpdate: (files: File[]) => void; // Callback to update parent's file list
}

export default function MediaStep<T extends EntityClientState>({
  entity,
  setEntity,
  onFilesUpdate,
}: MediaStepProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Local state to keep track of File objects corresponding to the previews shown
  // Initialize based on any File objects already present in the parent's entity state
  const [currentFiles, setCurrentFiles] = useState<File[]>(() => {
    return (
      entity.images
        ?.map((img) => img.file)
        .filter((f): f is File => f instanceof File) || []
    );
  });

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Processes newly selected files (from drop or select)
  const processFiles = useCallback(
    (newFiles: File[]) => {
      const validFilesToAddForPreview: ImageUploadPreviewState[] = [];
      const filesToPassUp: File[] = [...currentFiles]; // Start with existing tracked files
      const MAX_SIZE_MB = 10;
      // Use local file state for duplicate check signatures
      const currentImageSignatures = new Set(
        currentFiles.map((f) => `${f.name}-${f.size}`)
      );

      newFiles.forEach((file) => {
        const signature = `${file.name}-${file.size}`;

        // --- Duplicate Check ---
        if (currentImageSignatures.has(signature)) {
          toast({
            title: "Duplicate Image",
            description: `${file.name} already added.`,
            variant: "default",
          });
          return;
        }
        // --- Validation ---
        if (
          !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
            file.type
          )
        ) {
          toast({
            title: "Invalid File Type",
            description: `${file.name} not supported.`,
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

        // --- Prepare for State Update ---
        const previewUrl = URL.createObjectURL(file);
        validFilesToAddForPreview.push({
          file: file, // Include the File object
          url: previewUrl, // Blob URL for preview
          alt: `Preview of ${entity.name || file.name}`, // Use generic entity.name
          caption: file.name,
        });
        filesToPassUp.push(file); // Add the valid File object to the list for the parent
        currentImageSignatures.add(signature);
      });

      // --- Update State if new valid files were found ---
      if (validFilesToAddForPreview.length > 0) {
        // Update parent's `entity.images` state for previews
        setEntity((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...validFilesToAddForPreview],
        }));
        // Update local tracking of File objects
        setCurrentFiles(filesToPassUp);
        // --- IMPORTANT: Update parent's actual File list via callback ---
        onFilesUpdate(filesToPassUp);
      }
    },
    // Dependencies for useCallback
    [currentFiles, entity.name, setEntity, onFilesUpdate, toast]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData(); // Good practice
      }
    },
    [processFiles] // Dependency
  );

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = ""; // Reset file input
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const imageToRemove = entity.images?.[indexToRemove];

    // Revoke the blob URL associated with the preview being removed
    if (imageToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Update parent state for previews (remove the item at the index)
    setEntity((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== indexToRemove) || [],
    }));

    // Update local file state (remove the file at the same index)
    const updatedFiles = currentFiles.filter((_, i) => i !== indexToRemove);
    setCurrentFiles(updatedFiles);

    // --- IMPORTANT: Update parent's actual File list via callback ---
    onFilesUpdate(updatedFiles);
  };

  // Cleanup logic is now handled by the parent component (`CreateVenue` or `CreateService`)

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl pb-5">Media</h1>
      <p className="text-muted-foreground" style={{ marginTop: "-1.5rem" }}>
        Upload high-quality images (e.g., main space, entrance, unique
        features).
      </p>

      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          `border-2 border-dashed rounded-lg p-10 transition-colors duration-200 ease-in-out`,
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400",
          `flex flex-col items-center justify-center text-center`
        )}
      >
        <ImagePlus size={50} className="text-muted-foreground mb-4" />
        <p className="font-medium text-lg mb-2">Drag and drop images here</p>
        <p className="text-sm text-muted-foreground mb-4">or</p>

        {/* File Input Trigger */}
        <label htmlFor="entity-file-upload" className="cursor-pointer">
          {" "}
          {/* Changed ID */}
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-base font-medium flex items-center hover:bg-primary/90 transition-colors">
            <Upload className="mr-2 h-5 w-5" /> Select Images
          </div>
          {/* Actual File Input (Hidden) - NO name attribute */}
          <input
            id="entity-file-upload" // Changed ID
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            // No 'name' attribute here
          />
        </label>
        <p className="text-xs text-muted-foreground mt-3">
          Max file size: 10MB. Allowed types: JPG, PNG, WEBP, GIF.
        </p>
      </div>

      {/* Image Previews Section */}
      {/* Uses entity.images from parent state for previews */}
      {entity.images && entity.images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">
            Image Previews ({entity.images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {entity.images.map((image, index) => (
              <div
                key={image.url}
                className="relative group aspect-square bg-muted rounded-md overflow-hidden border"
              >
                <Image
                  src={image.url} // Blob URL for preview
                  alt={image.alt || `Uploaded image ${index + 1}`}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {/* Remove Button */}
                <Button
                  size="icon"
                  className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1 bg-destructive/80 hover:bg-destructive"
                  onClick={() => handleRemoveImage(index)}
                  variant="destructive"
                  type="button" // Important: prevent form submission
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
                {/* Optional Caption Display */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 text-white text-xs truncate text-center">
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
