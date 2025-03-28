"use client";

import React from "react";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PaymentFormProps {
  paymentDetails: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    zipCode: string;
  };
  loading: boolean;
  totalAmount: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentDetails,
  loading,
  totalAmount,
  onInputChange,
  onCardNumberChange,
  onExpiryDateChange,
  onSubmit,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h1 className="text-3xl font-display font-bold mb-6">Payment</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-display font-semibold flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Card Information
          </h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={onCardNumberChange}
                maxLength={19}
                required
              />
            </div>
            <div>
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                name="cardHolder"
                placeholder="John Smith"
                value={paymentDetails.cardHolder}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={onExpiryDateChange}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={onInputChange}
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="zipCode">Billing Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="12345"
                value={paymentDetails.zipCode}
                onChange={onInputChange}
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <p className="flex items-center text-sm text-muted-foreground">
            <Lock className="mr-1 h-4 w-4" />
            Your payment information is secure and encrypted
          </p>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Processing..." : `Pay $${totalAmount}`}
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;
