// File: /app/vendor/venues/create-service/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom"; // React hooks for Server Actions
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import clsx from "clsx"; // For conditional classes

// Step Component Imports (Service Specific)
import BasicInfoStep from "@/components/service/create/steps/basic-info/BasicInfoStep";
import LocationStep from "@/components/service/create/steps/location/LocationStep";
import MediaStep from "@/components/MediaStep";
import FeaturesStep from "@/components/service/create/steps/features/FeaturesStep";
import PoliciesStep from "@/components/service/create/steps/PoliciesStep";
import AvailabilityStep from "@/components/service/create/steps/availability/AvailabilityStep";
import PricingStep from "@/components/service/create/steps/PricingStep";
import ReviewStep from "@/components/service/create/steps/ReviewStep";

// Import Server Action and State Type (Service Specific)
import {
  createServiceAction,
  CreateServiceActionState,
} from "@/lib/actions/serviceActions"; // Adjust path
import { IServiceClientState } from "@/types/service.types"; // Adjust path
import { defaultServiceClientState } from "@/lib/defaults/service.default"; // Adjust path
import checkServiceValidityOnStep from "@/lib/utils/create-service/checkServiceValidity"; // Adjust path

// --- Submit Button Component ---
// Uses useFormStatus to automatically track the form's pending state
function SubmitButton() {
  const { pending } = useFormStatus(); // Get pending state from form context

  return (
    <Button type="submit" disabled={pending} className="min-w-[150px]">
      {" "}
      {/* Added min-width */}
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" /> Submit Service
        </>
      )}
    </Button>
  );
}
// --- End Submit Button ---

