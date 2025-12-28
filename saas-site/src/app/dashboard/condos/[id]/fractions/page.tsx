'use client';

export default function CondoFractionsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Fractions</h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage condo fractions and units
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Fractions Coming Soon</h3>
        <p className="text-sm text-gray-500">
          This feature will allow you to manage individual units and fractions within the condominium.
        </p>
      </div>
    </div>
  );
}
