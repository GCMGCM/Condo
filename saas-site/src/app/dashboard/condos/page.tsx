'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Condo {
  _id: string;
  name: string;
  avatar: string;
  lastActivityAt: string;
  createdAt: string;
}

export default function CondosPage() {
  const router = useRouter();
  const [condos, setCondos] = useState<Condo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [condoTypes, setCondoTypes] = useState<{_id: string; name: string}[]>([]);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    country: '',
    condoEmail: '',
    type: '',
  });

  useEffect(() => {
    loadCondos();
    loadCondoTypes();
  }, []);

  const loadCondoTypes = () => {
    fetch('/api/condo-types')
      .then(res => res.json())
      .then(data => {
        if (data.types) {
          setCondoTypes(data.types);
        }
      })
      .catch(err => console.error('Failed to load condo types:', err));
  };

  const loadCondos = () => {
    fetch('/api/condos')
      .then(res => res.json())
      .then(data => {
        if (data.condos) {
          setCondos(data.condos);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage('');

    try {
      const res = await fetch('/api/condos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Condo created successfully!');
        setFormData({
          name: '',
          addressLine1: '',
          addressLine2: '',
          postalCode: '',
          country: '',
          condoEmail: '',
          type: '',
        });
        setShowForm(false);
        loadCondos();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to create condo');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setCreating(false);
    }
  };

  const getActivityStatus = (lastActivityAt: string) => {
    const now = new Date();
    const lastActivity = new Date(lastActivityAt);
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) return 'active';
    if (diffHours < 168) return 'recent'; // 7 days
    return 'inactive';
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'recent': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Condos</h1>
          <p className="text-gray-600 mt-1">Manage your condominium properties</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          + Create Condo
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Condo</h2>
          <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Condo Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., Sunset Residences"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  required
                >
                  <option value="">Select type...</option>
                  {condoTypes.map((type) => (
                    <option key={type._id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="Apt, suite, etc."
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., 1234-567"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., Portugal"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="condoEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Condo Email
                </label>
                <input
                  type="email"
                  id="condoEmail"
                  value={formData.condoEmail}
                  onChange={(e) => setFormData({ ...formData, condoEmail: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., info@condo.com"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {condos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No condos yet. Create your first condo to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {condos.map((condo) => {
            const activityStatus = getActivityStatus(condo.lastActivityAt);
            return (
              <div
                key={condo._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/condos/${condo._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {getInitials(condo.name)}
                  </div>
                  <div className={`h-3 w-3 rounded-full ${getActivityColor(activityStatus)}`} title={activityStatus}></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{condo.name}</h3>
                <p className="text-xs text-gray-500">
                  Created {new Date(condo.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
