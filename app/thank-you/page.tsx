"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Calendar,
  Home,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useSession } from "next-auth/react";

const ThankYou: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const orderNumber = searchParams.get("order") || "EVN-123456";

  // If someone navigates directly to this page without an order, redirect to home after 5 seconds
  useEffect(() => {
    if (!searchParams.get("order")) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <div className="mt-10 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16">
        <AnimatedSection animation="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-4xl font-display font-bold mb-4">
              Thank You for Your Booking!
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              Your booking has been confirmed and we've sent a confirmation
              email to your registered email address.
            </p>

            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-display font-semibold mb-4">
                Order Details
              </h2>

              <div className="flex justify-center mb-4">
                <div className="bg-primary/5 rounded-full px-4 py-2 font-medium text-primary">
                  Order #{orderNumber}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="flex items-center font-semibold text-lg mb-2">
                    <Calendar className="mr-2 h-5 w-5" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                        1
                      </span>
                      Check your email for booking confirmation details
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                        2
                      </span>
                      {session?.user ? (
                        <span>
                          Review your upcoming booking in your account dashboard
                        </span>
                      ) : (
                        <span>Create an account to manage your bookings</span>
                      )}
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                        3
                      </span>
                      The venue owner will contact you within 24 hours
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center font-semibold text-lg mb-2">
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Need Help?
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    If you have any questions about your booking, please don't
                    hesitate to contact our support team.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/help")}
                  >
                    Visit Help Center
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => router.push("/")}>
                Return to Home
              </Button>
              {session?.user ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/account/bookings")}
                >
                  View Your Bookings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/venues")}
                >
                  Explore More Venues
                  <Home className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default ThankYou;
