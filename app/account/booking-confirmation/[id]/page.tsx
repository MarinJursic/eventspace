"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Check,
  Calendar,
  MapPin,
  User,
  Clock,
  DollarSign,
  Share2,
  Download,
  Printer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/useToast";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useSession } from "next-auth/react";

// Mock booking data
const mockBooking = {
  id: "12345",
  status: "confirmed",
  venue: {
    id: "v1",
    name: "Crystal Ballroom",
    address: "123 Event Avenue, New York, NY 10001",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80",
  },
  event: {
    type: "Wedding",
    date: "2023-10-15",
    startTime: "16:00",
    endTime: "22:00",
    guestCount: 120,
  },
  services: [
    { id: "s1", name: "Premium Catering", price: 3500 },
    { id: "s2", name: "Photography Package", price: 1200 },
    { id: "s3", name: "DJ & Sound System", price: 800 },
  ],
  payment: {
    total: 8500,
    paid: 2125,
    due: 6375,
    nextPaymentDate: "2023-09-01",
  },
  contact: {
    name: "Jane Smith",
    phone: "(555) 123-4567",
    email: "jane.smith@example.com",
  },
  bookingDate: "2023-07-01",
  confirmationNumber: "EVT-23071-CR8B2",
};

const BookingConfirmation: React.FC = () => {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [booking, setBooking] = useState(mockBooking);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    if (!session?.user) {
      router.push("/");
      toast({
        title: "Authentication required",
        description: "Please log in to view your booking",
        variant: "destructive",
      });
      return;
    }

    // In a real app, fetch booking details from API using the id param
    setTimeout(() => {
      setBooking(mockBooking);
      setIsLoading(false);
    }, 1000);
  }, [session?.user, router, toast]);

  const handleShare = () => {
    // In a real app, implement share functionality
    toast({
      title: "Share link copied!",
      description: "Booking details link has been copied to clipboard",
    });
  };

  const handleDownload = () => {
    // In a real app, implement download functionality
    toast({
      title: "Downloading confirmation",
      description: "Your booking confirmation is being downloaded",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <AnimatedSection animation="fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600">
                Booking Confirmed
              </h2>
              <p className="text-muted-foreground">
                Confirmation #{booking.confirmationNumber}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={100}>
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date &amp; Time
                    </p>
                    <p className="font-medium">
                      {new Date(booking.event.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm">
                      {booking.event.startTime} - {booking.event.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event Type</p>
                    <p className="font-medium">{booking.event.type}</p>
                    <p className="text-sm">{booking.event.guestCount} Guests</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium">{booking.venue.name}</p>
                    <p className="text-sm">{booking.venue.address}</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${encodeURIComponent(
                            booking.venue.address
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      View on Map
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Booking Made On
                    </p>
                    <p className="font-medium">
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={200}>
        <Card>
          <CardHeader>
            <CardTitle>Services Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booking.services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                  </div>
                  <p>${service.price.toLocaleString()}</p>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between items-center font-bold">
                <p>Venue Rental</p>
                <p>
                  $
                  {(
                    booking.payment.total -
                    booking.services.reduce((acc, s) => acc + s.price, 0)
                  ).toLocaleString()}
                </p>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center text-xl font-bold">
                <p>Total</p>
                <p>${booking.payment.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={300}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p>Total Amount</p>
                <p className="font-medium">
                  ${booking.payment.total.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Deposit Paid</p>
                <p className="font-medium">
                  ${booking.payment.paid.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <p>Balance Due</p>
                <p>${booking.payment.due.toLocaleString()}</p>
              </div>
              <Separator className="my-2" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Next payment of ${booking.payment.due.toLocaleString()} due by{" "}
                  {new Date(booking.payment.nextPaymentDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Pay Balance Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={400}>
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Primary Contact</p>
                <p>{booking.contact.name}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Email</p>
                <p>{booking.contact.email}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Phone</p>
                <p>{booking.contact.phone}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                Contact Venue
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={500}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/account/bookings")}
          >
            View All Bookings
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/venues")}>
              Browse More Venues
            </Button>
            <Button onClick={() => router.push("/services")}>
              Add More Services
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default BookingConfirmation;
