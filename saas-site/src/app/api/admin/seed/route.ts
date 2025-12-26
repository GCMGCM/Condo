import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ServiceSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(2),
  priceCents: z.number().int().positive(),
  active: z.boolean().optional().default(true),
});

const Body = z.object({
  services: z.array(ServiceSchema).optional(),
});

// POST /api/admin/seed
// Seeds example services (or custom payload) using ADMIN_SECRET header
export async function POST(req: Request) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json(
        { error: "Server not configured (ADMIN_SECRET missing)" },
        { status: 500 }
      );
    }

    const incomingSecret = req.headers.get("x-admin-secret");
    if (incomingSecret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload: z.infer<typeof Body>;
    try {
      const json = await req.json().catch(() => ({}));
      payload = Body.parse(json);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Invalid payload", issues: err?.issues ?? null },
        { status: 400 }
      );
    }

    const defaults: z.infer<typeof ServiceSchema>[] = [
      {
        slug: "logo-design",
        name: "Logo Design",
        description:
          "Craft a professional, memorable logo and brand mark. Includes 2 concepts and revisions.",
        priceCents: 19900,
        active: true,
      },
      {
        slug: "landing-page",
        name: "Landing Page",
        description:
          "A high‑converting landing page optimized for speed, SEO, and lead capture.",
        priceCents: 49900,
        active: true,
      },
      {
        slug: "seo-audit",
        name: "SEO Audit",
        description:
          "Comprehensive SEO audit with prioritized recommendations and quick wins.",
        priceCents: 14900,
        active: true,
      },
      {
        slug: "consulting-hour",
        name: "Consulting (per hour)",
        description:
          "Book an hour with a senior specialist to solve your toughest problems.",
        priceCents: 9900,
        active: true,
      },
    ];

    const services = payload.services ?? defaults;

    const results = await Promise.all(
      services.map((s) =>
        prisma.service.upsert({
          where: { slug: s.slug },
          update: {
            name: s.name,
            description: s.description,
            priceCents: s.priceCents,
            active: s.active ?? true,
          },
          create: {
            slug: s.slug,
            name: s.name,
            description: s.description,
            priceCents: s.priceCents,
            active: s.active ?? true,
          },
        })
      )
    );

    return NextResponse.json(
      { count: results.length, services: results },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admin/seed error", err);
    return NextResponse.json(
      { error: "Failed to seed services" },
      { status: 500 }
    );
  }
}
