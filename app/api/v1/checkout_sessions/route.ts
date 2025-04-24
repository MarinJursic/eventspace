// /app/api/checkout_sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers"; // To get the origin URL

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Define the structure of items expected from the frontend
interface CheckoutItem {
  id: string;
  name: string;
  price: number; // Price in DOLLARS (e.g., 50.00)
  quantity: number;
  image?: string; // Optional image URL
}

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000"; // Default for local dev

  try {
    const body = await req.json();
    const items: CheckoutItem[] = body.items; // Expect an array of items

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for checkout" },
        { status: 400 }
      );
    }

    // **SECURITY NOTE:** In a real application, you should NOT trust the price sent from the client.
    // You should fetch the price from your database based on the item ID to prevent manipulation.
    // For this example, we'll proceed with the client-sent price.

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd", // Or your desired currency
        product_data: {
          name: item.name,
          // Optionally add description or images:
          // description: item.description,
          // images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert price to cents
      },
      quantity: item.quantity,
    }));

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`, // Redirect here on success
      cancel_url: `${origin}/cart`, // Redirect here if canceled
      // Optionally add metadata, customer email, etc.
      // metadata: { userId: 'user_123' }, // Example
      // customer_email: 'customer@example.com', // If you have the user's email
    });

    // Return the session ID to the client
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (err) {
    console.error("Error creating Stripe session:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
