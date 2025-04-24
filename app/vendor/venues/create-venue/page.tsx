// File: /app/vendor/venues/create-venue/page.tsx

"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";

// Step Component Imports (Ensure paths point to VENUE steps)
import BasicInfoStep from "@/components/venue/create/steps/basic-info/BasicInfoStep";
import LocationStep from "@/components/venue/create/steps/location/LocationStep";
import CategoriesStep from "@/components/venue/create/steps/categories/CategoriesStep";
import MediaStep from "@/components/venue/create/steps/MediaStep"; // Use the updated Venue MediaStep
import AmenitiesStep from "@/components/venue/create/steps/amenities/AmenitiesStep";
import ServicesStep from "@/components/venue/create/steps/services/ServicesStep";
import PoliciesStep from "@/components/venue/create/steps/policies/PoliciesStep";
import AvailabilityStep from "@/components/venue/create/steps/availability/AvailabilityStep";
import PricingStep from "@/components/venue/create/steps/PricingStep";
import ReviewStep from "@/components/venue/create/steps/ReviewStep"; // ReviewStep will display blob: URLs

// Utility, API, Types, Defaults, Mappers
import checkVenueValidityOnStep from "@/lib/utils/create-venue/checkVenueValidity";
import createVenue from "@/lib/api/venues/createVenue";
import getUserByEmail from "@/lib/api/users/getUserByEmail";
import { IVenueClientState } from "@/types/venue.types"; // Ensure this type includes `file?: File` in images
import { defaultVenueClientState } from "@/lib/defaults/venue.default";
import { mapClientStateToVenueData } from "@/lib/mappers/venue.mapper";
import { IVenue } from "@/lib/database/schemas/venue";
import { API_CONFIG } from "@/lib/api/config";
// import { Stepper } from '@/components/ui/Stepper'; // Optional

// Define steps if using a Stepper component
// const venueSteps = [ ... ];

