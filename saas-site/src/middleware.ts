import { clerkMiddleware } from '@clerk/nextjs/server';

// Minimal Clerk middleware. Route-level and API handlers enforce auth as needed.
export default clerkMiddleware();

// Apply to all routes except Next internals and static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
