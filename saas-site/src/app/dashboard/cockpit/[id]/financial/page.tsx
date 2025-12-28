'use client';

export default function FinancialPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Information</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          View financial reports, budgets, expenses, and payment information for your condo.
        </p>
        <p className="mt-4 text-xs text-gray-400">Coming Soon</p>
      </div>
    </div>
  );
}
