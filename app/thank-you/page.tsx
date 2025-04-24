// /app/thank-you/page.tsx
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
import { useCart } from "../context/CartContext"; // Import useCart

const ThankYou: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { clearCart } = useCart(); // Get clearCart function

  // Get order number from query (keep existing logic) OR Stripe session ID
  const orderNumber = searchParams.get("order"); // Keep if needed for other flows
  const stripeSessionId = searchParams.get("session_id"); // Get Stripe session ID

  // Clear cart when the thank you page loads after a successful Stripe checkout
  useEffect(() => {
    if (stripeSessionId) {
      console.log(
        "Checkout successful via Stripe, clearing cart for session:",
        stripeSessionId
      );
      clearCart();
      // Optional: You could make an API call here to your backend
      // with the stripeSessionId to retrieve more details from Stripe
      // (like customer email used) and display them, or update your own order status.
      // fetch(`/api/confirm_order?session_id=${stripeSessionId}`);
    } else if (!orderNumber) {
      // If neither Stripe session nor order number, redirect after delay
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [stripeSessionId, orderNumber, clearCart, router]); // Add dependencies

  // Determine what to display as the order identifier
  const displayIdentifier = stripeSessionId
    ? `Order Confirmed (Ref: ...${stripeSessionId.slice(-8)})`
    : orderNumber
    ? `Order #${orderNumber}`
    : "Order Confirmed";

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
              Your booking is confirmed. We&apos;ve sent a confirmation email.
            </p>

            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-display font-semibold mb-4">
                Order Details
              </h2>

              <div className="flex justify-center mb-4">
                <div className="bg-primary/5 rounded-full px-4 py-2 font-medium text-primary">
                  {displayIdentifier}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Next Steps Section */}
                <div>
                  <h3 className="flex items-center font-semibold text-lg mb-2">
                    <Calendar className="mr-2 h-5 w-5" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        1
                      </span>
                      <span>
                        Check your email for booking confirmation details.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        2
                      </span>
                      {session?.user ? (
                        <span>
                          Review your booking in your account dashboard.
                        </span>
                      ) : (
                        <span>
                          Create an account to easily manage your bookings.
                        </span>
                      )}
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        3
                      </span>
                      <span>
                        The venue/service provider may contact you if needed.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Need Help Section */}
                <div>
                  <h3 className="flex items-center font-semibold text-lg mb-2">
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Need Help?
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Questions about your booking? Contact our support team.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/help")} // Update with your actual help route
                  >
                    Visit Help Center
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => router.push("/")}>
                <Home className="mr-2 h-4 w-4" /> Return to Home
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
                  onClick={() => router.push("/venues")} // Or maybe /services?
                >
                  Explore More
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
