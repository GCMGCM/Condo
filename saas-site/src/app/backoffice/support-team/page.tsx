export default function SupportTeamPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Support Team</h1>
      <p className="text-gray-600 mb-6">
        Manage support team members and their access levels.
      </p>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-sm font-medium">
                  ST
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Support Team Member</p>
                  <p className="text-xs text-gray-500">support@example.com</p>
                </div>
              </div>
              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                Support
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Team Member</h2>
          <p className="text-sm text-gray-600 mb-4">
            Invite new support team members to help manage customer inquiries.
          </p>
          <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            Add Team Member
          </button>
        </div>
      </div>
    </div>
  );
}
