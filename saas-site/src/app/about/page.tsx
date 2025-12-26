export const metadata = {
  title: "About — ServiceCo",
  description: "Learn about ServiceCo and our mission.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">About</h1>
      <p className="mt-4 text-gray-700">
        ServiceCo is a modern marketplace for professional services. We believe buying services
        online should be as simple, transparent, and secure as purchasing products.
      </p>
      <p className="mt-4 text-gray-700">
        With Stripe-powered checkout, simple pricing, and fast support, we help businesses and
        creators get work done quickly. Our curated service catalog includes design, development,
        marketing, and consulting.
      </p>
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Our values</h2>
        <ul className="mt-3 list-disc pl-5 text-gray-700">
          <li>Clarity and transparent pricing</li>
          <li>Security and privacy-first</li>
          <li>Fast response times and helpful support</li>
          <li>Quality through curated services</li>
        </ul>
      </div>
    </div>
  );
}
