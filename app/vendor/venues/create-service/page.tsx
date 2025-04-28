// /app/vendor/venues/create-service/page.tsx

"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";

// Step Component Imports (Ensure paths point to SERVICE steps)
import BasicInfoStep from '@/components/service/create/steps/basic-info/BasicInfoStep';
import LocationStep from '@/components/service/create/steps/location/LocationStep';
import CategoriesStep from '@/components/service/create/steps/categories/CategoriesStep';
import MediaStep from '@/components/service/create/steps/MediaStep'; // Use the generic MediaStep
import FeaturesStep from '@/components/service/create/steps/features/FeaturesStep'; // Corrected import
import PoliciesStep from '@/components/service/create/steps/PoliciesStep';
import AvailabilityStep from '@/components/service/create/steps/availability/AvailabilityStep';
import PricingStep from '@/components/service/create/steps/PricingStep';
import ReviewStep from '@/components/service/create/steps/ReviewStep'; // ReviewStep displays previews

// Utility, API, Types, Defaults, Mappers
import checkServiceValidityOnStep from '@/lib/utils/create-service/checkServiceValidity';
import createService from '@/lib/api/services/createService'; // Use service API
import getUserByEmail from '@/lib/api/users/getUserByEmail';
import { IServiceClientState } from '@/types/service.types'; // Use service type
import { defaultServiceClientState } from '@/lib/defaults/service.default'; // Use service default
import { mapClientStateToServiceData } from '@/lib/mappers/service.mapper'; // Use service mapper
import { IService } from '@/lib/database/schemas/service'; // Use service schema type
import { API_CONFIG } from "@/lib/api/config";
// import { Stepper } from '@/components/ui/Stepper'; // Optional

// Define steps if using a Stepper component
// const serviceSteps = [ ... ];

