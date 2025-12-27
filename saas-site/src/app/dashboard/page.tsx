export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to your dashboard! You're successfully signed in.
      </p>
      
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
          <p className="text-sm text-gray-600">Manage your account settings and preferences.</p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
          <p className="text-sm text-gray-600">View and manage your subscribed services.</p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Billing</h3>
          <p className="text-sm text-gray-600">Manage your billing information and invoices.</p>
        </div>
      </div>
    </div>
  );
}
