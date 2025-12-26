export const metadata = {
  title: "Terms of Service — ServiceCo",
  description: "Terms and conditions for using ServiceCo.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Terms of Service</h1>

      <div className="mt-6 space-y-6 text-gray-700">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">1. Agreement</h2>
          <p className="mt-2">
            By accessing or using ServiceCo, you agree to these Terms. If you do not agree, do not
            use our services.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">2. Services and Payments</h2>
          <p className="mt-2">
            We facilitate the purchase of professional services. Payments are processed by Stripe.
            Prices are shown before checkout and may be updated from time to time.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">3. User Accounts</h2>
          <p className="mt-2">
            You are responsible for your account and any activity that occurs under it. We use Clerk
            to handle authentication and account management.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">4. Refunds</h2>
          <p className="mt-2">
            Refund eligibility depends on project progress and scope. If a refund is issued, Stripe
            will process it, and you will receive a confirmation.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">5. Acceptable Use</h2>
          <p className="mt-2">
            Do not misuse the service or attempt to interfere with normal operation. We may suspend
            or terminate access for violating these terms.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">6. Contact</h2>
          <p className="mt-2">
            Questions about these Terms? Email{" "}
            <a className="underline hover:text-gray-800" href="mailto:support@your-domain.com">
              support@your-domain.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
