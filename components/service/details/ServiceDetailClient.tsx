// components/service/ServiceDetailClient.tsx
"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Only ArrowLeft needed for back link if moved here

// Import Context and Hooks
import { useCart, CartService as CartServiceType } from '@/app/context/CartContext'; // Adjust path
import { useToast } from '@/hooks/useToast'; // Adjust path

// Import UI Components
import AnimatedSection from '@/components/ui/AnimatedSection'; // Adjust path
import ServiceImageGallery from '@/components/service/details/ServiceImageGallery'; // Adjust path
import ServiceHeaderInfo from '@/components/service/details/ServiceHeaderInfo'; // Adjust path
import ServiceTabs from '@/components/service/details/ServiceTabs'; // Adjust path
import ServiceBookingSidebar from '@/components/service/details/ServiceBookingSidebar'; // Adjust path
import ExternalVenueModal from '@/components/venue/ExternalVenueModal'; // Adjust path
import { Button } from '@/components/ui/button'; // For fallback display

// --- Define Serialized Data Types (matching Server Action output) ---
// Ensure these match the structure after JSON.parse(JSON.stringify(data))
interface SerializedLocation {
    address: string; city?: string; street?: string; houseNumber?: number;
    country?: string; postalCode?: number; latitude?: number; longitude?: number;
}
interface SerializedPrice { basePrice: number; model: 'hour' | 'day' | 'week'; }
interface SerializedRating { average: number; count: number; }
interface SerializedImage { url: string; alt?: string; caption?: string; }
interface SerializedPolicyItem { name: string; description: string; }
interface SerializedPolicies { listOfPolicies?: SerializedPolicyItem[]; }
interface SerializedBookedDate { date: string; bookingRef?: string; }
interface SerializedBlockedWeekday { weekday: string; recurrenceRule: 'weekly' | 'biweekly' | 'monthly'; }
interface SerializedAvailabilityRules { blockedWeekdays?: SerializedBlockedWeekday[]; }
interface SerializedReviewData { id: string; user: string; rating: number; comment?: string; createdAt: string; updatedAt: string; }

export interface SerializedService { // Export if needed elsewhere
    id: string; _id: string; name: string; location: SerializedLocation;
    price: SerializedPrice; description?: string; features?: string[];
    images: SerializedImage[]; policies?: SerializedPolicies;
    bookedDates?: SerializedBookedDate[]; availabilityRules?: SerializedAvailabilityRules;
    category?: string[]; type?: string; status: string; owner: string;
    rating: SerializedRating; sponsored?: { isActive: boolean; until?: string; planType?: string };
    reviews?: SerializedReviewData[]; // Reviews included here
    createdAt?: string; updatedAt?: string;
}

// --- Component Props ---
interface ServiceDetailClientProps {
    service: SerializedService | null;
}

