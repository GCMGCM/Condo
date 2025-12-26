export const metadata = {
  title: "FAQ — ServiceCo",
  description: "Frequently asked questions about ServiceCo.",
};

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Frequently Asked Questions</h1>

      <div className="mt-8 space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">How do payments work?</h2>
          <p className="mt-2 text-gray-700">
            We use Stripe to process payments. Your payment information never hits our servers.
            You can securely pay with credit/debit cards and receive a receipt from Stripe.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Where can I view my orders?</h2>
          <p className="mt-2 text-gray-700">
            After signing in, you'll be able to access your orders and support tickets from your dashboard
            (coming soon). For now, feel free to contact support via the Contact page for updates.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">What if I need help?</h2>
          <p className="mt-2 text-gray-700">
            Use the Contact page to create a support ticket. Our team will get back to you promptly.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Do you offer refunds?</h2>
          <p className="mt-2 text-gray-700">
            Refunds are handled on a case-by-case basis depending on service progress. If a refund is processed,
            you'll receive a Stripe confirmation. For questions, open a support ticket.
          </p>
        </div>
      </div>
    </div>
  );
}
