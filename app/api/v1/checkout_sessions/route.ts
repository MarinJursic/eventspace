import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { getVenueById } from "@/lib/actions/venueActions";
import { getServiceById } from "@/lib/actions/serviceActions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Update interface to include optional image
interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Make image optional
  type: string;
}

export async function POST(req: NextRequest) {
  const headersList = headers();
  const origin = (await headersList).get("origin") || "http://localhost:3000";

  try {
    const body = await req.json();
    const items: CheckoutItem[] = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for checkout" },
        { status: 400 }
      );
    }

    console.log("Items received for checkout:", items);

    // --- MODIFY line_items MAPPING ---
    const line_items = items.map(async (initItem) => {
      let item = undefined;

      if (initItem.type === "venue") {
        item = await getVenueById(initItem.id);
        if (!item) {
          console.error(`Item with ID ${initItem.id} not found`);
          return null; // Skip this item if not found
        }
      } else if (initItem.type === "service") {
        item = await getServiceById(initItem.id);
        if (!item) {
          console.error(`Item with ID ${initItem.id} not found`);
          return null; // Skip this item if not found
        }
      }

      if (!item) {
        console.error(`Item with ID ${initItem.id} not found`);
        return null; // Skip this item if not found
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            // --- USE THE IMAGE URL ---
            // Stripe expects an array of image URLs
            images: initItem.image ? [initItem.image] : [],
            // -------------------------
          },
          unit_amount: Math.round(item.price.basePrice * 100), // Price in cents
        },
        quantity: initItem.quantity,
      };
    });
    // ---------------------------------

    // --- Add Metadata (Example) ---
    // It's highly recommended to add metadata to link the Stripe session
    // back to your internal booking or order ID. You'll need this in the webhook.
    // You might need to get the user ID from the session or pass your internal ID from the frontend.
    const metadata = {
      // internalBookingId: cart.internalId, // Example: if you have an ID in your cart context
      // userId: session?.user?.id, // Example: if you can access session here
    };
    // -----------------------------

    const resolvedLineItems = (await Promise.all(line_items)).filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: resolvedLineItems,
      mode: "payment",
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`, // Redirect here on success
      cancel_url: `${origin}/cart`, // Redirect here if canceled
      metadata: metadata, // Pass the metadata
      // Optionally add customer email if known
      // customer_email: customerEmail,
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (err) {
    console.error("Error creating Stripe session:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
