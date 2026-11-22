import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeSecretKey } from '../stripe-env';
import {
  MAX_CUSTOM_AMOUNT,
  MIN_CUSTOM_AMOUNT,
  SPONSOR_TIERS,
  resolveSupportedCurrency,
  toMinorUnits,
  type SupportedCurrency,
} from '../sponsorship';

const SPONSOR_PAGE_PATH = '/sponsor-me';

type CheckoutItem = {
  name: string;
  description: string;
  amount: number;
  tier: string;
};

function getOrigin(request: Request): string {
  const configured = process.env.SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  return new URL(request.url).origin;
}

function redirectWithStatus(request: Request, status: string) {
  const url = new URL(SPONSOR_PAGE_PATH, getOrigin(request));
  url.searchParams.set('status', status);

  return NextResponse.redirect(url, 303);
}

function resolveItem(formData: FormData, currency: SupportedCurrency): CheckoutItem | null {
  const tierId = formData.get('tier');

  if (typeof tierId === 'string' && tierId.length > 0) {
    const tier = SPONSOR_TIERS.find((candidate) => candidate.id === tierId);

    if (!tier) return null;

    return {
      name: `Sponsorship — ${tier.name}`,
      description: tier.blurb,
      amount: tier.amount,
      tier: tier.id,
    };
  }

  const rawAmount = formData.get('amount');

  if (typeof rawAmount !== 'string' || rawAmount.trim() === '') return null;

  const amount = Number(rawAmount);

  if (!Number.isFinite(amount) || amount < MIN_CUSTOM_AMOUNT || amount > MAX_CUSTOM_AMOUNT) {
    return null;
  }

  if (toMinorUnits(amount, currency) <= 0) return null;

  return {
    name: 'One-time sponsorship',
    description: 'A custom one-time sponsorship to support my work.',
    amount,
    tier: 'custom',
  };
}

export async function POST(request: Request) {
  const secretKey = await getStripeSecretKey();

  if (!secretKey) {
    console.error('Stripe Checkout is unavailable: STRIPE_SECRET_KEY is not set.');
    return redirectWithStatus(request, 'unavailable');
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return redirectWithStatus(request, 'invalid');
  }

  const currency = resolveSupportedCurrency(formData.get('currency'));
  const item = resolveItem(formData, currency);

  if (!item) {
    return redirectWithStatus(request, 'invalid');
  }

  try {
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });
    const origin = getOrigin(request);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'donate',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: toMinorUnits(item.amount, currency),
            product_data: {
              name: item.name,
              description: item.description,
            },
          },
        },
      ],
      metadata: {
        source: 'portfolio-sponsor-page',
        tier: item.tier,
      },
      success_url: `${origin}${SPONSOR_PAGE_PATH}?status=success&session_id={CHECKOUT_SESSION_ID}&currency=${currency}`,
      cancel_url: `${origin}${SPONSOR_PAGE_PATH}?status=cancelled`,
    });

    if (!session.url) {
      console.error('Stripe Checkout session was created without a redirect URL.');
      return redirectWithStatus(request, 'error');
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error('Failed to create a Stripe Checkout session.', error);
    return redirectWithStatus(request, 'error');
  }
}
