"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ArrowLeft,
  // CalendarClock, // No direct field in schema, use type/category instead?
  // BookOpen, // Not used
  Package, // Keeping for potential future use if mapping features
  Award,   // Keeping for potential future use if mapping features
  Check,   // Default icon for features
  Calendar,
  Building,
  MapPin,
  AlertCircle, // For warnings/errors
  Info, // For info notes
  // Removed icons not directly mapped from schema
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/app/context/CartContext"; // Adjust path if needed
import ExternalVenueModal from "@/components/venue/ExternalVenueModal";
// Import the original mockServices structure and finder
import { mockServices, findServiceById, MockService } from "@/lib/mockServices";
// Import the new mockReviews structure and finder
import { findServiceReviewsByServiceIds, MockReview } from "@/lib/mockReviews"; // Adjust path if needed

// Helper function using MockService['price'] fields
const formatPriceDisplay = (priceInfo: MockService['price'] | undefined): string => {
  if (!priceInfo) return "$ --"; // Handle undefined price info
  const price = priceInfo.basePrice;
  const model = priceInfo.model;
  const base = `$${price.toLocaleString()}`;
  switch(model) {
      case 'hour': return `${base} / hour*`;
      case 'day': return `${base} / event day`;
      case 'week': return `${base} / week`;
      default: return base;
  }
};

const ServiceDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addService, addExternalVenue, hasVenue, selectedDates } = useCart();

  const [service, setService] = useState<MockService | null | undefined>(undefined); // undefined: loading, null: not found
  const [detailedReviews, setDetailedReviews] = useState<MockReview[]>([]); // State for fetched reviews
  const [mainImage, setMainImage] = useState<string>("");
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);
  // Customizations removed as they are not in the schema
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set()); // Use Set for efficiency

  // --- Fetch Service Data ---
  useEffect(() => {
    const serviceId = params?.id;
    if (serviceId) {
      const idString = Array.isArray(serviceId) ? serviceId[0] : serviceId;
      const foundService = findServiceById(idString);
      setService(foundService || null); // Set service state

      // Reset dependent state when service changes
      setDetailedReviews([]);
      setSelectedDays(new Set());

      if (foundService?.images?.[0]?.url) {
        setMainImage(foundService.images[0].url);
      } else {
        setMainImage("https://via.placeholder.com/800x450?text=No+Image");
      }

      // --- Fetch Detailed Reviews ---
      if (foundService?.reviews && foundService.reviews.length > 0) {
          const reviews = findServiceReviewsByServiceIds(foundService.reviews);
          setDetailedReviews(reviews);
      }

    } else {
       setService(null); // No ID in URL
       setDetailedReviews([]);
    }
     window.scrollTo(0, 0);
  }, [params?.id]); // Rerun when ID changes

  // --- Reset selected days when venue dates change ---
  useEffect(() => {
    setSelectedDays(new Set());
  }, [selectedDates]);

  // --- Derived State ---
  const isMultiDay = selectedDates.length > 1;

  // Calculate total price dynamically - Simplified
  const calculatedTotalPrice = useMemo(() => {
    if (!service) return 0;
    let total = service.price.basePrice;

    // Adjust price based on selected days ONLY if model is 'day'
     if (service.price.model === 'day' && isMultiDay) {
         total *= selectedDays.size; // Multiply base price by number of selected days
     }
     // Other models ('hour', 'week') base price isn't directly affected by selected days count here
     // Actual cost for 'hour' would require duration input, not just day selection.

    return total;
  }, [service, selectedDays, isMultiDay]);

   // --- Multi-Day Selection Logic ---
   // Since `availableDays` is not in the schema, we make a simplifying assumption:
   // If it's a multi-day event, *all* selected venue dates are potentially selectable for the service.
   // No complex availability rules are applied here.
   const availableDaysForSelection = useMemo(() => {
       return selectedDates; // All selected venue dates are considered available
   }, [selectedDates]);

   // Validity check is simpler now: just ensure at least one day is selected if multi-day
   const isDaySelectionValid = useMemo(() => {
       if (!isMultiDay) return true; // Always valid if not multi-day
       return selectedDays.size > 0; // Must select at least one day if multi-day
   }, [selectedDays, isMultiDay]);


  // --- Handlers ---
  const handleAddToBooking = useCallback(() => {
    if (!service) return;

    if (!hasVenue) {
      toast({ title: "Venue Required", description: "Please select or add a venue before adding services.", variant: "destructive" });
      return;
    }

    // Updated validation: simpler check based on isDaySelectionValid
    if (isMultiDay && !isDaySelectionValid) {
      toast({ title: "Days Required", description: "Please select the day(s) this service is needed for your multi-day event.", variant: "destructive" });
      return;
    }

    // No customizations to add
    const serviceToAdd = {
      id: service.id,
      name: service.name,
      price: service.price.basePrice,
      priceModel: service.price.model,
      image: service.images[0]?.url || "",
      selectedDays: isMultiDay ? Array.from(selectedDays) : [],
      totalCalculatedPrice: calculatedTotalPrice,
      // customizations field removed
    };

    addService(serviceToAdd); // Ensure context function expects this simpler structure
    toast({ title: "Service Added", description: `${service.name} added to your booking details.` });
    router.push("/cart");
  }, [service, hasVenue, isMultiDay, selectedDays, calculatedTotalPrice, addService, router, toast, isDaySelectionValid]);

  const handleExternalVenueAdd = useCallback((venueName: string, location: string, dates: string[]) => {
    setIsExternalVenueModalOpen(false);
    addExternalVenue(venueName, location, dates);
    toast({ title: "External Venue Added", description: `${venueName} added. You can now add services.` });
  }, [addExternalVenue, toast]);

  // Customization handler removed

  const toggleDay = useCallback((day: string) => {
    // No availability check needed based on our simplified assumption
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  }, []); // Removed availability dependencies

   const toggleAllDays = useCallback(() => {
       // Toggle based on all *selected venue dates*
       const allVenueDaysSelected = selectedDates.length > 0 && selectedDates.every(day => selectedDays.has(day));

       if (allVenueDaysSelected) {
           setSelectedDays(new Set()); // Deselect all
       } else {
           setSelectedDays(new Set(selectedDates)); // Select all venue dates
       }
   }, [selectedDates, selectedDays]);


  // --- Render Logic ---
  if (service === undefined) {
    return ( <div className="flex items-center justify-center min-h-[60vh]"> <p>Loading service details...</p> </div> );
  }

  if (service === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
         <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Service Not Found</h2>
        <p className="text-muted-foreground mb-6">The service ID might be incorrect or the service removed.</p>
        <Button asChild variant="outline">
            <Link href="/services"><ArrowLeft className="mr-2 h-4 w-4" />Back to Services</Link>
        </Button>
      </div>
    );
  }

  // Determine which tabs have content based *only* on the schema
  const hasFeatures = service.features && service.features.length > 0;
  const hasReviews = detailedReviews.length > 0; // Check fetched reviews state
  const hasPolicies = service.policies?.listOfPolicies && service.policies.listOfPolicies.length > 0;
  // No customization tab
  const tabCount = 1 + (hasFeatures ? 1 : 0) + (hasReviews ? 1 : 0) + (hasPolicies ? 1 : 0);


  // --- Main Return JSX ---
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-8 pb-16 bg-gradient-to-b from-white via-secondary/10 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <AnimatedSection animation="fade-in" className="mb-4">
            <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to services
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            {/* Left Column: Images & Tabs */}
            <div className="lg:col-span-2">
              <AnimatedSection animation="fade-in" className="space-y-6">
                {/* Image Gallery - Uses service.images */}
                 <div className="space-y-3">
                   <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md bg-muted">
                     <img
                       src={mainImage}
                       alt={service.images.find(img => img.url === mainImage)?.alt || `Main view of ${service.name}`}
                       className="w-full h-full object-cover transition-opacity duration-300"
                       key={mainImage}
                     />
                   </div>
                   {service.images.length > 1 && (
                       <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                         {service.images.map((image, index) => (
                           <div
                             key={image.url + index}
                             className={`aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-all duration-200 ${ mainImage === image.url ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100 hover:border-muted-foreground/50"}`}
                             onClick={() => setMainImage(image.url)}
                             role="button"
                             aria-label={image.caption || `View image ${index + 1}`} // Use caption
                           >
                             <img src={image.url} alt={image.alt || `${service.name} - view ${index + 1}`} className="w-full h-full object-cover" />
                           </div>
                         ))}
                       </div>
                   )}
                 </div>

                {/* Basic Info - Uses service fields */}
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                    {service.name}
                  </h1>
                   {service.type && ( <Badge variant="outline" className="mt-2">{service.type}</Badge> )}
                   {/* Optional: Display categories */}
                   {/* {service.category && service.category.length > 0 && (
                       <div className="mt-2 space-x-1">
                           {service.category.map(catId => <Badge key={catId} variant="secondary">{catId.replace('cat_', '').replace('_id', '')}</Badge>)}
                       </div>
                   )} */}
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
                     {service.rating.count > 0 ? (
                         <div className="flex items-center text-amber-600">
                           <Star className="w-4 h-4 fill-amber-400 text-amber-500 mr-1" />
                           <span className="font-medium">{service.rating.average.toFixed(1)}</span>
                           <span className="ml-1 text-muted-foreground">({service.rating.count} reviews)</span>
                         </div>
                     ) : (
                         <div className="flex items-center text-muted-foreground"> <Star className="w-4 h-4 text-muted-foreground mr-1" /> <span>No reviews yet</span> </div>
                     )}
                     {service.location?.city && (
                        <div className="flex items-center text-muted-foreground"> <MapPin className="w-4 h-4 mr-1" /> <span>{service.location.city}</span> </div>
                     )}
                  </div>
                </div>

                {/* Tabs Section - Adjusted for available content */}
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className={`grid w-full grid-cols-${tabCount > 4 ? 4 : tabCount} mb-6 bg-muted/50 rounded-lg p-1 h-auto`}>
                    <TabsTrigger value="about">About</TabsTrigger>
                    {hasFeatures && <TabsTrigger value="features">Features</TabsTrigger>}
                    {/* Customization Tab Removed */}
                    {hasReviews && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
                    {hasPolicies && <TabsTrigger value="policies">Policies</TabsTrigger>}
                  </TabsList>

                  {/* About Tab - Uses service.description */}
                  <TabsContent value="about">
                     <h3 className="font-semibold text-lg mb-2">Description</h3>
                     <p className="text-muted-foreground whitespace-pre-wrap">
                       {service.description || "No description available."}
                     </p>
                  </TabsContent>

                   {/* Features Tab - Uses service.features (string array) */}
                   {hasFeatures && (
                       <TabsContent value="features">
                           <h3 className="font-semibold text-lg mb-3">What's Included</h3>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                               {/* Iterate over features string array */}
                               {service.features.map((featureName, index) => (
                                   <div key={index} className="flex items-start p-3 bg-secondary/30 rounded-lg border">
                                       <Check className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" /> {/* Default icon */}
                                       <span className="text-sm">{featureName}</span>
                                   </div>
                               ))}
                           </div>
                       </TabsContent>
                   )}

                   {/* Customize Tab Removed */}

                   {/* Reviews Tab - Uses detailedReviews state */}
                   {hasReviews && (
                       <TabsContent value="reviews">
                           <div className="flex items-center mb-4 gap-4">
                               {/* Rating summary from service.rating */}
                               <div className="bg-amber-100/60 border border-amber-300/50 text-amber-900 px-3 py-2 rounded-lg flex items-center">
                                   <Star className="w-5 h-5 text-amber-500 fill-amber-500 mr-2" />
                                   <span className="font-semibold text-xl">{service.rating.average.toFixed(1)}</span>
                               </div>
                               <div>
                                   <p className="font-medium">Based on {service.rating.count} reviews</p>
                               </div>
                           </div>

                           <div className="space-y-4">
                               {/* Iterate over detailedReviews */}
                               {detailedReviews.slice(0, 3).map((review) => ( // Show first 3
                                   <div key={review.id} className="border border-border rounded-lg p-4 bg-background">
                                       <div className="flex justify-between items-start mb-2">
                                           <div>
                                               <p className="font-medium text-sm">{review.user}</p>
                                               {/* Display date string directly */}
                                               <p className="text-xs text-muted-foreground">{review.createdAt.toDateString()}</p>
                                           </div>
                                           <div className="flex items-center bg-amber-100/60 px-1.5 py-0.5 rounded-full border border-amber-300/50">
                                               <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                                               <span className="text-xs font-medium text-amber-900">{review.rating.toFixed(1)}</span>
                                           </div>
                                       </div>
                                       <p className="text-sm text-muted-foreground">{review.comment}</p>
                                   </div>
                               ))}
                           </div>

                           {service.rating.count > detailedReviews.slice(0, 3).length && (
                              <Button variant="outline" className="w-full mt-6" disabled>
                                  View All {service.rating.count} Reviews (Display Limited)
                              </Button>
                           )}
                       </TabsContent>
                   )}

                   {/* Policies Tab - Uses service.policies.listOfPolicies */}
                   {hasPolicies && (
                      <TabsContent value="policies">
                           <h3 className="font-semibold text-lg mb-3">Service Policies</h3>
                           <div className="space-y-4">
                           {/* Iterate over policies.listOfPolicies */}
                           {service.policies?.listOfPolicies.map((policy, index) => (
                               <div key={index}>
                                   <h4 className="font-medium mb-1 text-sm">{policy.name}</h4>
                                   <p className="text-sm text-muted-foreground">{policy.description}</p>
                                   {index < (service.policies?.listOfPolicies.length ?? 0) - 1 && <Separator className="my-4" />}
                               </div>
                           ))}
                           </div>
                      </TabsContent>
                   )}

                </Tabs>
              </AnimatedSection>
            </div>

            {/* Right Column: Booking Box */}
            <div className="lg:col-span-1">
              <AnimatedSection animation="fade-in" delay={100}>
                <div className="sticky top-24 space-y-5">
                  {/* Main Booking Card */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <h3 className="font-display text-xl font-semibold mb-4"> Add to Your Event </h3>

                     {/* Base Price Display - Uses formatPriceDisplay */}
                     <div className="mb-4 pb-4 border-b">
                       <span className="text-sm text-muted-foreground block mb-1">Base price</span>
                       <p className="font-display text-3xl font-bold tracking-tight">
                         {formatPriceDisplay(service.price)}
                       </p>
                       {/* Clarify price model */}
                       {service.price.model === 'day' && <p className="text-xs text-muted-foreground mt-1">Per day the service is required</p>}
                       {service.price.model === 'hour' && <p className="text-xs text-muted-foreground mt-1">*Base hourly rate. Actual cost depends on usage/details.</p>}
                       {service.price.model === 'week' && <p className="text-xs text-muted-foreground mt-1">Weekly rate</p>}
                     </div>

                    {/* Dynamic Selection Summary */}
                     <div className="text-sm text-muted-foreground mb-5 min-h-[40px]">
                       {hasVenue ? (
                         isMultiDay ? (
                           selectedDays.size > 0
                             ? `Service selected for ${selectedDays.size} day${selectedDays.size !== 1 ? 's' : ''}.`
                             : `Select the required day(s) for this service below.`
                         ) : ( `Service for your event on ${selectedDates[0]}.` )
                       ) : ( "Select or add a venue to proceed." )}
                     </div>

                    {/* Customization Summary Removed */}

                     {/* Total Price Display - Uses calculatedTotalPrice */}
                      <div className="mb-6 pt-4 border-t">
                         <div className="flex justify-between items-baseline">
                           <span className="font-semibold">Estimated Total:</span>
                           <span className="font-bold text-2xl">${calculatedTotalPrice.toLocaleString()}</span>
                         </div>
                         {/* Clarification based on model and selection */}
                         {service.price.model === 'day' && isMultiDay && selectedDays.size > 0 && (
                              <p className="text-xs text-muted-foreground mt-1 text-right"> Based on ${service.price.basePrice.toLocaleString()}/day × {selectedDays.size} day(s) selected </p>
                         )}
                         {service.price.model === 'hour' && ( <p className="text-xs text-muted-foreground mt-1 text-right"> Base price shown. Final total depends on duration/details. </p> )}
                         {!(service.price.model === 'day' && isMultiDay && selectedDays.size > 0) && !(service.price.model === 'hour') && ( <p className="text-xs text-muted-foreground mt-1 text-right"> Based on standard rate/package </p> )}
                      </div>

                    {/* Day Selection (Simplified - Assumes all days available) */}
                     {isMultiDay && hasVenue && (
                       <div className="mb-6 space-y-4 pt-4 border-t">
                         <h4 className="font-medium text-sm">Select required day(s):</h4>
                          {/* Info box about simplified availability can be added here if desired */}
                          {/* <div className="flex items-start p-3 text-xs text-blue-800 rounded-lg bg-blue-50 border border-blue-200"> <Info className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-blue-600"/> <span>Select the specific days this service is needed for your event.</span> </div> */}

                         {/* All Available Days Toggle */}
                         {selectedDates.length > 1 && ( // Only show if more than 1 venue day
                           <div
                               className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${ selectedDates.every(day => selectedDays.has(day)) ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50" }`}
                               onClick={toggleAllDays}
                               role="checkbox"
                               aria-checked={selectedDates.every(day => selectedDays.has(day))}
                           >
                               <div className="flex items-center">
                                   <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${ selectedDates.every(day => selectedDays.has(day)) ? "border-primary bg-primary" : "border-muted-foreground" }`}>
                                       {selectedDates.every(day => selectedDays.has(day)) && <Check className="w-3 h-3 text-primary-foreground" />}
                                   </div>
                                   <span className="text-sm font-medium">All {selectedDates.length} Days</span>
                               </div>
                           </div>
                         )}

                         {/* Individual Day Toggles */}
                         <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                           {selectedDates.map((day, index) => {
                               const isSelected = selectedDays.has(day);
                               // No 'isAvailable' check needed here due to simplification
                               return (
                                   <div
                                       key={index}
                                       className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all ${ isSelected ? "border-primary/50 bg-primary/5" : "border-transparent hover:bg-muted/70" }`}
                                       onClick={() => toggleDay(day)} // Always clickable
                                       role="checkbox"
                                       aria-checked={isSelected}
                                   >
                                       <div className="flex items-center">
                                           <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center shrink-0 ${ isSelected ? "border-primary bg-primary" : "border-muted-foreground" }`}>
                                               {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                                           </div>
                                           <div className="flex items-center">
                                               <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                               <span className="text-sm">{day}</span> {/* Always looks available */}
                                           </div>
                                       </div>
                                       {/* No "Not Available" badge needed */}
                                   </div>
                               );
                           })}
                           </div>
                           {/* No validity warning needed for simplified logic */}
                       </div>
                     )}

                    {/* Action Buttons - Simplified disable logic */}
                    {hasVenue ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleAddToBooking}
                        // Disable only if multi-day AND no days selected
                        disabled={isMultiDay && selectedDays.size === 0}
                      >
                        {isMultiDay && selectedDays.size === 0 ? "Select Day(s) First" : "Add to Booking"}
                      </Button>
                    ) : (
                      <div className="space-y-3 border-t pt-5">
                         <p className="text-sm font-medium text-center mb-2">Choose your venue first:</p>
                        <Button className="w-full" size="lg" variant="default" onClick={() => router.push("/venues")}> <Building className="mr-2 h-5 w-5" /> Find a Venue </Button>
                        <p className="text-center text-xs text-muted-foreground">or</p>
                        <Button variant="outline" className="w-full" size="lg" onClick={() => setIsExternalVenueModalOpen(true)}> <MapPin className="mr-2 h-5 w-5" /> Add External Venue </Button>
                      </div>
                    )}
                     <p className="text-xs text-center text-muted-foreground mt-3"> Finalize details in your booking overview. </p>
                  </div> {/* End Booking Card */}

                   {/* Help Box */}
                   <div className="bg-secondary/30 border border-secondary/50 p-4 rounded-lg text-center">
                        <Info className="w-5 h-5 mx-auto mb-2 text-primary" />
                       <h4 className="font-medium text-sm mb-1">Need assistance?</h4>
                       <p className="text-xs text-muted-foreground mb-3"> Our event specialists can help with questions. </p>
                       <Button variant="outline" size="sm" className="w-full">Contact Support</Button> {/* TODO: Link or action */}
                   </div>

                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>

      {/* External Venue Modal */}
      <ExternalVenueModal
        isOpen={isExternalVenueModalOpen}
        onClose={() => setIsExternalVenueModalOpen(false)}
        onConfirm={handleExternalVenueAdd}
      />
    </div>
  );
};

export default ServiceDetail;