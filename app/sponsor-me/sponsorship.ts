export type SponsorTier = {
  id: string;
  name: string;
  /** Amount in major units (for example, 5 for $5). Converted per currency. */
  amount: number;
  blurb: string;
};

export const SPONSOR_TIERS = [
  {
    id: 'coffee',
    name: 'Coffee',
    amount: 5,
    blurb: 'A small boost of fuel for the next late-night commit.',
  },
  {
    id: 'lunch',
    name: 'Lunch',
    amount: 25,
    blurb: 'Keeps the side projects and open-source experiments coming.',
  },
  {
    id: 'angel',
    name: 'Angel',
    amount: 100,
    blurb: 'Backs a bigger build — new tools, docs, and things shared freely on my website.',
  },
] as const satisfies readonly SponsorTier[];

export const MIN_CUSTOM_AMOUNT = 1;
export const MAX_CUSTOM_AMOUNT = 500;

export const SUPPORTED_CURRENCIES = ['AUD', 'MYR', 'SGD', 'USD'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value.trim().toUpperCase());
}

/**
 * The default three-letter ISO currency used for sponsorships. Defaults to USD
 * and can be changed with the server-only STRIPE_CURRENCY environment variable.
 */
export function getDefaultCurrency(): SupportedCurrency {
  const configured = process.env.STRIPE_CURRENCY?.trim().toUpperCase();

  return isSupportedCurrency(configured ?? '') ? (configured as SupportedCurrency) : 'USD';
}

/**
 * Resolves a supported currency from an untrusted value (for example, a form
 * field or query parameter) and falls back to the configured default when the
 * value is missing or unsupported.
 */
export function resolveSupportedCurrency(value: unknown): SupportedCurrency {
  const requested = typeof value === 'string' ? value.trim().toUpperCase() : '';

  return isSupportedCurrency(requested) ? requested : getDefaultCurrency();
}

export function getCurrencyFractionDigits(currency: SupportedCurrency = getDefaultCurrency()): number {
  try {
    return (
      new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currency,
      }).resolvedOptions().maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

export function getCurrencySymbol(currency: SupportedCurrency = getDefaultCurrency()): string {
  try {
    const parts = new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
    }).formatToParts(0);

    return parts.find((part) => part.type === 'currency')?.value ?? currency;
  } catch {
    return currency;
  }
}

export function toMinorUnits(amount: number, currency: SupportedCurrency = getDefaultCurrency()): number {
  return Math.round(amount * 10 ** getCurrencyFractionDigits(currency));
}

export function formatAmount(amountInMinorUnits: number, currency: SupportedCurrency = getDefaultCurrency()): string {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amountInMinorUnits / 10 ** getCurrencyFractionDigits(currency));
  } catch {
    return `${amountInMinorUnits} ${currency}`;
  }
}
