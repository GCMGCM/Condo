import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { isStaff } from "../../../lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CreateTicketBody = z.object({
  subject: z.string().min(3).max(200),
  message: z.string().min(3).max(4000),
});

// GET /api/tickets
// - If requester is staff, return all tickets (most recent first)
// - Else return only their tickets
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await isStaff(userId);
    const where = staff ? {} : { clerkUserId: userId };

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(tickets);
  } catch (err) {
    console.error("GET /api/tickets error", err);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// POST /api/tickets
// Create a new ticket and first message by the authenticated user
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const data = CreateTicketBody.parse(json);

    const ticket = await prisma.ticket.create({
      data: {
        clerkUserId: userId,
        subject: data.subject,
        messages: {
          create: {
            senderClerkId: userId,
            role: "USER",
            content: data.message,
          },
        },
      },
      include: { messages: true },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/tickets error", err);
    if (err?.issues) {
      return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
