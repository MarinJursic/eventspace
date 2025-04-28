// components/venue/VenueDetailClient.tsx
"use client"; // This component handles state and interactivity

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for the Back button
import { ArrowLeft } from 'lucide-react'; // Import icon for Back button

// Import Context Hooks
import { useCart, CartVenue as CartContextVenueType } from '@/app/context/CartContext'; // Adjust path as needed
import { useToast } from '@/hooks/useToast'; // Adjust path as needed

// Import UI Components
import AnimatedSection from '@/components/ui/AnimatedSection';
import VenueGallery from './VenueGallery'; // Adjust path
import VenueOverview from './VenueOverview'; // Adjust path
import VenueTabs from './VenueTabs';         // Adjust path
import VenueBookingSidebar from './VenueBookingSidebar'; // Adjust path
import DatePicker from './DateTimePickerModal';          // Adjust path
import ExternalVenueModal from './ExternalVenueModal';     // Adjust path
import { Button } from '@/components/ui/button'; // Import Button for fallbacks

// --- Define Serialized Data Types (matching Server Action output) ---
// Ensure these accurately reflect the structure AFTER serializeData() in venueActions.ts
interface SerializedLocation {
    address: string; city?: string; street?: string; houseNumber?: number;
    country?: string; postalCode?: number; latitude?: number; longitude?: number;
}
interface SerializedPrice { basePrice: number; model: 'hour' | 'day' | 'week'; }
interface SerializedRating { average: number; count: number; }
interface SerializedSeating { seated: number; standing: number; }
interface SerializedImage { url: string; alt?: string; caption?: string; }
interface SerializedPolicyItem { name: string; description: string; }
interface SerializedPolicies { bannedServices?: string[]; listOfPolicies?: SerializedPolicyItem[]; }
interface SerializedBookedDate { date: string; bookingRef?: string; } // Date is string
interface SerializedBlockedWeekday { weekday: string; recurrenceRule: 'weekly' | 'biweekly' | 'monthly'; }
interface SerializedAvailabilityRules { blockedWeekdays?: SerializedBlockedWeekday[]; }
// Define PopulatedAmenity based on what your server action populates and serializes from the Enum model
interface PopulatedAmenity { _id: string; id?: string; key: string; label: string; icon?: string; }
interface SerializedReviewData { id: string; _id: string; user: string; rating: number; comment?: string; createdAt: string; updatedAt: string; }

export interface SerializedVenueData {
    id: string; _id: string; name: string; location: SerializedLocation;
    price: SerializedPrice; seating?: SerializedSeating; description?: string;
    images: SerializedImage[]; amenities?: PopulatedAmenity[];
    reviews?: SerializedReviewData[]; // Reviews are now part of the venue data
    policies?: SerializedPolicies; bookedDates?: SerializedBookedDate[];
    availabilityRules?: SerializedAvailabilityRules; category?: string;
    type?: string; status: string; capacity?: number; owner: string;
    rating: SerializedRating; sponsored?: { isActive: boolean; until?: string; planType?: string };
    createdAt?: string; updatedAt?: string;
}


// --- Component Props ---
interface VenueDetailClientProps {
    venue: SerializedVenueData | null; // Accept serialized data or null
}

