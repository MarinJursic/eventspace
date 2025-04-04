"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PaymentForm from "@/components/payment/PaymentForm";
import OrderSummary from "@/components/payment/OrderSummary";
import { useCart } from "../context/CartContext";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";

// Helper functions (you can also extract these to a separate file if needed)
const extractPrice = (priceString: string): number => {
  const match = priceString.match(/\$?([\d,]+)/);
  if (match && match[1]) {
    return parseInt(match[1].replace(/,/g, ""));
  }
  return 0;
};

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    zipCode: "",
  });

  // Redirect if cart or venue is missing
  if (!cart || !cart.venue) {
    router.push("/cart");

    return null;
  }

  // Calculate totals
  const getVenuePrice = (): number => {
    if (!cart.venue.price) return 0;
    const numDays = cart.selectedDates.length;
    return cart.venue.price.basePrice * numDays;
  };

  const getServicesTotal = (): number => {
    if (!cart.services?.length) return 0;
    return cart.services.reduce((total: number, service: any) => {
      if (service.totalPrice) {
        const serviceDays = service.selectedDays || cart.selectedDates;
        const daysRatio = serviceDays.length / cart.selectedDates.length;
        return total + extractPrice(service.totalPrice) * daysRatio;
      }
      return total + extractPrice(service.price);
    }, 0);
  };

  const totalAmount = getVenuePrice() + getServicesTotal();

  // Handlers for payment inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] ? matches[0] : "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentDetails((prev) => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setPaymentDetails((prev) => ({ ...prev, expiryDate: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validate form
    if (
      !paymentDetails.cardNumber ||
      !paymentDetails.cardHolder ||
      !paymentDetails.expiryDate ||
      !paymentDetails.cvv ||
      !paymentDetails.zipCode
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      // Generate a random order number
      const orderNumber = `EVN-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/thank-you?order=${orderNumber}`);
      toast({
        title: "Payment successful",
        description: "Your booking has been confirmed",
      });
      // Clear the cart after a slight delay (or in the thank-you page)
      setTimeout(() => {
        clearCart();
      }, 500);
    }, 1500);
  };

  return (
    <div className="mt-10 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-up">
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/cart")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cart
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PaymentForm
                paymentDetails={paymentDetails}
                loading={loading}
                totalAmount={totalAmount}
                onInputChange={handleInputChange}
                onCardNumberChange={handleCardNumberChange}
                onExpiryDateChange={handleExpiryDateChange}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="lg:col-span-1">
              <OrderSummary
                cart={cart}
                totalAmount={totalAmount}
                getVenuePrice={getVenuePrice}
                extractPrice={extractPrice}
                clearCart={clearCart}
                onCheckout={() => router.push("/payment")}
              />
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default PaymentPage;
