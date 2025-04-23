"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import BasicInfoStep from '@/components/venue/create/steps/basic-info/BasicInfoStep';
import LocationStep from '@/components/venue/create/steps/location/LocationStep';
import PricingStep from '@/components/venue/create/steps/PricingStep';
import MediaStep from '@/components/venue/create/steps/MediaStep';
import AmenitiesStep from '@/components/venue/create/steps/amenities/AmenitiesStep';
import PoliciesStep from '@/components/venue/create/steps/policies/PoliciesStep';
import AvailabilityStep from '@/components/venue/create/steps/availability/AvailabilityStep';
import ReviewStep from '@/components/venue/create/steps/ReviewStep';
import CategoriesStep from '@/components/venue/create/steps/categories/CategoriesStep';
import ServicesStep from '@/components/venue/create/steps/services/ServicesStep';
import checkVenueValidityOnStep from '@/lib/utils/create-venue/checkVenueValidity';
import createVenue from '@/lib/api/venues/createVenue';
import { IVenueClientState } from '@/types/venue.types';
import { defaultVenueClientState } from '@/lib/defaults/venue.default';
import { mapClientStateToVenueData } from '@/lib/mappers/venue.mapper';
import { IVenue } from '@/lib/database/schemas/venue';
import { useSession } from 'next-auth/react';
import getUserByEmail from '@/lib/api/users/getUserByEmail';

const CreateVenue: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            toast({ title: "Authentication Required", description: "Please log in to create a venue.", variant: "destructive" });
            router.push('/');
        },
    });

    const [venue, setVenue] = useState<IVenueClientState>(defaultVenueClientState);

    const handleNext = () => {
        window.scrollTo(0, 0);
        setCurrentStep(Math.min(currentStep + 1, 9));
    };

    const handlePrevious = () => {
        window.scrollTo(0, 0);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            if(!session || !session.user) return;
            let users = await getUserByEmail(session.user.email ?? "");

            let venueWithAdditionalValues = venue;
            venueWithAdditionalValues.owner = users.data._id;
            venueWithAdditionalValues.location.address = "/";

            const venueData: IVenue = mapClientStateToVenueData(venueWithAdditionalValues);
            const venueCreationResult = await createVenue(venueData);

            if(venueCreationResult){
                toast({
                    title: "Venue created successfully",
                    description: "Your venue has been submitted for approval",
                });
            }else{
                toast({
                    title: "Failed to create venue",
                    description: "Please try again later",
                    variant: "destructive",
                });
            }

            // router.push('/vendor/venues');
        } catch (error) {
            console.error('Error submitting venue:', error);
            toast({
                title: "Failed to create venue",
                description: "Please try again later",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                return <ReviewStep venue={venue} />;
            default:
                return null;
        }
    };
    
    const isStepValid = checkVenueValidityOnStep(venue, currentStep);

    return (
        <div className="max-w-3xl mx-auto mt-20 scale-100">
            <div className="mt-8 bg-white rounded-xl border shadow-sm p-6">
                {renderStepContent()}
            </div>

            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                <div className="flex gap-2">
                    {
                        currentStep < 9
                        ? <Button onClick={handleNext} disabled={!isStepValid}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        : <Button onClick={handleSubmit} disabled={isSubmitting || !isStepValid}>
                                {
                                    isSubmitting 
                                    ? "Submitting..."
                                    : <><Save className="mr-2 h-4 w-4"></Save> Submit Venue</>
                                }
                          </Button>
                    }
                </div>
            </div>
        </div>
    );
};

export default CreateVenue;