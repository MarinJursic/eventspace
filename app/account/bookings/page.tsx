"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronRight, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";

// Mock booking data
const mockBookings = [
  {
    id: "12345",
    venueName: "Crystal Ballroom",
    venueImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80",
    eventDate: "2023-10-15",
    eventType: "Wedding",
    guestCount: 120,
    status: "upcoming",
    totalAmount: 8500,
    confirmationNumber: "EVT-23071-CR8B2",
  },
  {
    id: "12346",
    venueName: "Urban Loft Studio",
    venueImage:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
    eventDate: "2023-11-05",
    eventType: "Corporate Event",
    guestCount: 50,
    status: "upcoming",
    totalAmount: 4200,
    confirmationNumber: "EVT-23072-BN9P1",
  },
  {
    id: "12347",
    venueName: "Seaside Pavilion",
    venueImage:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1450&q=80",
    eventDate: "2023-06-20",
    eventType: "Birthday Party",
    guestCount: 35,
    status: "completed",
    totalAmount: 2800,
    confirmationNumber: "EVT-23063-XM7L3",
  },
  {
    id: "12348",
    venueName: "Historic Mansion",
    venueImage:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    eventDate: "2023-05-10",
    eventType: "Charity Gala",
    guestCount: 200,
    status: "completed",
    totalAmount: 12000,
    confirmationNumber: "EVT-23052-FD5K8",
  },
  {
    id: "12349",
    venueName: "Mountain View Lodge",
    venueImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    eventDate: "2023-08-02",
    eventType: "Wedding",
    guestCount: 85,
    status: "cancelled",
    totalAmount: 7200,
    confirmationNumber: "EVT-23065-HJ3M2",
    cancellationReason: "Changed plans due to unforeseen circumstances",
  },
];

const Bookings: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");

  // Protection against unauthenticated access
  if (!session?.user) {
    router.push("/");
    toast({
      title: "Authentication required",
      description: "Please log in to view your bookings",
      variant: "destructive",
    });
    return null;
  }

  // Filter bookings based on search and status filter
  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.confirmationNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || booking.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewBooking = (bookingId: string) => {
    router.push(`/account/booking-confirmation/${bookingId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <AnimatedSection animation="fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-full md:w-[300px]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={100}>
        <Tabs
          defaultValue="all"
          onValueChange={(value) =>
            setSelectedFilter(
              value as "all" | "upcoming" | "completed" | "cancelled"
            )
          }
          className="mb-6"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onView={() => handleViewBooking(booking.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              {filteredBookings.filter((b) => b.status === "upcoming").length >
              0 ? (
                filteredBookings
                  .filter((b) => b.status === "upcoming")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onView={() => handleViewBooking(booking.id)}
                    />
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No upcoming bookings found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-4">
              {filteredBookings.filter((b) => b.status === "completed").length >
              0 ? (
                filteredBookings
                  .filter((b) => b.status === "completed")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onView={() => handleViewBooking(booking.id)}
                    />
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No completed bookings found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="space-y-4">
              {filteredBookings.filter((b) => b.status === "cancelled").length >
              0 ? (
                filteredBookings
                  .filter((b) => b.status === "cancelled")
                  .map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onView={() => handleViewBooking(booking.id)}
                    />
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No cancelled bookings found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={200}>
        <div className="flex justify-between items-center mt-8">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBookings.length} of {mockBookings.length} bookings
          </p>
          <Button variant="outline" onClick={() => router.push("/venues")}>
            Book New Venue
          </Button>
        </div>
      </AnimatedSection>
    </>
  );
};

interface BookingCardProps {
  booking: {
    id: string;
    venueName: string;
    venueImage: string;
    eventDate: string;
    eventType: string;
    guestCount: number;
    status: string;
    totalAmount: number;
    confirmationNumber: string;
    cancellationReason?: string;
  };
  onView: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onView }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 h-48 md:h-auto">
            <img
              src={booking.venueImage}
              alt={booking.venueName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {booking.venueName}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(booking.eventDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Event Type</p>
                <p className="font-medium">{booking.eventType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="font-medium">{booking.guestCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">
                  ${booking.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  Confirmation # {booking.confirmationNumber}
                </p>
                {booking.status === "cancelled" &&
                  booking.cancellationReason && (
                    <p className="text-xs text-destructive mt-1">
                      Cancellation reason: {booking.cancellationReason}
                    </p>
                  )}
              </div>
              <Button
                variant="ghost"
                className="flex items-center"
                onClick={onView}
              >
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Bookings;
