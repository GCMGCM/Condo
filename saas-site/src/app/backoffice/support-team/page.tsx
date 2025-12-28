'use client';

import { useEffect, useState } from 'react';

interface Invite {
  _id: string;
  email: string;
  fullName: string;
  used: boolean;
}

interface Member {
  _id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

interface ActivityLog {
  _id: string;
  email: string;
  fullName: string;
  action: string;
  ipAddress: string;
  timestamp: string;
}

export default function SupportTeamPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ email: '', fullName: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is admin
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.user?.isAdmin || false);
      });

    // Fetch invites
    fetch('/api/support-team/invite')
      .then(res => res.json())
      .then(data => {
        if (data.invites) {
          setInvites(data.invites);
        }
      });

    // Fetch support team members
    fetch('/api/support-team/members')
      .then(res => res.json())
      .then(data => {
        if (data.members) {
          setMembers(data.members);
        }
      });

    // Fetch support team activity logs
    fetch('/api/support-team/logs')
      .then(res => res.json())
      .then(data => {
        if (data.logs) {
          setLogs(data.logs);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/support-team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Team member invited successfully!');
        setFormData({ email: '', fullName: '' });
        setShowForm(false);
        // Refresh invites
        const invitesRes = await fetch('/api/support-team/invite');
        const invitesData = await invitesRes.json();
        if (invitesData.invites) {
          setInvites(invitesData.invites);
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to invite');
      }
    } catch (err) {
      setMessage('An error occurred');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Support Team</h1>
      <p className="text-gray-600 mb-6">
        Manage support team members and their access levels.
      </p>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {/* Support Team Members List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Support Team Members</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-gray-500">No support team members yet</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-medium">
                      {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.fullName}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Invites */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Invites</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : invites.length === 0 ? (
            <p className="text-sm text-gray-500">No pending invites</p>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-sm font-medium">
                      {invite.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invite.fullName}</p>
                      <p className="text-xs text-gray-500">{invite.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Team Member</h2>
            <p className="text-sm text-gray-600 mb-4">
              Invite new support team members. They'll be able to access the backoffice when they sign up.
            </p>
            
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Add Team Member
              </button>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                  >
                    Send Invite
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
            )}
          </div>
        )}

        {/* Support Team Activity Logs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Support Team Activity</h2>
            <p className="text-sm text-gray-500 mt-1">Last 50 activities from support team members</p>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">No activity logs yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString('en-GB', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                          log.action === 'signup' ? 'bg-green-100 text-green-800' :
                          log.action === 'signin' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
