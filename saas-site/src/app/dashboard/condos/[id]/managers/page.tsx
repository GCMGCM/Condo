'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Manager {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export default function CondoManagersPage() {
  const params = useParams();
  const condoId = params.id as string;
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = () => {
    fetch(`/api/condos/${condoId}/managers`)
      .then(res => res.json())
      .then(data => {
        if (data.managers) {
          setManagers(data.managers);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setMessage('');

    try {
      const res = await fetch(`/api/condos/${condoId}/managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Manager invited successfully!');
        setEmail('');
        setShowForm(false);
        loadManagers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to invite manager');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Condo Managers</h2>
          <p className="text-sm text-gray-600 mt-1">Manage who can access this condo</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          + Invite Manager
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Invite Condo Manager</h3>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="manager@example.com"
              required
            />
            <button
              type="submit"
              disabled={inviting}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {inviting ? 'Inviting...' : 'Invite'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {managers.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No managers yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {managers.map((manager) => (
              <div key={manager._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {manager.userId.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{manager.userId.fullName}</p>
                    <p className="text-xs text-gray-500">{manager.userId.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
