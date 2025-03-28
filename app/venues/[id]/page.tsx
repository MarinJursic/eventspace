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

const venueData = {
  id: 1,
  name: "Crystal Ballroom",
  longDescription:
    "Our Crystal Ballroom is the epitome of elegance and sophistication. With its grand entrance, spectacular crystal chandeliers, and exquisite marble floors, it provides a magical setting for any special occasion. The 5,000 square foot space can accommodate up to 300 guests for a seated dinner or 500 for a standing reception. The ballroom also features a state-of-the-art sound system, customizable lighting, and a dedicated preparation area for vendors and event staff. Our in-house event coordinator will work with you to ensure every detail is perfect for your special day.",
  images: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2148&q=80",
    "https://images.unsplash.com/photo-1549895058-36748fa6c6a7?q=80&w=2816&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D    ",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
    "https://images.unsplash.com/photo-1579254216547-a90bea451479?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  address: "123 Fifth Avenue, New York, NY 10001",
  price: "$2,500",
  capacity: "300 seated, 500 standing",
  rating: 4.8,
  reviewCount: 124,
  amenities: [
    { name: "Parking", icon: () => null },
    { name: "Wi-Fi", icon: () => null },
    { name: "Sound System", icon: () => null },
    { name: "Security", icon: () => null },
    { name: "Catering Kitchen", icon: () => null },
    { name: "Air Conditioning", icon: () => null },
  ],
  availableDates: [
    { date: "2023-11-15", slots: ["Morning", "Evening"] },
    { date: "2023-11-16", slots: ["Morning", "Afternoon", "Evening"] },
    { date: "2023-11-17", slots: ["Afternoon"] },
    { date: "2023-11-18", slots: ["Morning", "Evening"] },
    { date: "2023-11-19", slots: ["Morning", "Afternoon", "Evening"] },
    { date: "2023-11-20", slots: ["Morning", "Evening"] },
    { date: "2023-11-21", slots: ["Afternoon", "Evening"] },
    { date: "2023-11-22", slots: ["Morning", "Afternoon"] },
  ],
  reviews: [
    {
      id: 1,
      user: "Emma Thompson",
      date: "2023-10-05",
      rating: 5,
      comment:
        "This venue exceeded all our expectations! The staff was incredibly helpful and the space was breathtaking. All our guests were impressed.",
    },
    {
      id: 2,
      user: "Michael Johnson",
      date: "2023-09-22",
      rating: 4,
      comment:
        "Beautiful venue with excellent amenities. The only issue was limited parking for our guests, but everything else was perfect.",
    },
    {
      id: 3,
      user: "Sophia Rodriguez",
      date: "2023-08-15",
      rating: 5,
      comment:
        "We had our dream wedding at this venue. The crystal chandeliers and city views created a magical atmosphere. Highly recommend!",
    },
  ],
  policies: {
    cancellation:
      "Full refund if cancelled 30+ days before event date. 50% refund if cancelled 14-29 days before. No refund for cancellations less than 14 days before the event.",
    security:
      "A security deposit of $1,000 is required and will be refunded within 7 business days after the event, subject to inspection.",
    noise:
      "Music and loud noise must end by 11:00 PM on weeknights and 1:00 AM on weekends to comply with local regulations.",
    cleaning:
      "Basic cleaning is included. Excessive cleanup may incur additional charges.",
  },
};

const VenueDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addVenue, addExternalVenue } = useCart();

  const [mainImage, setMainImage] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] =
    useState(false);
  const [selectedVenueDates, setSelectedVenueDates] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // For demonstration we use static venue data.
  const venue = venueData;

  useEffect(() => {
    if (venue.images && venue.images.length > 0) {
      setMainImage(venue.images[0]);
    }
    window.scrollTo(0, 0);
  }, [venue.images]);

  const handleDateTimeSelection = (
    selectedDates: string[],
    timeSlot: string
  ) => {
    setSelectedVenueDates(selectedDates);
    setSelectedTimeSlot(timeSlot);
    toast({
      title: "Dates selected",
      description: `${selectedDates.length} day(s) selected for ${venue.name}`,
    });
  };

  const handleBookVenue = () => {
    if (selectedVenueDates.length === 0) {
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

  const handleExternalVenueAdd = (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => {
    setIsExternalVenueModalOpen(false);
    addExternalVenue(venueName, location, selectedDates);
    toast({
      title: "External venue added",
      description: `${venueName} has been added to your booking for ${selectedDates.length} day(s)`,
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <AnimatedSection animation="fade-in">
            <Link
              href="/venues"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
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
                  address={venue.address}
                  rating={venue.rating}
                  reviewCount={venue.reviewCount}
                  capacity={venue.capacity}
                />
              </AnimatedSection>

              <AnimatedSection animation="fade-in">
                <VenueTabs
                  longDescription={venue.longDescription}
                  address={venue.address}
                  amenities={venue.amenities}
                  reviews={venue.reviews}
                  policies={venue.policies}
                />
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1">
              <AnimatedSection animation="fade-in" delay={200}>
                <VenueBookingSidebar
                  price={venue.price}
                  selectedDates={selectedVenueDates}
                  onRemoveDate={(index) =>
                    setSelectedVenueDates((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
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
        availableDates={venue.availableDates}
        initialSelectedDates={selectedVenueDates}
      />

      <ExternalVenueModal
        isOpen={isExternalVenueModalOpen}
        onClose={() => setIsExternalVenueModalOpen(false)}
        onConfirm={handleExternalVenueAdd}
      />
    </div>
  );
};

export default VenueDetailPage;
