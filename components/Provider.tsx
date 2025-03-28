"use client";
import { CartProvider } from "@/app/context/CartContext";
import { SessionProvider } from "next-auth/react";

import React from "react";

export default function Provider({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}>) {
  return (
    <SessionProvider session={session}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
