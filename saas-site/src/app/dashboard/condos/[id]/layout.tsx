'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Condo {
  _id: string;
  name: string;
}

export default function CondoDetailLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const condoId = params.id as string;
  const [condo, setCondo] = useState<Condo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Fetch condo details
    fetch(`/api/condos/${condoId}`)
      .then(res => res.json())
      .then(data => {
        if (data.condo) {
          setCondo(data.condo);
          setIsManager(data.isManager || false);
        } else {
          router.push('/dashboard/condos');
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/dashboard/condos');
      });
  }, [condoId, router]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!condo || !isManager) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      {/* Condo Header */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <Link
          href="/dashboard/condos"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Condos
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(condo.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{condo.name}</h1>
            <p className="text-sm text-gray-600">Condo Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <Link
            href={`/dashboard/condos/${condoId}`}
            className="pb-3 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Basic Data
          </Link>
          <Link
            href={`/dashboard/condos/${condoId}/managers`}
            className="pb-3 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Condo Managers
          </Link>
          <Link
            href={`/dashboard/condos/${condoId}/fractions`}
            className="pb-3 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Fractions
          </Link>
        </nav>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
