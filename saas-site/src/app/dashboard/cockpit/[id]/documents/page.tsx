'use client';

export default function DocumentsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Share and organize important condo documents including contracts, regulations, meeting minutes, and more.
        </p>
        <p className="mt-4 text-xs text-gray-400">Coming Soon</p>
      </div>
    </div>
  );
}
