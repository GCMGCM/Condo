'use client';

export default function TicketsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Kanban-Style Tickets</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          A Kanban board for managing condo issues, maintenance requests, and tasks. Track progress from "To Do" to "Done".
        </p>
        <p className="mt-4 text-xs text-gray-400">Coming Soon</p>
      </div>
    </div>
  );
}
