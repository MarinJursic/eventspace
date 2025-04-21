"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import BasicInfoStep from '@/components/service/create/steps/basic-info/BasicInfoStep';
import LocationStep from '@/components/service/create/steps/location/LocationStep';
import PricingStep from '@/components/service/create/steps/PricingStep';
import MediaStep from '@/components/service/create/steps/MediaStep';
import AmenitiesStep from '@/components/service/create/steps/features/FeaturesStep';
import PoliciesStep from '@/components/service/create/steps/PoliciesStep';
import AvailabilityStep from '@/components/service/create/steps/availability/AvailabilityStep';
import ReviewStep from '@/components/service/create/steps/ReviewStep';
import CategoriesStep from '@/components/service/create/steps/categories/CategoriesStep';
import ServicesStep from '@/components/service/create/steps/services/ServicesStep';
import checkServiceValidityOnStep from '@/lib/utils/create-service/checkServiceValidity';
import createService from '@/lib/api/services/createService';
import { IServiceClientState } from '@/types/service.types';
import { defaultServiceClientState } from '@/lib/defaults/service.default';
import { mapClientStateToServiceData } from '@/lib/mappers/service.mapper';
import { IService } from '@/lib/database/schemas/service';
import { useSession } from 'next-auth/react';
import getUserByEmail from '@/lib/api/users/getUserByEmail';
import FeaturesStep from '@/components/service/create/steps/features/FeaturesStep';

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

    const [service, setService] = useState<IServiceClientState>(defaultServiceClientState);

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

            if (!session || !session.user) return;
            let users = await getUserByEmail(session.user.email ?? "");

            let serviceWithAdditionalValues = service;
            serviceWithAdditionalValues.owner = users.data._id;
            serviceWithAdditionalValues.location.address = "/";

            const venueData: IService = mapClientStateToServiceData(serviceWithAdditionalValues);
            const venueCreationResult = await createService(venueData);

            console.log(venueCreationResult)

            if (venueCreationResult) {
                toast({
                    title: "Service created successfully",
                    description: "Your service has been submitted for approval",
                });
            } else {
                toast({
                    title: "Failed to create service",
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
                return <BasicInfoStep service={service} setService={setService} />;
            case 1:
                return <LocationStep service={service} setService={setService} />;
            case 2:
                return <CategoriesStep service={service} setService={setService} />;
            case 3:
                return <MediaStep service={service} setService={setService} />;
            case 4:
                //Features
                return <FeaturesStep service={service} setService={setService} />;
            case 5:
                return <PoliciesStep service={service} setService={setService} />;
            case 6:
                return <AvailabilityStep service={service} setService={setService} />;
            case 7:
                return <PricingStep service={service} setService={setService} />;
            case 8:
                return <ReviewStep service={service} />;
            default:
                return null;
        }
    };

    const isStepValid = checkServiceValidityOnStep(service, currentStep);

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
                        currentStep < 8
                            ? <Button onClick={handleNext} disabled={!isStepValid}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            : <Button onClick={handleSubmit} disabled={isSubmitting || !isStepValid}>
                                {
                                    isSubmitting
                                        ? "Submitting..."
                                        : <><Save className="mr-2 h-4 w-4"></Save>Submit Service</>
                                }
                            </Button>
                    }
                </div>
            </div>
        </div>
    );
};