// --- Main CreateService Component ---
const CreateService: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  // State for building the service data across steps (includes image previews with blob URLs)
  const [service, setService] = useState<IServiceClientState>(
    defaultServiceClientState
  );
  // State specifically for holding the actual File objects selected in MediaStep
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // --- useActionState Hook for Server Action ---
  const initialState: CreateServiceActionState = {
    success: false,
    message: "",
  };
  // `formAction` is the function to call the server action.
  // `formState` holds the latest return value from `createServiceAction`.
  const [formState, formAction] = useActionState(
    createServiceAction,
    initialState
  );
  // --- End useActionState ---

  // Session check
  const { data: session } = useSession({
    required: true, // Redirects if not authenticated
    onUnauthenticated() {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a service.",
        variant: "destructive",
      });
      router.push("/"); // Redirect to home or login page
    },
  });

  if (!session) {
    router.push("/");
  }

  // Callback passed to MediaStep to update the list of actual File objects
  const handleFilesUpdate = useCallback((files: File[]) => {
    setSelectedFiles(files);
    console.log("Parent (CreateService) received updated files:", files.length);
  }, []); // Empty dependency array as it only calls setSelectedFiles

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
  // --- End Response Handling Effect ---

  // --- Effect for Cleaning Up Blob URLs ---
  // Runs when the component unmounts
  useEffect(() => {
    const imagesToClean = service.images; // Capture the current images array
    return () => {
      console.log("CreateService cleanup: Revoking blob URLs...");
      imagesToClean?.forEach((image) => {
        // Check if the URL is a blob URL before revoking
        if (image.url?.startsWith("blob:")) {
          console.log("Revoking:", image.url);
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [service.images]); // Dependency ensures cleanup uses the latest image list if it changes
  // --- End Cleanup Effect ---

  // --- Navigation Handlers ---
  const handleNext = () => {
    if (!isStepValid) {
      toast({
        title: "Incomplete Step",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    window.scrollTo(0, 0);
    setCurrentStep(Math.min(currentStep + 1, 8)); // 9 steps total (0-8)
  };

  const handlePrevious = () => {
    window.scrollTo(0, 0);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  // --- End Navigation Handlers ---

  // --- Step Validation ---
  const isStepValid = checkServiceValidityOnStep(service, currentStep);
  // --- End Step Validation ---

  // --- Client Action Wrapper to Append Files ---
  // This function intercepts the form submission, adds files, then calls the server action
  const clientActionWrapper = async (formData: FormData) => {
    console.log("Client Action Wrapper (Service): Appending files...");
    selectedFiles.forEach((file) => {
      // Use the key "files" that the server action expects
      formData.append("files", file, file.name);
    });
    console.log(
      `Client Action Wrapper (Service): Appended ${selectedFiles.length} files.`
    );
    // Call the actual server action function bound by useActionState
    formAction(formData);
  };
  // --- End Client Action Wrapper ---

  // --- Function to Render Step Content (Excluding Media Step) ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep service={service} setService={setService} />;
      case 1:
        return <LocationStep service={service} setService={setService} />;
      //case 2:
      //  return <CategoriesStep service={service} setService={setService} />;
      // Step 3 (MediaStep) is handled separately
      case 2:
        return <FeaturesStep service={service} setService={setService} />;
      case 4:
        return <PoliciesStep service={service} setService={setService} />;
      case 5:
        return <AvailabilityStep service={service} setService={setService} />;
      case 6:
        return <PricingStep service={service} setService={setService} />;
      case 7:
        return <ReviewStep service={service} />; // Review step shows current state
      default:
        return null;
    }
  };
  // --- End renderStepContent ---

  // --- Render Logic ---
  return (
    <div className="max-w-3xl mx-auto mt-20 pb-16">
      {/* Form uses the clientActionWrapper to ensure files are appended */}
      <form action={clientActionWrapper}>
        {/* --- Hidden Inputs for Service State Data --- */}
        {/* Pass all relevant state fields needed by the server action */}
        <input type="hidden" name="name" value={service.name} />
        <input
          type="hidden"
          name="description"
          value={service.description || ""}
        />
        <input type="hidden" name="type" value={service.type || ""} />
        <input type="hidden" name="category" value={service.category} />
        <input
          type="hidden"
          name="location.address"
          value={service.location.address}
        />
        <input
          type="hidden"
          name="location.city"
          value={service.location.city}
        />
        <input
          type="hidden"
          name="location.street"
          value={service.location.street}
        />
        <input
          type="hidden"
          name="location.houseNumber"
          value={service.location.houseNumber}
        />
        <input
          type="hidden"
          name="location.country"
          value={service.location.country}
        />
        <input
          type="hidden"
          name="location.postalCode"
          value={service.location.postalCode}
        />
        <input
          type="hidden"
          name="location.lat"
          value={service.location.lat ?? ""}
        />
        <input
          type="hidden"
          name="location.lng"
          value={service.location.lng ?? ""}
        />
        <input
          type="hidden"
          name="price.basePrice"
          value={service.price.basePrice}
        />
        <input type="hidden" name="price.model" value={service.price.model} />
        <input
          type="hidden"
          name="features"
          value={service.features?.join(",") || ""}
        />
        <input
          type="hidden"
          name="policies.listOfPolicies"
          value={JSON.stringify(service.policies?.listOfPolicies || [])}
        />
        <input
          type="hidden"
          name="availabilityRules.blockedWeekdays"
          value={JSON.stringify(
            service.availabilityRules?.blockedWeekdays || []
          )}
        />
        {/* --- End Hidden Inputs --- */}

        {/* --- Step Content Area --- */}
        {/* Container for steps OTHER than MediaStep */}
        <div
          className={clsx(
            "mt-8 bg-white rounded-xl border shadow-sm p-6 min-h-[450px]",
            currentStep === 3 ? "hidden" : "block" // Hide when on MediaStep
          )}
        >
          {renderStepContent()} {/* Renders steps 0, 1, 2, 4, 5, 6, 7, 8 */}
        </div>

        {/* Dedicated Container for MediaStep */}
        <div
          className={clsx(
            "mt-8 bg-white rounded-xl border shadow-sm p-6 min-h-[450px]",
            currentStep === 3 ? "block" : "hidden" // Show ONLY on MediaStep
          )}
        >
          {/* Pass the handleFilesUpdate callback */}
          <MediaStep
            entity={service} // Pass service state
            setEntity={setService} // Pass setter
            onFilesUpdate={handleFilesUpdate} // Pass callback
          />
        </div>
        {/* --- End Step Content Area --- */}

        {/* --- Navigation Buttons --- */}
        <div className="flex justify-between mt-6">
          <Button
            type="button" // Prevent form submission
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0} // Disable if first step or submitting
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < 7 ? ( // If not the last step (Review step is 8)
              <Button
                type="button" // Prevent form submission
                onClick={handleNext}
                disabled={!isStepValid} // Disable if step invalid or submitting
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              // If on the last step (Review step)
              <SubmitButton /> // Renders the submit button with pending state
            )}
          </div>
        </div>
        {/* --- End Navigation Buttons --- */}
      </form>{" "}
      {/* --- End Form Element --- */}
    </div>
  );
};

export default CreateService;
