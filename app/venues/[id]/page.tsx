"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import VenueGallery from "@/components/venue/VenueGallery";
import VenueOverview from "@/components/venue/VenueOverview";
import VenueTabs from "@/components/venue/VenueTabs";
import VenueBookingSidebar from "@/components/venue/VenueBookingSidebar";
import DatePicker from "@/components/venue/DateTimePickerModal";
import ExternalVenueModal from "@/components/venue/ExternalVenueModal";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/app/context/CartContext";
import { venues, Venue } from "@/lib/mockVenues"; 
import { Button } from "@/components/ui/button";

const VenueDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addVenue } = useCart();

  // Find venue - Use useState with initial function for performance
  const [venue, setVenue] = useState<Venue | null>(() => {
      // Find the venue based on the ID from params
      const venueId = typeof id === 'string' ? id : undefined;
      return venueId ? venues.find((v) => v.id === venueId) ?? null : null;
  });

  const [mainImage, setMainImage] = useState<string>("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false); // Keep this if needed
  const [selectedVenueDates, setSelectedVenueDates] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("Full day"); // Default to Full day

  useEffect(() => {
      // Update venue if ID changes (e.g., navigating between venue pages)
      const venueId = typeof id === 'string' ? id : undefined;
      const foundVenue = venueId ? venues.find((v) => v.id === venueId) ?? null : null;
      setVenue(foundVenue);

      // Reset selections if venue changes
      setSelectedVenueDates([]);
      setMainImage(foundVenue?.images?.[0]?.url || "");

      window.scrollTo(0, 0);
  }, [id]); // Depend on id

  // Effect to set initial main image when venue loads
  useEffect(() => {
      if (venue && venue.images.length > 0 && !mainImage) {
          setMainImage(venue.images[0].url);
      }
  }, [venue, mainImage]);


  const handleDateTimeSelection = (selectedDates: string[], timeSlot: string) => {
    if (!venue) return;
    // Sort dates before setting state
    const sortedDates = selectedDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    setSelectedVenueDates(sortedDates);
    setSelectedTimeSlot(timeSlot); // Keep this, even if it's always "Full day" for now
    toast({
      title: "Dates Updated",
      description: `${sortedDates.length} day(s) selected for ${venue.name}`,
    });
  };

  const handleBookVenue = () => {
    if (!venue || selectedVenueDates.length === 0) {
      toast({
        title: "No dates selected",
        description: "Please select dates using the 'Check Availability' button.",
        variant: "destructive",
      });
      return;
    }

    // Sort dates just in case before adding to cart
    const sortedDates = selectedVenueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    addVenue(venue, sortedDates, selectedTimeSlot); // addVenue should handle the Venue object

    // No need for a separate toast here, addVenue in CartContext handles it
    // toast({ ... });

    router.push("/services"); // Navigate to services page after adding venue
  };

    // --- External Venue Modal Confirmation ---
    // We need the confirmation handler for the ExternalVenueModal
    const handleExternalVenueConfirm = (name: string, location: string, dates: string[]) => {
        // You might want to use the addExternalVenue function from useCart here
        console.log("External Venue Confirmed:", { name, location, dates });
        toast({ title: "External Venue Added (Placeholder)", description: `${name} details noted.` });
        setIsExternalVenueModalOpen(false);
        // Potentially call addExternalVenue from context here
        // addExternalVenue(name, location, dates); // Uncomment if context handles this
        // router.push('/services'); // Navigate after adding external venue
    };


  if (!venue) return (
       <div className="flex items-center justify-center min-h-[60vh]">
           <p className="text-center text-gray-500">Venue not found or ID is invalid.</p>
           {/* Optional: Add a back button */}
           <Button asChild variant="outline" className="mt-4">
             <Link href="/venues"><ArrowLeft className="mr-2 h-4 w-4" />Back to Venues</Link>
           </Button>
       </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <AnimatedSection animation="fade-in">
            <Link href="/venues" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to venues
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AnimatedSection animation="fade-in">
                <VenueGallery
                  images={venue.images}
                  mainImage={mainImage}
                  onSelectImage={setMainImage}
                  venueName={venue.name}
                />
              </AnimatedSection>

              <AnimatedSection animation="fade-in">
                <VenueOverview
                  name={venue.name}
                  address={venue.location.address}
                  rating={venue.rating.average}
                  reviewCount={venue.reviews.length}
                  capacity={venue.capacity ? venue.capacity.toString() : ""}
                />
              </AnimatedSection>

              <AnimatedSection animation="fade-in">
                <VenueTabs
                  longDescription={venue.description || ""}
                  address={venue.location.address}
                  amenities={venue.amenities}
                  reviews={venue.reviews}
                  policies={venue.policies?.listOfPolicies || []}
                />
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1">
              <AnimatedSection animation="fade-in" delay={200}>
                <VenueBookingSidebar
                  price={"$" + venue.price.basePrice.toString()}
                  selectedDates={selectedVenueDates}
                  onRemoveDate={(index) =>
                    setSelectedVenueDates((prev) => prev.filter((_, i) => i !== index))
                  }
                  onBook={handleBookVenue}
                  onOpenDatePicker={() => setIsDatePickerOpen(true)}
                  onOpenExternalModal={() => setIsExternalVenueModalOpen(true)}
                />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>

      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDateTimeSelection}
        // Pass bookedDates and availabilityRules from the specific venue
        bookedDates={venue.bookedDates || []}
        availabilityRules={venue.availabilityRules} // Pass the whole rules object
        initialSelectedDates={selectedVenueDates}
      />

      <ExternalVenueModal
        isOpen={isExternalVenueModalOpen}
        onClose={() => setIsExternalVenueModalOpen(false)}
        onConfirm={() => {}}
      />
    </div>
  );
};

export default VenueDetailPage;
