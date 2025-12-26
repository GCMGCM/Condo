'use client';

import { ClerkProvider } from '@clerk/nextjs';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Always render a ClerkProvider so client components (SignedIn/SignedOut/etc.)
  // are mounted within the provider. Clerk will handle missing keys in dev/keyless scenarios.
  return <ClerkProvider>{children}</ClerkProvider>;
}
