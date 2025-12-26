import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/db";
import { stripe, SITE_URL } from "../../../lib/stripe";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  serviceSlug: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const { serviceSlug } = Body.parse(json);

    const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
    if (!service || !service.active) {
      return NextResponse.json({ error: "Service not available" }, { status: 404 });
    }

    // Create pending order first
    const order = await prisma.order.create({
      data: {
        clerkUserId: userId,
        serviceId: service.id,
        amountCents: service.priceCents,
        currency: "usd",
        status: "PENDING",
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: service.priceCents,
            product_data: {
              name: service.name,
              description: service.description.slice(0, 500),
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/services?success=1`,
      cancel_url: `${SITE_URL}/services?canceled=1`,
      metadata: {
        orderId: order.id,
        serviceId: service.id,
        clerkUserId: userId,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("POST /api/checkout error", err);
    if (err?.issues) {
      return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
