"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Heart, Star, Wallet2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useSession } from "next-auth/react";

// Mock data for dashboard
const upcomingBookings = [
  {
    id: "1",
    venue: "Garden Paradise",
    date: "2023-08-15",
    time: "14:00",
    type: "Wedding",
  },
  {
    id: "2",
    venue: "Urban Studio",
    date: "2023-09-22",
    time: "18:30",
    type: "Corporate Event",
  },
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  if (!session?.user) {
    router.push("/");
    toast({
      title: "Authentication required",
      description: "Please log in to access your dashboard",
      variant: "destructive",
    });
    return null;
  }

  return (
    <div className="space-y-8">
      <AnimatedSection animation="fade-in">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Next: Aug 15, 2023
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                5 venues, 2 services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reviews Given
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Average rating: 4.7
              </p>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 md:grid-cols-2">
        <AnimatedSection animation="fade-in" delay={100}>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h4 className="font-medium">{booking.venue}</h4>
                        <div className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at {booking.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.type}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/account/bookings")}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  No upcoming bookings
                </p>
              )}
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push("/venues")}
                >
                  Browse Venues
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={200}>
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{session?.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{session?.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="capitalize">{session?.user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span>July 2023</span>
                </div>
                <div className="pt-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => router.push("/account/settings")}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      <AnimatedSection animation="fade-in" delay={300}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => router.push("/venues")}
                >
                  <Calendar className="h-6 w-6" />
                  <span>Book Venue</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => router.push("/services")}
                >
                  <Wallet2 className="h-6 w-6" />
                  <span>Book Service</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => router.push("/account/favorites")}
                >
                  <Heart className="h-6 w-6" />
                  <span>Favorites</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => router.push("/account/settings")}
                >
                  <Star className="h-6 w-6" />
                  <span>Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Dashboard;
