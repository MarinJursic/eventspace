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
import { venues } from "@/lib/mockVenues"; 

const VenueDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addVenue } = useCart();

  const [venue, setVenue] = useState(() => venues.find((v) => v.id === id) || null);
  const [mainImage, setMainImage] = useState<string>(venue?.images[0].url || "");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);
  const [selectedVenueDates, setSelectedVenueDates] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDateTimeSelection = (selectedDates: string[], timeSlot: string) => {
    if (!venue) return;
    setSelectedVenueDates(selectedDates);
    setSelectedTimeSlot(timeSlot);
    toast({
      title: "Dates selected",
      description: `${selectedDates.length} day(s) selected for ${venue.name}`,
    });
  };

  const handleBookVenue = () => {
    if (!venue || selectedVenueDates.length === 0) {
      toast({
        title: "No dates selected",
        description: "Please select dates for your booking",
        variant: "destructive",
      });
      return;
    }

    addVenue(venue, selectedVenueDates, selectedTimeSlot);

    toast({
      title: "Venue booked",
      description: `${venue.name} has been added to your booking for ${selectedVenueDates.length} day(s)`,
    });

    router.push("/cart");
  };

  if (!venue) return <p className="text-center text-gray-500">Venue not found</p>;

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
        availableDates={venue.bookedDates.map((date) => date.date.toISOString().split("T")[0])}
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
