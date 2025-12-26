import Link from 'next/link';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-black text-white font-semibold">S</span>
            <span className="font-medium">ServiceCo</span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
            <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link href="/services" className="hover:text-gray-900 transition-colors">Services</Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
          </nav>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>&copy; {year} ServiceCo. All rights reserved.</p>
          <p className="mt-2">
            Need help? <a className="underline hover:text-gray-700" href="mailto:support@your-domain.com">support@your-domain.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
