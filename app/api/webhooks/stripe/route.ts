import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`Webhook received: ${event.id}, Type: ${event.type}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: "Webhook error: Invalid signature" },
      { status: 400 }
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Checkout session completed:", session.id);
    console.log("Metadata:", session.metadata);
    console.log("Customer details:", session.customer_details);

    const internalBookingId = session.metadata?.internalBookingId;
    if (internalBookingId) {
      try {
        console.log(
          `Placeholder: Would update internal booking ${internalBookingId} for session ${session.id}`
        );
      } catch (dbError) {
        console.error(
          `Database update failed for booking ${internalBookingId}:`,
          dbError
        );
      }
    } else {
      console.error(
        `Missing internalBookingId in metadata for session ${session.id}. Cannot update database status.`
      );
    }
    const customerEmail = "marin.jursic@gmail.com"; //session.customer_details?.email;
    const customerName = session.customer_details?.name || "Valued Customer";
    const amountTotal = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "N/A";

    console.log(`Customer Email: ${customerEmail}`);
    console.log(`Customer Name: ${customerName}`);
    console.log(`Total Amount: $${amountTotal}`);

    if (customerEmail) {
      try {
        // --- STYLED HTML TEMPLATE ---
        const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Booking Confirmation</title>
   <style>
       /* Basic Reset */
       body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
       table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
       img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
       body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f3f4f6; /* Light gray background */ }

       /* Main Styles */
       .container {
           max-width: 600px;
           margin: 20px auto;
           background-color: #ffffff; /* White card */
           border: 1px solid #e5e7eb; /* Light gray border */
           border-radius: 12px; /* Rounded corners */
           padding: 32px;
           font-family: Inter, Arial, sans-serif;
           color: #111827; /* Dark text */
       }
       h1 {
           font-size: 28px;
           font-weight: bold;
           color: #111827;
           margin: 0 0 16px 0;
           text-align: center;
       }
       p {
           font-size: 16px;
           color: #4b5563; /* Muted foreground */
           line-height: 1.6;
           margin: 0 0 16px 0;
       }
       .details {
           background-color: #f9fafb; /* Secondary background */
           border: 1px solid #e5e7eb;
           border-radius: 8px;
           padding: 16px;
           margin-bottom: 24px;
       }
       .details p {
           margin-bottom: 8px;
           font-size: 14px;
       }
       .details strong {
           color: #1f2937; /* Slightly darker gray */
           font-weight: 600;
       }
       .button-link {
           display: inline-block;
           background-color: #111827; /* Primary background */
           color: #f9fafb !important; /* Primary foreground - !important for email clients */
           padding: 12px 24px;
           border-radius: 8px;
           text-decoration: none;
           font-weight: 500;
           margin-top: 24px;
           text-align: center;
           border: none; /* Reset border */
       }
       .footer {
           text-align: center;
           font-size: 12px;
           color: #6b7280; /* Muted foreground */
           margin-top: 24px;
       }
       a {
           color: #111827; /* Primary color for links */
       }
   </style>
</head>
<body>
   <div class="container">
       <!-- Optional Logo -->
       <!-- <div style="text-align: center; margin-bottom: 24px;">
           <img src="YOUR_LOGO_URL" alt="EventSpace Logo" width="150">
       </div> -->

       <h1>Booking Confirmed!</h1>
       <p>Hi ${customerName},</p>
       <p>Thank you for your booking with EventSpace! Your payment was successful and your event details are confirmed. The vendor will be in touch with you soon.</p>

       <div class="details">
           <p><strong>Booking Reference:</strong> ${session.id}</p>
           <p><strong>Total Amount Paid:</strong> $${amountTotal}</p>
           <!-- Add more details if available from session or metadata -->
           <!-- <p><strong>Venue:</strong> [Venue Name]</p> -->
           <!-- <p><strong>Date(s):</strong> [Formatted Dates]</p> -->
       </div>

       <p style="margin-top: 24px;">If you have any immediate questions, please don't hesitate to contact our support team.</p>
       <p>Best regards,<br/>The EventSpace Team</p>

       <div class="footer">
           © ${new Date().getFullYear()} EventSpace. All rights reserved.
           <!-- Optional: Add address or contact info here -->
       </div>
   </div>
</body>
</html>
       `;

        const { data, error } = await resend.emails.send({
          from: "EventSpace <onboarding@resend.dev>",
          to: [customerEmail],
          subject: "Your EventSpace Booking Confirmation",
          html: emailHtml,
        });

        if (error) {
          console.error("Resend API Error:", error);
        } else {
          console.log(
            `Confirmation email sent successfully to ${customerEmail}, ID: ${data?.id}`
          );
        }
      } catch (emailError) {
        console.error("Resend email sending failed (exception):", emailError);
      }
    } else {
      console.warn(
        `No customer email found for session: ${session.id}. Cannot send confirmation.`
      );
    }
  } else {
    console.log(`Webhook received but unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
