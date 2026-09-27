import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

export const PLANS = {
  free: {
    name: 'Free',
    maxCVs: 1,
    priceId: null,
  },
  pro: {
    name: 'Pro',
    maxCVs: Infinity,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY,
  },
  lifetime: {
    name: 'Lifetime',
    maxCVs: Infinity,
    priceId: process.env.STRIPE_PRICE_LIFETIME,
  },
} as const
