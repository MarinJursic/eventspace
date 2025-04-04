"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ArrowLeft,
  CalendarClock,
  BookOpen,
  Package,
  Award,
  Check,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/app/context/CartContext";
import ExternalVenueModal from "@/components/venue/ExternalVenueModal";

const serviceData = {
  id: 1,
  name: "Deluxe Wedding Photography",
  description:
    "Capture your special day with our deluxe wedding photography package. Includes full-day coverage, a professional photographer, and a beautifully crafted photo album.",
  longDescription:
    "Our deluxe wedding photography package is designed to capture every precious moment of your special day. From the early morning preparations to the last dance, our professional photographer will be there to document all the joy, love, and laughter. We use state-of-the-art equipment and techniques to ensure that your photos are of the highest quality. In addition to full-day coverage, this package includes a beautifully crafted photo album that you will treasure for years to come.",
  image:
    "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  images: [
    "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "https://images.unsplash.com/photo-1643733149476-448e1dd6ed66?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  category: "Photography",
  price: "$2,000",
  rating: 4.9,
  reviewCount: 95,
  customizationOptions: [
    { id: 1, name: "Additional photographer", price: "$500", default: false },
    { id: 2, name: "Extra hour coverage", price: "$250", default: false },
    { id: 3, name: "Rush delivery (7 days)", price: "$300", default: false },
    {
      id: 4,
      name: "Premium photo album upgrade",
      price: "$200",
      default: false,
    },
  ],
  availableDays: ["all", "first", "last"],
  features: [
    { name: "Full-Day Coverage", icon: CalendarClock },
    { name: "Professional Photographer", icon: BookOpen },
    { name: "Edited Digital Images", icon: Package },
    { name: "Custom Photo Album", icon: Award },
  ],
  reviews: [
    {
      id: 1,
      user: "Samantha Lee",
      date: "2023-10-10",
      rating: 5,
      comment:
        "The photographer was amazing! They captured every special moment and the photos are stunning.",
    },
    {
      id: 2,
      user: "David Miller",
      date: "2023-09-28",
      rating: 4,
      comment:
        "We were very happy with the service. The photos turned out great, but there was a slight delay in receiving the final album.",
    },
    {
      id: 3,
      user: "Emily White",
      date: "2023-08-20",
      rating: 5,
      comment:
        "Our photographer was professional, friendly, and incredibly talented. We highly recommend this service!",
    },
  ],
  policies: {
    cancellation:
      "Full refund if cancelled 60+ days before event date. 50% refund if cancelled 30-59 days before. No refund for cancellations less than 30 days before the event.",
    rescheduling:
      "Rescheduling is allowed up to 30 days before the event date, subject to availability.",
    travel:
      "Travel fees may apply for events outside of the New York City area.",
    imageUsage:
      "The photographer retains the copyright to all images. Clients receive a license for personal use.",
  },
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [mainImage, setMainImage] = useState("");
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] =
    useState(false);
  const { toast } = useToast();
  const { addService, addExternalVenue, hasVenue, selectedDates } = useCart();

  const [selectedCustomizations, setSelectedCustomizations] = useState<
    number[]
  >([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // For simplicity, using serviceData regardless of id
  const service = serviceData;

  useEffect(() => {
    if (service.images && service.images.length > 0) {
      setMainImage(service.images[0]);
    }
    window.scrollTo(0, 0);
  }, [service.images]);

  // When venue dates change, reset selected days for service
  useEffect(() => {
    setSelectedDays([]);
  }, [selectedDates]);

  const extractPrice = (priceString: string) => {
    const match = priceString.match(/\$?([\d,]+)/);
    if (match && match[1]) {
      return parseInt(match[1].replace(/,/g, ""));
    }
    return 0;
  };

  const handleAddToBooking = () => {
    if (!hasVenue) {
      toast({
        title: "No venue selected",
        description: "Please select a venue first before adding services",
        variant: "destructive",
      });
      return;
    }
    if (selectedDays.length === 0) {
      toast({
        title: "No days selected",
        description: "Please select at least one day for this service",
        variant: "destructive",
      });
      return;
    }

    const customizationsTotal = selectedCustomizations.reduce((total, id) => {
      const option = service.customizationOptions.find((opt) => opt.id === id);
      if (option) {
        return total + extractPrice(option.price);
      }
      return total;
    }, 0);

    const enhancedService = {
      ...service,
      selectedCustomizations: service.customizationOptions.filter((opt) =>
        selectedCustomizations.includes(opt.id)
      ),
      selectedDays,
      totalPrice: `$${extractPrice(service.price) + customizationsTotal}`,
    };

    addService(enhancedService);
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
    // Remain on service page so user can add the service
  };

  const toggleCustomization = (id: number) => {
    setSelectedCustomizations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleAllDays = () => {
    if (selectedDays.length === selectedDates.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays([...selectedDates]);
    }
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading service details...</p>
      </div>
    );
  }

  const isMultiDay = selectedDates.length > 1;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <AnimatedSection animation="fade-in">
            <Link
              href="/services"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to services
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatedSection animation="fade-in">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="aspect-[16/9] overflow-hidden rounded-xl">
                      <img
                        src={mainImage || service.images[0]}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {service.images.map((image, index) => (
                        <div
                          key={index}
                          className={`aspect-square overflow-hidden rounded-lg cursor-pointer border-2 ${
                            mainImage === image
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() => setMainImage(image)}
                        >
                          <img
                            src={image}
                            alt={`${service.name} - view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold">
                      {service.name}
                    </h1>
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <CalendarClock className="h-4 w-4 mr-1" />
                      <span>{service.category}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center bg-primary/5 text-primary px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">
                          {service.rating.toFixed(1)}
                        </span>
                        <span className="mx-1 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {service.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="about" className="w-full">
                    <TabsList className="grid grid-cols-5 mb-6">
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="customize">Customize</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="policies">Policies</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="space-y-6">
                      <div>
                        <h3 className="font-display text-lg font-semibold mb-2">
                          Description
                        </h3>
                        <p className="text-muted-foreground">
                          {service.longDescription}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {service.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center p-4 bg-secondary/20 rounded-lg"
                          >
                            <feature.icon className="h-5 w-5 mr-3 text-primary" />
                            <span>{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="customize" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-display text-lg font-semibold mb-2">
                          Customization Options
                        </h3>

                        <div className="space-y-3 mb-6">
                          {service.customizationOptions.map((option) => (
                            <div
                              key={option.id}
                              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${
                                selectedCustomizations.includes(option.id)
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                              onClick={() => toggleCustomization(option.id)}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                    selectedCustomizations.includes(option.id)
                                      ? "border-primary"
                                      : "border-muted-foreground"
                                  }`}
                                >
                                  {selectedCustomizations.includes(
                                    option.id
                                  ) && (
                                    <Check className="w-3 h-3 text-primary" />
                                  )}
                                </div>
                                <span>{option.name}</span>
                              </div>
                              <span className="font-medium">
                                {option.price}
                              </span>
                            </div>
                          ))}
                        </div>

                        {selectedDates.length > 1 && (
                          <>
                            <h3 className="font-display text-lg font-semibold mb-2">
                              Select Days for This Service
                            </h3>

                            <div
                              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer mb-3 ${
                                selectedDays.length === selectedDates.length
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                              onClick={toggleAllDays}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                    selectedDays.length === selectedDates.length
                                      ? "border-primary"
                                      : "border-muted-foreground"
                                  }`}
                                >
                                  {selectedDays.length ===
                                    selectedDates.length && (
                                    <Check className="w-3 h-3 text-primary" />
                                  )}
                                </div>
                                <span>All {selectedDates.length} days</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {selectedDates.map((day, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${
                                    selectedDays.includes(day)
                                      ? "border-primary bg-primary/5"
                                      : "border-border"
                                  }`}
                                  onClick={() => toggleDay(day)}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                        selectedDays.includes(day)
                                          ? "border-primary"
                                          : "border-muted-foreground"
                                      }`}
                                    >
                                      {selectedDays.includes(day) && (
                                        <Check className="w-3 h-3 text-primary" />
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                      <span>{day}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary/5 text-primary px-3 py-2 rounded-lg flex items-center mr-4">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
                          <span className="font-semibold text-xl">
                            {service.rating.toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {service.reviewCount} reviews
                          </p>
                          <p className="text-sm text-muted-foreground">
                            From verified customers
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {service.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border border-border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{review.user}</p>
                                <p className="text-sm text-muted-foreground">
                                  {review.date}
                                </p>
                              </div>
                              <div className="flex items-center bg-primary/5 px-2 py-1 rounded-full">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="text-xs font-medium">
                                  {review.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full">
                        View All Reviews
                      </Button>
                    </TabsContent>

                    <TabsContent value="policies" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">
                            Cancellation Policy
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {service.policies.cancellation}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-1">Rescheduling</h4>
                          <p className="text-sm text-muted-foreground">
                            {service.policies.rescheduling}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-1">Travel Fees</h4>
                          <p className="text-sm text-muted-foreground">
                            {service.policies.travel}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-1">Image Usage</h4>
                          <p className="text-sm text-muted-foreground">
                            {service.policies.imageUsage}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1">
              <AnimatedSection animation="fade-in" delay={200}>
                <div className="sticky top-24 space-y-6">
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <div className="mb-4">
                      <h3 className="font-display text-xl font-semibold">
                        Service Details
                      </h3>
                    </div>

                    <div className="mb-4">
                      <p className="font-display text-2xl font-bold">
                        {service.price}
                      </p>
                      <p className="text-sm text-muted-foreground">per day</p>
                    </div>

                    <div className="text-sm text-muted-foreground mb-6">
                      {hasVenue
                        ? isMultiDay
                          ? `This service is available for your ${selectedDays.length} selected days`
                          : `This service is available for your event on ${selectedDates[0]}`
                        : "Please select a venue to book this service"}
                    </div>

                    {selectedCustomizations.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="font-medium">Selected options:</p>
                        <ul className="text-sm space-y-1">
                          {selectedCustomizations.map((id) => {
                            const option = service.customizationOptions.find(
                              (opt) => opt.id === id
                            );
                            return (
                              option && (
                                <li key={id} className="flex justify-between">
                                  <span>{option.name}</span>
                                  <span>{option.price}</span>
                                </li>
                              )
                            );
                          })}
                        </ul>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>
                            $
                            {extractPrice(service.price) +
                              selectedCustomizations.reduce((total, id) => {
                                const option =
                                  service.customizationOptions.find(
                                    (opt) => opt.id === id
                                  );
                                return (
                                  total +
                                  (option ? extractPrice(option.price) : 0)
                                );
                              }, 0)}
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedDates.length > 1 && hasVenue && (
                      <div className="mb-6 space-y-4">
                        <h4 className="font-medium text-sm">
                          Select days for this service:
                        </h4>

                        <div
                          className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${
                            selectedDays.length === selectedDates.length
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          onClick={toggleAllDays}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                selectedDays.length === selectedDates.length
                                  ? "border-primary"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {selectedDays.length === selectedDates.length && (
                                <Check className="w-3 h-3 text-primary" />
                              )}
                            </div>
                            <span>All {selectedDates.length} days</span>
                          </div>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {selectedDates.map((day, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${
                                selectedDays.includes(day)
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                              onClick={() => toggleDay(day)}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                    selectedDays.includes(day)
                                      ? "border-primary"
                                      : "border-muted-foreground"
                                  }`}
                                >
                                  {selectedDays.includes(day) && (
                                    <Check className="w-3 h-3 text-primary" />
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                  <span>{day}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasVenue ? (
                      <Button
                        className="w-full mt-2"
                        size="lg"
                        onClick={handleAddToBooking}
                        disabled={isMultiDay && selectedDays.length === 0}
                      >
                        Add to Booking
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => router.push("/venues")}
                        >
                          <Building className="mr-2 h-5 w-5" /> Find a Venue
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                          or
                        </p>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsExternalVenueModalOpen(true)}
                        >
                          <MapPin className="mr-2 h-5 w-5" /> Add Your External
                          Venue
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-center text-muted-foreground mt-3">
                      You won't be charged yet
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Need help with your booking?
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our team is available to assist you with any questions or
                      special requests.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>

      <ExternalVenueModal
        isOpen={isExternalVenueModalOpen}
        onClose={() => setIsExternalVenueModalOpen(false)}
        onConfirm={handleExternalVenueAdd}
      />
    </div>
  );
};

export default ServiceDetail;
