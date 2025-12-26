import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { z } from "zod";
import { upsertStaff } from "../../../../lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  clerkUserId: z.string().min(1),
  role: z.enum(["SUPPORT", "ADMIN"]).optional().default("SUPPORT"),
});

// GET /api/admin/staff - list staff (admin-secret protected)
export async function GET(req: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json({ error: "Server not configured (ADMIN_SECRET)" }, { status: 500 });
  }
  const incomingSecret = new Headers(req.headers).get("x-admin-secret");
  if (incomingSecret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staff = await prisma.staff.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(staff);
}

// POST /api/admin/staff - add or update a staff member (admin-secret protected)
export async function POST(req: Request) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: "Server not configured (ADMIN_SECRET)" }, { status: 500 });
    }
    const incomingSecret = new Headers(req.headers).get("x-admin-secret");
    if (incomingSecret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json().catch(() => ({}));
    const { clerkUserId, role } = Body.parse(json);

    const res = await upsertStaff(clerkUserId, role);
    return NextResponse.json(res, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    }
    console.error("POST /api/admin/staff error", err);
    return NextResponse.json({ error: "Failed to upsert staff" }, { status: 500 });
  }
}
