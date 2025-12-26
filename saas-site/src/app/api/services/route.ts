import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { z } from "zod";

const serviceSchema = z.object({
  slug: z.string().min(2).max(64),
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(2000),
  priceCents: z.number().int().positive(),
  active: z.boolean().optional().default(true),
});

// GET /api/services - list active services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (err) {
    console.error("GET /api/services error", err);
    return NextResponse.json({ error: "Failed to list services" }, { status: 500 });
  }
}

// POST /api/services - admin create or update by slug
export async function POST(req: Request) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: "Server not configured (ADMIN_SECRET)" }, { status: 500 });
    }
    const incomingSecret = req.headers.get("x-admin-secret");
    if (incomingSecret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const data = serviceSchema.parse(json);

    const upserted = await prisma.service.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        description: data.description,
        priceCents: data.priceCents,
        active: data.active,
      },
      create: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        priceCents: data.priceCents,
        active: data.active,
      },
    });

    return NextResponse.json(upserted, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/services error", err);
    if (err?.issues) {
      return NextResponse.json({ error: "Invalid payload", issues: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
