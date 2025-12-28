'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CondoBasicDataPage() {
  const params = useParams();
  const condoId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [condoTypes, setCondoTypes] = useState<{_id: string; name: string}[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    country: '',
    condoEmail: '',
  });

  useEffect(() => {
    // Load condo types
    fetch('/api/condo-types')
      .then(res => res.json())
      .then(data => {
        if (data.types) {
          setCondoTypes(data.types);
        }
      });

    // Load condo data
    fetch(`/api/condos/${condoId}`)
      .then(res => res.json())
      .then(data => {
        if (data.condo) {
          setFormData({
            name: data.condo.name || '',
            type: data.condo.type || '',
            addressLine1: data.condo.addressLine1 || '',
            addressLine2: data.condo.addressLine2 || '',
            postalCode: data.condo.postalCode || '',
            country: data.condo.country || '',
            condoEmail: data.condo.condoEmail || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [condoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`/api/condos/${condoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Condo updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Data</h2>
      <p className="text-sm text-gray-600 mb-6">
        View and edit condo information
      </p>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
