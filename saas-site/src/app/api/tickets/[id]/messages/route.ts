import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { isStaff } from "../../../../../lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  content: z.string().min(1).max(4000),
});

// POST /api/tickets/[id]/messages
// Add a message to a ticket by the owner or staff
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticketId = params.id;
    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticket id" }, { status: 400 });
    }

    const json = await req.json();
    const { content } = Body.parse(json);

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const staff = await isStaff(userId);
    const isOwner = ticket.clerkUserId === userId;
    if (!staff && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderClerkId: userId,
        role: staff ? "SUPPORT" : "USER",
        content,
      },
    });

    // Touch ticket updatedAt
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/tickets/[id]/messages error", err);
    if (err?.issues) {
      return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
  }
}
