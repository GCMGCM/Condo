'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  fullName: string;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}

export default function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const initials = user?.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/70 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">S</span>
              <span>ServiceCo</span>
            </Link>
            <nav className="hidden md:flex items-center">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <NavLink href="/faq">FAQ</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </Link>

                <Link 
                  href="/signin" 
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>

                <Link 
                  href="/signup" 
                  className="rounded-md border border-transparent px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
