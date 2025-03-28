"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  cart: any; // Replace `any` with your cart type
  totalAmount: number;
  getVenuePrice: () => number;
  extractPrice: (priceString: string) => number;
  clearCart: () => void;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  totalAmount,
  getVenuePrice,
  extractPrice,
  clearCart,
  onCheckout,
}) => {
  const isMultiDay = cart.selectedDates.length > 1;

  return (
    <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
      <h2 className="text-xl font-display font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{cart.venue.name}</p>
            <p className="text-sm text-muted-foreground">
              {cart.selectedDates.length} day(s)
            </p>
          </div>
          <p className="font-medium">${getVenuePrice()}</p>
        </div>
        {cart.services && cart.services.length > 0 && (
          <>
            <Separator className="my-3" />
            <div>
              <p className="font-medium mb-2">Services</p>
              {cart.services.map((service: any, index: number) => (
                <div key={index} className="flex justify-between mb-1 text-sm">
                  <span>{service.name}</span>
                  <span>
                    ${extractPrice(service.totalPrice || service.price)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <Separator className="my-3" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${totalAmount}</span>
        </div>
        <div className="bg-primary/5 rounded-lg p-3 text-sm">
          <p className="flex items-center text-primary font-medium mb-1">
            <CheckCircle className="mr-1 h-4 w-4" />
            Booking Details
          </p>
          <p className="text-muted-foreground">
            {cart.selectedDates.length === 1
              ? cart.selectedDates[0]
              : `${cart.selectedDates[0]} to ${
                  cart.selectedDates[cart.selectedDates.length - 1]
                }`}
          </p>
          <p className="text-muted-foreground">{cart.venue.location}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
