import { prisma } from "../../lib/db";
import BuyButton from "../../components/buy-button";

type ServiceItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Services</h1>
          <p className="mt-2 text-gray-600">Choose a service and complete checkout securely with Stripe.</p>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600">
          No services available yet.
          <br />
          Create one by POSTing to /api/services with header x-admin-secret.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc: ServiceItem) => (
            <div key={svc.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-base font-semibold text-gray-900">{svc.name}</div>
              <div className="mt-2 text-sm text-gray-600 line-clamp-4">{svc.description}</div>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-gray-900">
                  <span className="text-2xl font-semibold">
                    ${(svc.priceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">USD</span>
                </div>
                <BuyButton serviceSlug={svc.slug} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
