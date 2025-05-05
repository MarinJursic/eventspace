"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import BasicInfoStep from "@/components/venue/create/steps/basic-info/BasicInfoStep";
import LocationStep from "@/components/venue/create/steps/location/LocationStep";
import MediaStep from "@/components/MediaStep";
import AmenitiesStep from "@/components/venue/create/steps/amenities/AmenitiesStep";
import ServicesStep from "@/components/venue/create/steps/services/ServicesStep";
import PoliciesStep from "@/components/venue/create/steps/policies/PoliciesStep";
import AvailabilityStep from "@/components/venue/create/steps/availability/AvailabilityStep";
import PricingStep from "@/components/venue/create/steps/PricingStep";
import ReviewStep from "@/components/venue/create/steps/ReviewStep";
import {
  createVenueAction,
  CreateVenueActionState,
} from "@/lib/actions/venueActions";
import { IVenueClientState } from "@/types/venue.types";
import { defaultVenueClientState } from "@/lib/defaults/venue.default";
import checkVenueValidityOnStep from "@/lib/utils/create-venue/checkVenueValidity";
import clsx from "clsx";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
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
  );
}

const CreateVenue: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [venue, setVenue] = useState<IVenueClientState>(
    defaultVenueClientState
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const initialState: CreateVenueActionState = { success: false, message: "" };
  // `action` will be passed to the form's action prop
  // `formState` will hold the result from the server action
  const [formState, formAction] = useActionState(
    createVenueAction,
    initialState
  );

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

  if (!session) {
    router.push("/");
  }

  // Callback for MediaStep to update this component's file list
  const handleFilesUpdate = useCallback((files: File[]) => {
    setSelectedFiles(files);
    console.log("Parent received updated files:", files.length);
  }, []); // No dependencies needed if it only calls setSelectedFiles

  // --- Effect to handle action response ---
  useEffect(() => {
    if (formState?.success) {
      toast({
        title: "Venue Submitted",
        description: formState.message,
      });
      // Optionally redirect after a delay or based on response
      // router.push('/vendor/venues');
      // Reset local state maybe? Or rely on redirect.
      // setVenue(defaultVenueClientState);
      // setCurrentStep(0);
    } else if (formState && !formState.success && formState.message) {
      // Display specific field errors if available
      let description = formState.message;
      if (formState.errors?.fieldErrors) {
        description +=
          "\n" +
          Object.entries(formState.errors.fieldErrors)
            .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
            .join("\n");
      }
      toast({
        title: "Submission Failed",
        description: description,
        variant: "destructive",
      });
    }
  }, [formState, toast, router]);
  // --- End Effect ---

  const handleNext = () => {
    window.scrollTo(0, 0);
    setCurrentStep(Math.min(currentStep + 1, 9));
  };

  const handlePrevious = () => {
    window.scrollTo(0, 0);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Effect for Blob URL Cleanup on component unmount
  useEffect(() => {
    const imagesToClean = venue.images;
    return () => {
      console.log("CreateVenue cleanup: Revoking blob URLs...");
      imagesToClean?.forEach((image) => {
        if (image.url?.startsWith("blob:")) {
          console.log("Revoking:", image.url);
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [venue.images]); // Re-run if the images array reference changes

  const renderStepContent = () => {
    // Pass venue state and setter to each step component
    // These components now ONLY manage their part of the IVenueClientState
    switch (currentStep) {
      case 0:
        return <BasicInfoStep venue={venue} setVenue={setVenue} />;
      case 1:
        return <LocationStep venue={venue} setVenue={setVenue} />;
      //case 2:
      //  return <CategoriesStep venue={venue} setVenue={setVenue} />;
      case 2:
        return <AmenitiesStep venue={venue} setVenue={setVenue} />;
      case 4:
        return <ServicesStep venue={venue} setVenue={setVenue} />;
      case 5:
        return <PoliciesStep venue={venue} setVenue={setVenue} />;
      case 6:
        return <AvailabilityStep venue={venue} setVenue={setVenue} />;
      case 7:
        return <PricingStep venue={venue} setVenue={setVenue} />;
      case 8:
        return <ReviewStep venue={venue} />; // Review step shows current state
      default:
        return null;
    }
  };

  const isStepValid = checkVenueValidityOnStep(venue, currentStep);
  const { pending } = useFormStatus(); // Get pending state for disabling nav buttons

  // --- Client Action Wrapper to Append Files ---
  const clientActionWrapper = async (formData: FormData) => {
    console.log(
      "Client Action Wrapper: Appending files before calling server action..."
    );
    // Append files from state to the FormData object
    selectedFiles.forEach((file) => {
      // IMPORTANT: Use the key "files" which the server action expects
      formData.append("files", file, file.name);
    });
    console.log(
      `Client Action Wrapper: Appended ${selectedFiles.length} files.`
    );
    // Call the actual server action (bound via useActionState)
    formAction(formData);
  };
  // --- End Client Action Wrapper ---

  return (
    <div className="max-w-3xl mx-auto mt-20 pb-16">
      {/* --- Form Element Wraps Everything --- */}
      {/* The action prop points to the server action */}
      <form action={clientActionWrapper}>
        {/* --- Hidden Inputs for Complex Data --- */}
        {/* Since FormData struggles with deep objects/arrays, stringify them */}
        {/* Adjust names to match what the server action expects */}
        <input
          type="hidden"
          name="location.address"
          value={venue.location.address || "/"}
        />
        <input type="hidden" name="location.city" value={venue.location.city} />
        <input
          type="hidden"
          name="location.street"
          value={venue.location.street}
        />
        <input
          type="hidden"
          name="location.houseNumber"
          value={venue.location.houseNumber}
        />
        <input
          type="hidden"
          name="location.country"
          value={venue.location.country}
        />
        <input
          type="hidden"
          name="location.postalCode"
          value={venue.location.postalCode}
        />
        <input
          type="hidden"
          name="location.lat"
          value={venue.location.lat || ""}
        />
        <input
          type="hidden"
          name="location.lng"
          value={venue.location.lng || ""}
        />
        <input
          type="hidden"
          name="price.basePrice"
          value={venue.price.basePrice}
        />
        <input type="hidden" name="price.model" value={venue.price.model} />
        <input
          type="hidden"
          name="seating.seated"
          value={venue.seating?.seated || 0}
        />
        <input
          type="hidden"
          name="seating.standing"
          value={venue.seating?.standing || 0}
        />
        {/* Send arrays as comma-separated strings */}
        <input
          type="hidden"
          name="amenities"
          value={venue.amenities?.join(",") || ""}
        />
        <input
          type="hidden"
          name="services"
          value={venue.services?.join(",") || ""}
        />
        {/* Send nested arrays/objects as JSON strings */}
        <input
          type="hidden"
          name="policies.bannedServices"
          value={venue.policies?.bannedServices?.join(",") || ""}
        />
        <input
          type="hidden"
          name="policies.listOfPolicies"
          value={JSON.stringify(venue.policies?.listOfPolicies || [])}
        />
        {/* <input type="hidden" name="availabilityRules.blockedWeekdays" value={JSON.stringify(venue.availabilityRules?.blockedWeekdays || [])} /> */}
        <input type="hidden" name="category" value={venue.category} />
        {/* Add other hidden fields for data managed by steps but needed by action */}
        <input type="hidden" name="name" value={venue.name} />
        <input type="hidden" name="description" value={venue.description} />
        <input type="hidden" name="type" value={venue.type} />
        {/* Note: Images are handled via file inputs in MediaStep named "files" */}
        {/* --- End Hidden Inputs --- */}

        <div
          className={clsx(
            "mt-8 bg-white rounded-xl border shadow-sm p-6 min-h-[450px]",
            currentStep === 3 ? "hidden" : "block"
          )}
        >
          {renderStepContent()}
        </div>

        <div
          className={clsx(
            "mt-8 bg-white rounded-xl border shadow-sm p-6 min-h-[450px]",
            currentStep === 3 ? "block" : "hidden"
          )}
        >
          <MediaStep
            entity={venue}
            setEntity={setVenue}
            onFilesUpdate={handleFilesUpdate}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button" // Prevent form submission
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || pending} // Disable if pending
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < 8 ? (
              <Button
                type="button" // Prevent form submission
                onClick={handleNext}
                disabled={!isStepValid || pending} // Disable if pending
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              // Use the dedicated SubmitButton component
              <SubmitButton />
            )}
          </div>
        </div>
      </form>{" "}
      {/* --- End Form Element --- */}
    </div>
  );
};

export default CreateVenue;
