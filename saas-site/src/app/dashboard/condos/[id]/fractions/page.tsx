'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Fraction {
  _id: string;
  identifier: string;
  ownerFullName: string;
  ownerEmail: string;
  ownershipShare: number;
}

interface Condo {
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  country: string;
}

export default function CondoFractionsPage() {
  const params = useParams();
  const condoId = params.id as string;
  const [fractions, setFractions] = useState<Fraction[]>([]);
  const [condo, setCondo] = useState<Condo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    ownerFullName: '',
    ownerEmail: '',
    ownerCountryMobile: '',
    ownerMobile: '',
    ownershipShare: 0,
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    loadFractions();
    loadCondo();
  }, []);

  const loadCondo = () => {
    fetch(`/api/condos/${condoId}`)
      .then(res => res.json())
      .then(data => {
        if (data.condo) {
          setCondo(data.condo);
          // Set default address from condo
          setFormData(prev => ({
            ...prev,
            addressLine1: data.condo.addressLine1 || '',
            postalCode: data.condo.postalCode || '',
            country: data.condo.country || '',
          }));
        }
      });
  };

  const loadFractions = () => {
    fetch(`/api/condos/${condoId}/fractions`)
      .then(res => res.json())
      .then(data => {
        if (data.fractions) {
          setFractions(data.fractions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    // Auto-populate address2 with identifier + condo address2
    const finalData = {
      ...formData,
      addressLine2: formData.identifier + (condo?.addressLine2 ? `, ${condo.addressLine2}` : ''),
    };

    try {
      const res = await fetch(`/api/condos/${condoId}/fractions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Fraction created successfully!');
        setFormData({
          identifier: '',
          ownerFullName: '',
          ownerEmail: '',
          ownerCountryMobile: '',
          ownerMobile: '',
          ownershipShare: 0,
          addressLine1: condo?.addressLine1 || '',
          addressLine2: '',
          postalCode: condo?.postalCode || '',
          country: condo?.country || '',
        });
        setShowForm(false);
        loadFractions();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to create fraction');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Fractions</h2>
          <p className="text-sm text-gray-600 mt-1">Manage condo fractions and units</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          + Add Fraction
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Fraction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identifier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., Apt 101, Unit 5B"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ownership Share (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.ownershipShare}
                  onChange={(e) => setFormData({ ...formData, ownershipShare: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ownerFullName}
                  onChange={(e) => setFormData({ ...formData, ownerFullName: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Mobile Code
                </label>
                <input
                  type="text"
                  value={formData.ownerCountryMobile}
                  onChange={(e) => setFormData({ ...formData, ownerCountryMobile: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., +351"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.ownerMobile}
                  onChange={(e) => setFormData({ ...formData, ownerMobile: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., 912345678"
                />
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-2">
                  Address defaults to condo address. Identifier will be added to Address Line 2.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Fraction'}
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

      {fractions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500">No fractions yet. Add your first fraction to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {fractions.map((fraction) => (
            <div
              key={fraction._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold mb-3">
                  {fraction.identifier.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{fraction.identifier}</h3>
                <p className="text-sm text-gray-600">{fraction.ownerFullName}</p>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p>{fraction.ownerEmail}</p>
                {fraction.ownershipShare > 0 && (
                  <p className="font-medium text-gray-700">Share: {fraction.ownershipShare}%</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
