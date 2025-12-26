'use client';

import { useState } from 'react';

type Props = {
  serviceSlug: string;
};

export default function BuyButton({ serviceSlug }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleClick = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceSlug }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || 'Failed to start checkout');
      }
      const { url } = await res.json();
      if (!url) throw new Error('Missing checkout URL');
      window.location.href = url as string;
    } catch (e: any) {
      setErr(e.message || 'Unexpected error');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        aria-label="Buy now"
      >
        {loading ? 'Redirecting…' : 'Buy now'}
      </button>
      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
    </div>
  );
}
