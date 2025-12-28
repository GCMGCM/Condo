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

interface PendingInvite {
  _id: string;
  email: string;
  createdAt: string;
  invitedBy: {
    fullName: string;
  };
}

export default function CondoManagersPage() {
  const params = useParams();
  const condoId = params.id as string;
  const [managers, setManagers] = useState<Manager[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
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
        if (data.pendingInvites) {
          setPendingInvites(data.pendingInvites);
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

      {/* Active Managers */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Active Managers ({managers.length})</h3>
        </div>
        {managers.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No active managers</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {managers.map((manager) => (
              <div key={manager._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {manager.userId.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{manager.userId.fullName}</p>
                      <p className="text-xs text-gray-500">{manager.userId.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Pending Invitations ({pendingInvites.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingInvites.map((invite) => (
              <div key={invite._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                      <p className="text-xs text-gray-500">Invited by {invite.invitedBy.fullName}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