const CreateVenue: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a venue.",
        variant: "destructive",
      });
      router.push("/");
    },
  });

  // Initialize state using the default, which should match IVenueClientState structure
  // This state will hold images with blob URLs and File objects until submission
  const [venue, setVenue] = useState<IVenueClientState>(
    defaultVenueClientState
  );

  // --- Navigation ---
  const handleNext = () => {
    // Validate step before proceeding (optional enhancement)
    // if (!isStepValid) {
    //     toast({ title: "Incomplete Step", description: "Please fill all required fields.", variant: "destructive" });
    //     return;
    // }
    window.scrollTo(0, 0);
    setCurrentStep(Math.min(currentStep + 1, 9)); // 10 steps total (0-9)
  };

  const handlePrevious = () => {
    window.scrollTo(0, 0);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // --- Submission Logic ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    let uploadedImageUrls: { url: string; alt: string; caption: string }[] = [];
    // Ensure venue.images exists and filter images that have a File object
    const imagesWithFiles =
      venue.images?.filter((img) => img.file instanceof File) || [];
    // Keep track of blob URLs associated with the files being uploaded
    const blobUrlsToRevoke: string[] = imagesWithFiles
      .map((img) => img.url)
      .filter((url) => url?.startsWith("blob:"));

    try {
      if (!session?.user?.email) {
        toast({
          title: "Authentication Error",
          description: "User session not found.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // --- 1. Upload Images to Cloudinary (only if there are new files) ---
      if (imagesWithFiles.length > 0) {
        const formData = new FormData();
        imagesWithFiles.forEach((imgData) => {
          if (imgData.file) {
            formData.append("files", imgData.file, imgData.file.name); // Key 'files'
          }
        });

        // No intermediate toast here - only final success/failure
        console.log(
          `Attempting to upload ${imagesWithFiles.length} image(s)...`
        );

        const uploadResponse = await fetch(
          API_CONFIG.getApiRoute({ endpoint: "upload" }),
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          let errorMsg = "Image upload failed";
          try {
            const errorData = await uploadResponse.json();
            errorMsg = errorData.error || errorMsg;
            console.error("Upload API Error Response:", errorData);
          } catch (e) {
            console.error(
              "Failed to parse upload error response:",
              uploadResponse.statusText
            );
          }
          throw new Error(errorMsg);
        }

        const uploadResult = await uploadResponse.json();
        console.log("Upload API Success Response:", uploadResult);

        if (
          !uploadResult.urls ||
          !Array.isArray(uploadResult.urls) ||
          uploadResult.urls.length !== imagesWithFiles.length
        ) {
          console.error("Mismatched upload results:", uploadResult);
          throw new Error(
            "Image upload succeeded but response format was unexpected."
          );
        }

        // Map uploaded URLs back with original alt/caption
        uploadedImageUrls = uploadResult.urls.map(
          (url: string, index: number) => ({
            url: url, // The Cloudinary URL
            alt:
              imagesWithFiles[index].alt || `Image of ${venue.name || "venue"}`,
            caption:
              imagesWithFiles[index].caption ||
              imagesWithFiles[index]?.file?.name ||
              `Uploaded Image ${index + 1}`,
          })
        );
      } else {
        console.log("No new images with File objects found to upload.");
      }

      // Combine existing Cloudinary URLs (if any) with newly uploaded ones
      const finalImages = [
        // Keep images that were already Cloudinary URLs (don't have a .file property)
        ...(venue.images
          ?.filter(
            (img) => !img.file && img.url && !img.url.startsWith("blob:")
          )
          .map((img) => ({
            url: img.url,
            alt: img.alt,
            caption: img.caption,
          })) || []),
        ...uploadedImageUrls,
      ];
      console.log("Final images prepared for saving:", finalImages);

      // --- 2. Prepare Final Venue Data ---
      let users = await getUserByEmail(session.user.email);
      if (!users?.data?._id) {
        throw new Error("Could not find user data.");
      }

      // Create the final data object, replacing images array
      const finalVenueData: IVenueClientState = {
        ...venue,
        owner: users.data._id.toString(),
        location: { ...venue.location, address: venue.location.address || "/" },
        images: finalImages, // Use the combined list with Cloudinary URLs
        // Ensure other potentially optional fields are correctly handled
        amenities: venue.amenities || [],
        services: venue.services || [],
        policies: venue.policies || { bannedServices: [], listOfPolicies: [] },
        bookedDates: venue.bookedDates || [],
        availabilityRules: venue.availabilityRules || { blockedWeekdays: [] },
        seating: venue.seating || { seated: 0, standing: 0 },
        description: venue.description || "",
        type: venue.type || "",
      };
      // Remove the temporary 'file' property before mapping if the mapper doesn't handle it
      // (Alternatively, ensure the mapper ignores the 'file' property)
      // finalVenueData.images = finalVenueData.images.map(({ file, ...img }) => img);

      // --- 3. Map to Backend Schema and Submit ---
      console.log("Mapping final client state to venue data...");
      const venueDataToSave: IVenue = mapClientStateToVenueData(finalVenueData);
      console.log("Venue data ready for API:", venueDataToSave);
      const creationResult = await createVenue(venueDataToSave); // This calls POST /api/v1/venues

      // --- 4. Final Toast (Success or Failure) ---
      if (creationResult) {
        // Check if the API function indicates success (e.g., returns true)
        toast({
          title: "Venue Created Successfully",
          description: "Your venue has been submitted for approval.",
        });
        router.push("/vendor/venues"); // Navigate on success
      } else {
        // This suggests createVenue returned false or threw an error handled by it
        toast({
          title: "Failed to Create Venue",
          description:
            "Could not save venue data. Please check details and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting venue:", error);
      toast({
        title: "Submission Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during submission.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      // --- 5. Cleanup Blob URLs AFTER submission attempt ---
      console.log("Revoking blob URLs:", blobUrlsToRevoke);
      blobUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  // --- Step Rendering ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep venue={venue} setVenue={setVenue} />;
      case 1:
        return <LocationStep venue={venue} setVenue={setVenue} />;
      case 2:
        return <CategoriesStep venue={venue} setVenue={setVenue} />;
      case 3:
        return <MediaStep venue={venue} setVenue={setVenue} />;
      case 4:
        return <AmenitiesStep venue={venue} setVenue={setVenue} />;
      case 5:
        return <ServicesStep venue={venue} setVenue={setVenue} />;
      case 6:
        return <PoliciesStep venue={venue} setVenue={setVenue} />;
      case 7:
        return <AvailabilityStep venue={venue} setVenue={setVenue} />;
      case 8:
        return <PricingStep venue={venue} setVenue={setVenue} />;
      case 9:
        // Pass the current venue state (with blob URLs for previews)
        // The ReviewStep component will just display the image.url it receives.
        return <ReviewStep venue={venue} />;
      default:
        return null;
    }
  };

  // --- Validation ---
  // Consider if validation needs adjustment for MediaStep in this flow
  const isStepValid = checkVenueValidityOnStep(venue, currentStep);

  // --- JSX ---
  return (
    <div className="max-w-3xl mx-auto mt-20 pb-16">
      {/* Optional Stepper */}
      {/* <Stepper steps={venueSteps} currentStep={currentStep} onStepClick={!isSubmitting ? setCurrentStep : undefined} /> */}

      <div className="mt-8 bg-white rounded-xl border shadow-sm p-6 min-h-[450px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < 9 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid || isSubmitting}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isStepValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Submit Venue
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateVenue;
