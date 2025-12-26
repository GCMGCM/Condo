import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;

// Stripe client (may be undefined if key not set)
// Using default API version from Stripe package
export const stripe = key
  ? new Stripe(key)
  : (null as unknown as Stripe);

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://example.com';