export default function CreateService () {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            toast({ title: "Authentication Required", description: "Please log in to create a service.", variant: "destructive" });
            router.push('/');
        },
    });

    // Initialize state using the default service state
    const [service, setService] = useState<IServiceClientState>(defaultServiceClientState);

    // --- Navigation ---
    const handleNext = () => {
        window.scrollTo(0, 0);
        setCurrentStep(Math.min(currentStep + 1, 8)); // 9 steps total (0-8)
    };

    const handlePrevious = () => {
        window.scrollTo(0, 0);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // --- Submission Logic (with Cloudinary Upload) ---
    const handleSubmit = async () => {
        setIsSubmitting(true);
        let uploadedImageUrls: { url: string; alt: string; caption: string }[] = [];
        // Filter images that have a File object for upload
        const imagesWithFiles = service.images?.filter((img) => img.file instanceof File) || [];
        // Keep track of blob URLs to revoke later
        const blobUrlsToRevoke: string[] = imagesWithFiles
            .map((img) => img.url)
            .filter((url) => url?.startsWith("blob:"));

        try {
            if (!session?.user?.email) {
                toast({ title: "Authentication Error", description: "User session not found.", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }

            // --- 1. Upload Images to Cloudinary (if new files exist) ---
            if (imagesWithFiles.length > 0) {
                const formData = new FormData();
                imagesWithFiles.forEach((imgData) => {
                    if (imgData.file) {
                        formData.append("files", imgData.file, imgData.file.name); // Key 'files'
                    }
                });

                console.log(`Attempting to upload ${imagesWithFiles.length} service image(s)...`);
                const uploadResponse = await fetch(API_CONFIG.getApiRoute({ endpoint: "upload" }), {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    let errorMsg = "Service image upload failed";
                    try {
                        const errorData = await uploadResponse.json();
                        errorMsg = errorData.error || errorMsg;
                        console.error("Upload API Error Response:", errorData);
                    } catch (e) {
                        console.error("Failed to parse upload error response:", uploadResponse.statusText);
                    }
                    throw new Error(errorMsg);
                }

                const uploadResult = await uploadResponse.json();
                console.log("Upload API Success Response:", uploadResult);

                if (!uploadResult.urls || !Array.isArray(uploadResult.urls) || uploadResult.urls.length !== imagesWithFiles.length) {
                    console.error("Mismatched upload results:", uploadResult);
                    throw new Error("Image upload succeeded but response format was unexpected.");
                }

                // Map uploaded URLs back with original alt/caption
                uploadedImageUrls = uploadResult.urls.map((url: string, index: number) => ({
                    url: url, // Cloudinary URL
                    alt: imagesWithFiles[index].alt || `Image of ${service.name || "service"}`,
                    caption: imagesWithFiles[index].caption || imagesWithFiles[index]?.file?.name || `Uploaded Image ${index + 1}`,
                }));
            } else {
                console.log("No new service images with File objects found to upload.");
            }

            // Combine existing Cloudinary URLs (if any) with newly uploaded ones
            const finalImages = [
                ...(service.images?.filter((img) => !img.file && img.url && !img.url.startsWith("blob:")).map(img => ({ url: img.url, alt: img.alt, caption: img.caption })) || []),
                ...uploadedImageUrls,
            ];
            console.log("Final service images prepared for saving:", finalImages);

            // --- 2. Prepare Final Service Data ---
            let users = await getUserByEmail(session.user.email);
            if (!users?.data?._id) {
                throw new Error("Could not find user data.");
            }

            const finalServiceData: IServiceClientState = {
                ...service,
                owner: users.data._id.toString(),
                location: { ...service.location, address: service.location.address || "/" }, // Ensure address exists
                images: finalImages, // Use the combined list with Cloudinary URLs
                // Ensure other potentially optional fields are correctly handled
                features: service.features || [],
                policies: service.policies || { listOfPolicies: [] },
                bookedDates: service.bookedDates || [],
                availabilityRules: service.availabilityRules || { blockedWeekdays: [] },
                description: service.description || "",
                type: service.type || "",
            };

            // --- 3. Map to Backend Schema and Submit ---
            console.log("Mapping final client state to service data...");
            const serviceDataToSave: IService = mapClientStateToServiceData(finalServiceData);
            console.log("Service data ready for API:", serviceDataToSave);
            const creationResult = await createService(serviceDataToSave); // Calls POST /api/v1/services

            // --- 4. Final Toast (Success or Failure) ---
            if (creationResult) {
                toast({
                    title: "Service Created Successfully",
                    description: "Your service has been submitted for approval.",
                });
                router.push('/vendor/venues'); // Navigate back to the listings page
            } else {
                toast({
                    title: "Failed to Create Service",
                    description: "Could not save service data. Please check details and try again.",
                    variant: "destructive",
                });
            }

        } catch (error) {
            console.error('Error submitting service:', error);
            toast({
                title: "Submission Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred during submission.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
            // --- 5. Cleanup Blob URLs AFTER submission attempt ---
            console.log("Revoking blob URLs for service images:", blobUrlsToRevoke);
            blobUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
        }
    };

    // --- Step Rendering ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <BasicInfoStep service={service} setService={setService} />;
            case 1:
                return <LocationStep service={service} setService={setService} />;
            case 2:
                return <CategoriesStep service={service} setService={setService} />;
            case 3:
                return <MediaStep service={service} setService={setService} />; // Use the generic MediaStep
            case 4:
                return <FeaturesStep service={service} setService={setService} />; // Features step
            case 5:
                return <PoliciesStep service={service} setService={setService} />;
            case 6:
                return <AvailabilityStep service={service} setService={setService} />;
            case 7:
                return <PricingStep service={service} setService={setService} />;
            case 8:
                // Pass the current service state (with blob URLs for previews)
                return <ReviewStep service={service} />;
            default:
                return null;
        }
    };

    // --- Validation ---
    const isStepValid = checkServiceValidityOnStep(service, currentStep);

    // --- JSX ---
    return (
        <div className="max-w-3xl mx-auto mt-20 pb-16">
            {/* Optional Stepper */}
            {/* <Stepper steps={serviceSteps} currentStep={currentStep} onStepClick={!isSubmitting ? setCurrentStep : undefined} /> */}

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
                    {currentStep < 8 ? ( // Check if not the last step (Review step is 8)
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid || isSubmitting}
                        >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !isStepValid} // Ensure last step is also validated if needed
                        >
                            {isSubmitting ? (
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
                    )}
                </div>
            </div>
        </div>
    );
};