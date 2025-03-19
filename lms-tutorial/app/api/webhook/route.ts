import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  console.log(
    `[WEBHOOK] Event type: ${event.type}, userId: ${userId}, courseId: ${courseId}`
  );

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      console.error(
        "Webhook Error: Missing metadata in completed session",
        session
      );
      return new NextResponse("Webhook Error: Missing metadata", {
        status: 400,
      });
    }

    try {
      const existingPurchase = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId,
          },
        },
      });

      if (existingPurchase) {
        console.log(
          `[WEBHOOK] Purchase already exists for userId: ${userId}, courseId: ${courseId}`
        );
        return new NextResponse("Purchase already exists", { status: 200 });
      }

      const purchase = await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });

      console.log(
        `[WEBHOOK] Created purchase: ${purchase.id} for userId: ${userId}, courseId: ${courseId}`
      );
    } catch (error) {
      console.error("[WEBHOOK] Error creating purchase:", error);
      return new NextResponse("Error processing purchase", { status: 500 });
    }
  } else {
    console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    return new NextResponse(`Webhook: Unhandled event type ${event.type}`, {
      status: 200,
    });
  }

  return new NextResponse(null, { status: 200 });
}
