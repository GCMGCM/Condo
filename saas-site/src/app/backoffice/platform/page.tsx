'use client';

import { useEffect, useState } from 'react';

interface CondoType {
  _id: string;
  name: string;
  createdAt: string;
}

export default function PlatformManagementPage() {
  const [types, setTypes] = useState<CondoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [typeName, setTypeName] = useState('');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = () => {
    fetch('/api/condo-types')
      .then(res => res.json())
      .then(data => {
        if (data.types) {
          setTypes(data.types);
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
      const res = await fetch('/api/condo-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: typeName }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Condo type created successfully!');
        setTypeName('');
        setShowForm(false);
        loadTypes();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to create type');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/condo-types?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage('Type deleted successfully!');
        loadTypes();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to delete type');
      }
    } catch (err) {
      setMessage('An error occurred');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Platform Management</h1>
      <p className="text-gray-600 mb-6">
        Manage platform settings and condo types.
      </p>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Condo Types</h2>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              + Add Type
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Condo Type</h3>
              <form onSubmit={handleCreate} className="flex gap-2">
                <input
                  type="text"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="e.g., Residential condo"
                  required
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Adding...' : 'Add'}
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

          {types.length === 0 ? (
            <p className="text-sm text-gray-500">No condo types yet. Add the first type to get started!</p>
          ) : (
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-500">
                      Added {new Date(type.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(type._id, type.name)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
