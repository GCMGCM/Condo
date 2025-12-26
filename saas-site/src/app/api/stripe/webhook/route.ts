import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { stripe } from "../../../../lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!whSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  const payload = await req.text();

  try {
    event = stripe.webhooks.constructEvent(payload, signature, whSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err?.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const orderId = session?.metadata?.orderId as string | undefined;
        const paymentIntent = session?.payment_intent as string | undefined;

        if (!orderId) {
          console.warn("checkout.session.completed without orderId metadata");
          break;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentIntentId: paymentIntent ?? null,
          },
        });

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as any;
        const paymentIntent = charge?.payment_intent as string | undefined;

        if (paymentIntent) {
          await prisma.order.updateMany({
            where: { stripePaymentIntentId: paymentIntent },
            data: { status: "REFUNDED" },
          });
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as any;
        const orderId = session?.metadata?.orderId as string | undefined;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELED" },
          });
        }
        break;
      }

      default:
        // no-op for other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    return NextResponse.json({ error: "Webhook handler failure" }, { status: 500 });
  }
}
