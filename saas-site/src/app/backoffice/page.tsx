export default function BackofficePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Data</h1>
      <p className="text-gray-600 mb-6">
        View and manage your admin profile information.
      </p>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">marcondes.gustavo@gmail.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-sm text-gray-900">System Administrator</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <p className="mt-1 text-sm text-gray-900">Full access to all features</p>
          </div>
        </div>
      </div>
    </div>
  );
}
