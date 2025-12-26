import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,0,0,0.05),transparent_60%)]" />
        <div className="container mx-auto max-w-6xl px-6 py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                Launch faster with a modern SaaS template
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Buy professional services online with a seamless checkout experience
              </h1>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                ServiceCo helps you discover and purchase expert services. Secure payments,
                transparent pricing, and a simple dashboard for orders and support.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
                >
                  Explore Services
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Talk to Support
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-6 text-xs text-gray-500">
                <div>Secure Stripe payments</div>
                <div>24/7 support</div>
                <div>Simple pricing</div>
              </div>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="text-sm font-medium text-gray-900">Logo Design</div>
                  <div className="mt-2 text-sm text-gray-600">From $199</div>
                  <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                    Deliver a professional visual identity for your brand.
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="text-sm font-medium text-gray-900">Landing Page</div>
                  <div className="mt-2 text-sm text-gray-600">From $499</div>
                  <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                    Convert more visitors with a high‑converting landing page.
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="text-sm font-medium text-gray-900">SEO Audit</div>
                  <div className="mt-2 text-sm text-gray-600">From $149</div>
                  <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                    Find growth opportunities and fix technical issues.
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-5">
                  <div className="text-sm font-medium text-gray-900">Consulting</div>
                  <div className="mt-2 text-sm text-gray-600">From $99/hr</div>
                  <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                    Get actionable advice from senior specialists.
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div className="text-sm text-gray-700">Ready to get started?</div>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  Browse services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-gray-200">
        <div className="container mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-sm text-gray-500">
            Trusted by startups, creators, and growing businesses
          </p>
        </div>
      </section>
    </div>
  );
}
