'use client';

export default function MessageBoardPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Board</h2>
      
      <div className="space-y-4">
        {/* Public Board */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Public Board</h3>
            <span className="text-xs text-gray-500">All residents and managers</span>
          </div>
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Public message board coming soon</p>
            <p className="text-xs text-gray-400 mt-1">All fraction owners and managers can post here</p>
          </div>
        </div>

        {/* Private Board */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Private Board</h3>
            <span className="text-xs text-gray-500">Managers only</span>
          </div>
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm">Private message board coming soon</p>
            <p className="text-xs text-gray-400 mt-1">Only condo managers can access this board</p>
          </div>
        </div>
      </div>
    </div>
  );
}
