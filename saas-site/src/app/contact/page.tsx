import ContactForm from "../../components/contact-form";

export const metadata = {
  title: "Contact Support — ServiceCo",
  description: "Get in touch with our support team.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Contact</h1>
      <p className="mt-2 text-gray-600">
        Have a question or need help with an order? Submit a ticket and our support team will reach out.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
        <p>
          You can also email us at{" "}
          <a className="underline hover:text-gray-800" href="mailto:support@your-domain.com">
            support@your-domain.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