const ServiceDetailClient: React.FC<ServiceDetailClientProps> = ({ service: initialService }) => {
    const router = useRouter();
    const { addService, addExternalVenue, hasVenue, selectedDates } = useCart();
    const { toast } = useToast();

    // --- State ---
    const [mainImage, setMainImage] = useState<string>(initialService?.images?.[0]?.url || "");
    const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());

    // Extract reviews from the service prop once using useMemo
    const reviews = useMemo(() => initialService?.reviews || [], [initialService]);

    // Effect to update state when service prop changes
     useEffect(() => {
        setMainImage(initialService?.images?.[0]?.url || "");
        setSelectedDays(new Set());
        // window.scrollTo(0, 0); // Optional
     }, [initialService]);

     // Effect to clear selected days based on cart context
     useEffect(() => { setSelectedDays(new Set()); }, [selectedDates]);

    // --- Derived State ---
    const isMultiDay = selectedDates.length > 1;

    const calculatedTotalPrice = useMemo(() => {
        if (!initialService) return 0;
        let total = initialService.price.basePrice;
        if (initialService.price.model === 'day' && isMultiDay) {
            total *= selectedDays.size;
        }
        return total;
    }, [initialService, selectedDays, isMultiDay]);

    const availableDaysForSelection = useMemo(() => selectedDates, [selectedDates]);
    const isDaySelectionValid = useMemo(() => {
        if (!isMultiDay) return true;
        return selectedDays.size > 0;
    }, [selectedDays, isMultiDay]);

    // --- Handlers ---
    const handleAddToBooking = useCallback(() => {
        if (!initialService) { toast({ title: "Error", description: "Service data missing.", variant: "destructive" }); return; }
        if (!hasVenue) { toast({ title: "Venue Required", description: "Please select or add a venue first.", variant: "destructive" }); return; }
        if (isMultiDay && !isDaySelectionValid) { toast({ title: "Days Required", description: "Please select the day(s) this service is needed.", variant: "destructive" }); return; }

        // Map to CartServiceType
        const serviceToAdd: CartServiceType = {
            id: initialService.id,
            name: initialService.name,
            image: initialService.images?.[0]?.url || "",
            price: initialService.price.basePrice,
            priceModel: initialService.price.model,
            selectedDays: isMultiDay ? Array.from(selectedDays) : [],
            totalCalculatedPrice: calculatedTotalPrice,
        };

        addService(serviceToAdd);
        // Toast handled by context
        router.push("/cart");
    }, [initialService, hasVenue, isMultiDay, selectedDays, calculatedTotalPrice, addService, router, toast, isDaySelectionValid]);

    const handleExternalVenueAdd = useCallback((venueName: string, location: string, dates: string[]) => {
        addExternalVenue(venueName, location, dates);
        setIsExternalVenueModalOpen(false);
    }, [addExternalVenue]);

    const toggleDay = useCallback((day: string) => {
        setSelectedDays((prev) => {
            const next = new Set(prev);
            if (next.has(day)) { next.delete(day); } else { next.add(day); }
            return next;
        });
    }, []);

    const toggleAllDays = useCallback(() => {
        const allVenueDaysSelected = selectedDates.length > 0 && selectedDates.every(day => selectedDays.has(day));
        if (allVenueDaysSelected) { setSelectedDays(new Set()); } else { setSelectedDays(new Set(selectedDates)); }
    }, [selectedDates, selectedDays]);

    // --- Render Logic ---
     if (!initialService) {
         // Fallback if prop is null (should be caught by parent, but good practice)
         return (
             <div className="flex items-center justify-center min-h-[60vh]">
                 <p className="text-muted-foreground">Service details could not be loaded.</p>
                 {/* Optional: Add a back button */}
                 <Button asChild variant="outline" className="mt-4 ml-4">
                   <Link href="/services"><ArrowLeft className="mr-2 h-4 w-4" />Back to Services</Link>
                 </Button>
             </div>
         );
     }

     return (
        // --- Main Layout Container ---
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-8 pb-16 bg-gradient-to-b from-white via-secondary/10 to-white">
                <div className="container mx-auto px-4 py-8">
                     {/* Back Link */}
                     <AnimatedSection animation="fade-in" className="mb-4">
                         <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                             <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to services
                         </Link>
                     </AnimatedSection>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatedSection animation="fade-in">
                                <ServiceImageGallery
                                    images={initialService.images || []}
                                    mainImage={mainImage}
                                    onSelectImage={setMainImage}
                                    serviceName={initialService.name} // Pass service name
                                />
                            </AnimatedSection>
                            <AnimatedSection animation="fade-in">
                                <ServiceHeaderInfo
                                    name={initialService.name}
                                    type={initialService.type}
                                    rating={initialService.rating}
                                    location={initialService.location}
                                />
                            </AnimatedSection>
                            <AnimatedSection animation="fade-in">
                                {/* Pass the service object and extracted reviews */}
                                <ServiceTabs
                                    service={initialService}
                                    reviews={reviews}
                                />
                            </AnimatedSection>
                        </div>
                        {/* Right Column */}
                        <div className="lg:col-span-1">
                            <AnimatedSection animation="fade-in" delay={100}>
                                <ServiceBookingSidebar
                                    servicePrice={initialService.price} // Pass price object
                                    calculatedTotalPrice={calculatedTotalPrice}
                                    isMultiDay={isMultiDay}
                                    hasVenue={hasVenue}
                                    selectedVenueDates={selectedDates} // Dates from cart context
                                    selectedServiceDays={selectedDays} // Local state for this service
                                    availableDaysForSelection={availableDaysForSelection}
                                    isDaySelectionValid={isDaySelectionValid}
                                    onAddToBooking={handleAddToBooking}
                                    onToggleDay={toggleDay}
                                    onToggleAllDays={toggleAllDays}
                                    onFindVenue={() => router.push('/venues')}
                                    onAddExternalVenue={() => setIsExternalVenueModalOpen(true)}
                                />
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </main>

             {/* Modals */}
            <ExternalVenueModal
                isOpen={isExternalVenueModalOpen}
                onClose={() => setIsExternalVenueModalOpen(false)}
                onConfirm={handleExternalVenueAdd}
            />
        </div>
    );
};

export default ServiceDetailClient;