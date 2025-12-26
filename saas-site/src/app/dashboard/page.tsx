import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard — ServiceCo',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="bg-white p-8 rounded-md border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Your dashboard</h1>
          <p className="mt-4 text-gray-600">
            This is a dummy dashboard that users are redirected to after signing up. In a full implementation you'd
            show account info, active orders, and support tickets here.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Account</h3>
              <p className="mt-2 text-sm text-gray-600">Email and profile settings would appear here.</p>
            </div>
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Support</h3>
              <p className="mt-2 text-sm text-gray-600">Open a ticket or view existing tickets.</p>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              Back to home
            </Link>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>
            Note: This is a demo dashboard. We store only the minimum personal data (email, full name, hashed password)
            and record GDPR consent. To request deletion send email to <a href="mailto:support@your-domain.com" className="underline">support@your-domain.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