const VenueDetailClient: React.FC<VenueDetailClientProps> = ({ venue: initialVenue }) => {
    const router = useRouter();
    const { addVenue, addExternalVenue } = useCart();
    const { toast } = useToast();

    // --- State ---
    const [mainImage, setMainImage] = useState<string>(initialVenue?.images?.[0]?.url || "");
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);
    const [selectedVenueDates, setSelectedVenueDates] = useState<string[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("Full day");

    // Effect to update state when venue prop changes
     useEffect(() => {
        setMainImage(initialVenue?.images?.[0]?.url || "");
        setSelectedVenueDates([]);
        // window.scrollTo(0, 0); // Optional: uncomment if needed
     }, [initialVenue]);


    // --- Handlers ---
    const handleDateTimeSelection = useCallback((selectedDates: string[], timeSlot: string) => {
        if (!initialVenue) return;
        const sortedDates = [...selectedDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        setSelectedVenueDates(sortedDates);
        setSelectedTimeSlot(timeSlot);
        toast({ title: "Dates Updated", description: `${sortedDates.length} day(s) selected for ${initialVenue.name}` });
        setIsDatePickerOpen(false);
    }, [initialVenue, toast]);

    const handleBookVenue = useCallback(() => {
        if (!initialVenue) { toast({ title: "Error", description: "Venue data missing.", variant: "destructive" }); return; }
        if (selectedVenueDates.length === 0) { toast({ title: "No Dates Selected", variant: "destructive" }); return; }
        const sortedDates = [...selectedVenueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // --- Map SerializedVenueData to CartContextVenueType ---
        // Ensure this mapping aligns with the definition in CartContext.tsx
        const venueForCart: CartContextVenueType = {
            id: initialVenue.id,
            name: initialVenue.name,
            location: initialVenue.location,
            price: initialVenue.price,
            images: initialVenue.images || [],
            type: initialVenue.type,
            rating: initialVenue.rating
        };

        addVenue(venueForCart, sortedDates, selectedTimeSlot);
        router.push("/services");
    }, [initialVenue, selectedVenueDates, selectedTimeSlot, addVenue, router, toast]);

    const handleExternalVenueConfirm = useCallback((name: string, location: string, dates: string[]) => {
        addExternalVenue(name, location, dates);
        setIsExternalVenueModalOpen(false);
    }, [addExternalVenue]);

     const handleRemoveDate = useCallback((dateToRemove: string) => {
         setSelectedVenueDates((prev) => prev.filter((d) => d !== dateToRemove));
         toast({ title: "Date Removed", description: `${dateToRemove} removed.`});
     }, [toast]);

    // --- Render Logic ---
    if (!initialVenue) {
        // Fallback rendering if the prop is somehow null (should be caught by parent)
        return (
             <div className="min-h-screen flex flex-col">
                 <main className="flex-grow pt-8 pb-16 bg-gradient-to-b from-white via-secondary/10 to-white">
                     <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
                         <p className="text-lg text-muted-foreground mb-4">Venue details could not be loaded.</p>
                         <Button asChild variant="outline"><Link href="/venues"><ArrowLeft className="mr-2 h-4 w-4" />Back to Venues</Link></Button>
                     </div>
                 </main>
             </div>
        );
    }

    // Extract reviews from the venue prop, provide default empty array
    const reviews = initialVenue.reviews || [];

    console.log(initialVenue);  

    // --- Main Return JSX (Includes Layout) ---
    return (
        // --- Main Layout Container (Moved from page.tsx) ---
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-8 pb-16 bg-gradient-to-b from-white via-secondary/10 to-white">
                <div className="container mx-auto px-4 py-8">
                     {/* Back Link */}
                     <AnimatedSection animation="fade-in" className="mb-4">
                         <Link href="/venues" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                             <ArrowLeft className="mr-1.5 h-4 w-4" />
                             Back to venues
                         </Link>
                     </AnimatedSection>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatedSection animation="fade-in">
                                <VenueGallery
                                    images={initialVenue.images || []}
                                    mainImage={mainImage}
                                    onSelectImage={setMainImage}
                                    venueName={initialVenue.name}
                                />
                            </AnimatedSection>
                            <AnimatedSection animation="fade-in">
                                <VenueOverview
                                    name={initialVenue.name}
                                    type={initialVenue.type}
                                    city={initialVenue.location?.city}
                                    address={initialVenue.location?.address}
                                    rating={initialVenue.rating} // Pass rating object
                                    capacity={initialVenue.capacity}
                                    seating={initialVenue.seating}
                                />
                            </AnimatedSection>
                            <AnimatedSection animation="fade-in">
                                <VenueTabs
                                    name={initialVenue.name}
                                    description={initialVenue.description || ""}
                                    location={initialVenue.location}
                                    amenities={initialVenue.amenities || []} // Pass populated amenities
                                    reviews={reviews} // Pass extracted reviews
                                    policies={initialVenue.policies?.listOfPolicies || []}
                                />
                            </AnimatedSection>
                        </div>
                        {/* Right Column */}
                        <div className="lg:col-span-1">
                            <AnimatedSection animation="fade-in" delay={100}>
                                <VenueBookingSidebar
                                    priceInfo={initialVenue.price}
                                    selectedDates={selectedVenueDates}
                                    onRemoveDate={handleRemoveDate}
                                    onBook={handleBookVenue}
                                    onOpenDatePicker={() => setIsDatePickerOpen(true)}
                                    onOpenExternalModal={() => setIsExternalVenueModalOpen(true)}
                                />
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </main>

             {/* Modals */}
            <DatePicker
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onSelect={handleDateTimeSelection}
                bookedDates={initialVenue.bookedDates || []} // Pass serialized booked dates
                availabilityRules={initialVenue.availabilityRules}
                initialSelectedDates={selectedVenueDates}
            />
            <ExternalVenueModal
                isOpen={isExternalVenueModalOpen}
                onClose={() => setIsExternalVenueModalOpen(false)}
                onConfirm={handleExternalVenueConfirm}
            />
        </div>
    );
};

export default VenueDetailClient;