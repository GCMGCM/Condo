'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function CockpitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const condoId = params.id as string;
  const [condo, setCondo] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/condos/${condoId}`)
      .then(res => res.json())
      .then(data => {
        if (data.condo) {
          setCondo(data.condo);
        }
      });
  }, [condoId]);

  const tabs = [
    { name: 'Message Board', href: `/dashboard/cockpit/${condoId}` },
    { name: 'Tickets', href: `/dashboard/cockpit/${condoId}/tickets` },
    { name: 'Documents', href: `/dashboard/cockpit/${condoId}/documents` },
    { name: 'Fin. Info', href: `/dashboard/cockpit/${condoId}/financial` },
  ];

  const isActive = (href: string) => {
    if (href === `/dashboard/cockpit/${condoId}`) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/condos"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Condos
        </Link>
        {condo && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{condo.name}</h1>
            <p className="text-gray-600 mt-1">Condo Cockpit</p>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  isActive(tab.href)
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  );
}
