'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function FractionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const condoId = params.id as string;
  const fractionId = params.fractionId as string;

  const [fraction, setFraction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);
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
    loadFraction();
  }, []);

  const loadFraction = () => {
    fetch(`/api/condos/${condoId}/fractions/${fractionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.fraction) {
          setFraction(data.fraction);
          setFormData({
            identifier: data.fraction.identifier || '',
            ownerFullName: data.fraction.ownerFullName || '',
            ownerEmail: data.fraction.ownerEmail || '',
            ownerCountryMobile: data.fraction.ownerCountryMobile || '',
            ownerMobile: data.fraction.ownerMobile || '',
            ownershipShare: data.fraction.ownershipShare || 0,
            addressLine1: data.fraction.addressLine1 || '',
            addressLine2: data.fraction.addressLine2 || '',
            postalCode: data.fraction.postalCode || '',
            country: data.fraction.country || '',
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push(`/dashboard/condos/${condoId}/fractions`);
      });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`/api/condos/${condoId}/fractions/${fractionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Fraction updated successfully!');
        setEditing(false);
        loadFraction();
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

  const handleInviteOwner = async () => {
    setInviting(true);
    setMessage('');

    try {
      const res = await fetch(`/api/condos/${condoId}/fractions/${fractionId}/invite-owner`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Owner invited successfully!');
        loadFraction();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Invite failed');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!fraction) {
    return null;
  }

  const getOwnerStatus = () => {
    if (fraction.ownerAccepted) {
      return { text: 'Accepted', color: 'bg-green-100 text-green-800' };
    }
    if (fraction.ownerInvited) {
      return { text: 'Invited - Pending', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: 'Not Invited', color: 'bg-gray-100 text-gray-800' };
  };

  const ownerStatus = getOwnerStatus();

  return (
    <div>
      <button
        onClick={() => router.push(`/dashboard/condos/${condoId}/fractions`)}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Fractions
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{fraction.identifier}</h1>
          <p className="text-gray-600 mt-1">Fraction Details</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Edit Fraction
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {editing ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Fraction</h2>
          <form onSubmit={handleSave} className="space-y-4">
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
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
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
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Owner Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Owner Information</h2>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${ownerStatus.color}`}>
                {ownerStatus.text}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                <p className="mt-1 text-sm text-gray-900">{fraction.ownerFullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-gray-900">{fraction.ownerEmail}</p>
                  {!fraction.ownerInvited && (
                    <button
                      onClick={handleInviteOwner}
                      disabled={inviting}
                      className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {inviting ? 'Inviting...' : 'Invite Owner'}
                    </button>
                  )}
                </div>
              </div>
              {fraction.ownerCountryMobile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {fraction.ownerCountryMobile} {fraction.ownerMobile}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ownership Share</label>
                <p className="mt-1 text-sm text-gray-900">{fraction.ownershipShare}%</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-2">
              {fraction.addressLine1 && <p className="text-sm text-gray-900">{fraction.addressLine1}</p>}
              {fraction.addressLine2 && <p className="text-sm text-gray-900">{fraction.addressLine2}</p>}
              <p className="text-sm text-gray-900">
                {fraction.postalCode} {fraction.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
