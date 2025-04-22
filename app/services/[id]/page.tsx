"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
} from "lucide-react"; // Keep only needed icons here
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/app/context/CartContext";
import ExternalVenueModal from "@/components/venue/ExternalVenueModal";
import { mockServices, findServiceById, MockService } from "@/lib/mockServices";
import { findServiceReviewsByServiceIds, MockReview } from "@/lib/mockReviews";

// Import the new components
import ServiceImageGallery from "@/components/service/details/ServiceImageGallery"; // Adjust path
import ServiceHeaderInfo from "@/components/service/details/ServiceHeaderInfo"; // Adjust path
import ServiceTabs from "@/components/service/details/ServiceTabs"; // Adjust path
import ServiceBookingSidebar from "@/components/service/details/ServiceBookingSidebar"; // Adjust path

const ServiceDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addService, addExternalVenue, hasVenue, selectedDates } = useCart();

  // --- State ---
  const [service, setService] = useState<MockService | null | undefined>(undefined);
  const [detailedReviews, setDetailedReviews] = useState<MockReview[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());

  // --- Data Fetching ---
  useEffect(() => {
    const serviceId = params?.id;
    let foundService: MockService | null | undefined = undefined; // Define locally

    if (serviceId) {
      const idString = Array.isArray(serviceId) ? serviceId[0] : serviceId;
      foundService = findServiceById(idString) ?? null; // Assign here
      setService(foundService);

      setDetailedReviews([]);
      setSelectedDays(new Set());
      setMainImage(foundService?.images?.[0]?.url || "https://via.placeholder.com/800x450?text=No+Image");

      if (foundService?.reviews && foundService.reviews.length > 0) {
        // Ensure findServiceReviewsByServiceIds exists and is imported correctly
        const reviews = findServiceReviewsByServiceIds(foundService.reviews);
        setDetailedReviews(reviews);
      }
    } else {
      setService(null);
      setDetailedReviews([]);
    }
    window.scrollTo(0, 0);
  }, [params?.id]);

  // --- Reset selected days ---
  useEffect(() => {
    setSelectedDays(new Set());
  }, [selectedDates]);

  // --- Derived State ---
  const isMultiDay = selectedDates.length > 1;

  const calculatedTotalPrice = useMemo(() => {
    if (!service) return 0;
    let total = service.price.basePrice;
    if (service.price.model === 'day' && isMultiDay) {
      total *= selectedDays.size;
    }
    return total;
  }, [service, selectedDays, isMultiDay]);

  const availableDaysForSelection = useMemo(() => selectedDates, [selectedDates]);

  const isDaySelectionValid = useMemo(() => {
    if (!isMultiDay) return true;
    return selectedDays.size > 0;
  }, [selectedDays, isMultiDay]);

  // --- Handlers ---
  const handleAddToBooking = useCallback(() => {
    if (!service || !hasVenue || (isMultiDay && !isDaySelectionValid)) {
      // Add specific toasts if needed
      if (!hasVenue) toast({ title: "Venue Required", description: "Please select or add a venue first.", variant: "destructive" });
      else if (isMultiDay && !isDaySelectionValid) toast({ title: "Days Required", description: "Please select the day(s) this service is needed.", variant: "destructive" });
      return;
    }
    const serviceToAdd = {
      id: service.id,
      name: service.name,
      price: service.price.basePrice,
      priceModel: service.price.model,
      image: service.images[0]?.url || "",
      selectedDays: isMultiDay ? Array.from(selectedDays) : [],
      totalCalculatedPrice: calculatedTotalPrice,
    };
    addService(serviceToAdd);
    toast({ title: "Service Added", description: `${service.name} added.` });
    router.push("/cart");
  }, [service, hasVenue, isMultiDay, selectedDays, calculatedTotalPrice, addService, router, toast, isDaySelectionValid]);

  const handleExternalVenueAdd = useCallback((venueName: string, location: string, dates: string[]) => {
    setIsExternalVenueModalOpen(false);
    addExternalVenue(venueName, location, dates);
    // Toast is handled in context
  }, [addExternalVenue, setIsExternalVenueModalOpen]);

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
  if (service === undefined) {
    return (<div className="flex items-center justify-center min-h-[60vh]"> <p>Loading service details...</p> </div>);
  }
  if (service === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Service Not Found</h2>
        <p className="text-muted-foreground mb-6">The service ID might be incorrect or the service removed.</p>
        <Button asChild variant="outline"><Link href="/services"><ArrowLeft className="mr-2 h-4 w-4" />Back to Services</Link></Button>
      </div>
    );
  }

  // --- Main Return JSX ---
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-8 pb-16 bg-gradient-to-b from-white via-secondary/10 to-white">
        {/* Use container for consistent padding */}
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <AnimatedSection animation="fade-in" className="mb-4">
            <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to services
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            {/* --- Left Column --- */}
            <div className="lg:col-span-2 space-y-6"> {/* Added space-y */}
              <AnimatedSection animation="fade-in">
                <ServiceImageGallery
                  images={service.images}
                  mainImage={mainImage}
                  onSelectImage={setMainImage}
                  venueName={service.name} // Pass service name
                />
              </AnimatedSection>

              <AnimatedSection animation="fade-in">
                <ServiceHeaderInfo
                  name={service.name}
                  type={service.type}
                  rating={service.rating}
                  location={service.location}
                />
              </AnimatedSection>

              <AnimatedSection animation="fade-in">
                <ServiceTabs service={service} reviews={detailedReviews} />
              </AnimatedSection>
            </div>

            {/* --- Right Column --- */}
            <div className="lg:col-span-1">
              <AnimatedSection animation="fade-in" delay={100}>
                <ServiceBookingSidebar
                  servicePrice={service.price}
                  calculatedTotalPrice={calculatedTotalPrice}
                  isMultiDay={isMultiDay}
                  hasVenue={hasVenue}
                  selectedVenueDates={selectedDates}
                  selectedServiceDays={selectedDays}
                  availableDaysForSelection={availableDaysForSelection}
                  isDaySelectionValid={isDaySelectionValid}
                  onAddToBooking={handleAddToBooking}
                  onToggleDay={toggleDay}
                  onToggleAllDays={toggleAllDays}
                  onFindVenue={() => router.push('/venues')} // Navigate on find
                  onAddExternalVenue={() => setIsExternalVenueModalOpen(true)} // Open modal
                />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>

      {/* Modals remain at the top level */}
      <ExternalVenueModal
        isOpen={isExternalVenueModalOpen}
        onClose={() => setIsExternalVenueModalOpen(false)}
        onConfirm={handleExternalVenueAdd}
      />
    </div>
  );
};

export default ServiceDetail;
