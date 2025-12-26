export const metadata = {
  title: "Privacy Policy — ServiceCo",
  description: "How ServiceCo collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Privacy Policy</h1>

      <p className="mt-4 text-gray-700">
        Your privacy matters to us. This policy explains what information we collect, how we use it,
        and your choices. We keep this document concise and easy to read.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Information we collect</h2>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>Account identifiers (via Clerk) like email and user ID</li>
            <li>Orders and payments metadata (via Stripe)</li>
            <li>Support tickets and messages you submit</li>
            <li>Basic analytics and server logs</li>
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">How we use information</h2>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>Provide and improve our services</li>
            <li>Process payments and send receipts</li>
            <li>Offer support and respond to tickets</li>
            <li>Detect abuse and ensure security</li>
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Third‑party services</h2>
          <p className="mt-2 text-gray-700">
            We use trusted providers to operate our platform: Clerk for authentication, Stripe for
            payments, and Neon for our database. These providers process limited data to deliver
            their services in accordance with their own privacy policies.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Data retention</h2>
          <p className="mt-2 text-gray-700">
            We retain data only as long as necessary to provide services and comply with legal
            obligations. You may request deletion of your account and associated data.
          </p>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2 text-gray-700">
            Questions about this policy? Email us at{" "}
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
