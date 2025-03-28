"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/context/CartContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CartIcon: React.FC = () => {
  const { cart } = useCart();
  // Calculate total items: count the venue (if present) plus any added services.
  const totalItems = cart ? 1 + (cart.services.length || 0) : 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your bookings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CartIcon;
