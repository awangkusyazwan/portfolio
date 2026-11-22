'use client';

import { useMemo, useState } from 'react';
import {
  MAX_CUSTOM_AMOUNT,
  MIN_CUSTOM_AMOUNT,
  SPONSOR_TIERS,
  SUPPORTED_CURRENCIES,
  formatAmount,
  getCurrencySymbol,
  toMinorUnits,
  type SupportedCurrency,
} from '../sponsor-me/sponsorship';

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="none"
    className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300"
  >
    <path
      d="m4 10.5 4 4 8-9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const supportItems = [
  'Hosting, domains, and the services that keep projects alive.',
  'Tools and experiments that might become the next useful thing.',
  'More time for open-source work, docs, and write-ups.',
];

type SponsorTiersProps = {
  currency: SupportedCurrency;
  configured: boolean;
};

export function SponsorTiers({ currency: initialCurrency, configured }: SponsorTiersProps) {
  const [currency, setCurrency] = useState<SupportedCurrency>(initialCurrency);
  const [lastPropCurrency, setLastPropCurrency] = useState<SupportedCurrency>(initialCurrency);

  // Keep local currency changes while still following server-driven updates
  // (for example, a `?currency=` link or status redirect) that change the prop.
  if (initialCurrency !== lastPropCurrency) {
    setLastPropCurrency(initialCurrency);
    setCurrency(initialCurrency);
  }

  const prices = useMemo(() => {
    const entries = new Map<string, string>();

    for (const tier of SPONSOR_TIERS) {
      entries.set(tier.id, formatAmount(toMinorUnits(tier.amount, currency), currency));
    }

    return entries;
  }, [currency]);

  const minAmount = useMemo(
    () => formatAmount(toMinorUnits(MIN_CUSTOM_AMOUNT, currency), currency),
    [currency],
  );
  const maxAmount = useMemo(
    () => formatAmount(toMinorUnits(MAX_CUSTOM_AMOUNT, currency), currency),
    [currency],
  );
  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const selectCurrency = (next: SupportedCurrency) => setCurrency(next);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
          Pay with
        </span>
        {SUPPORTED_CURRENCIES.map((supported) => {
          const active = supported === currency;

          return (
            <button
              key={supported}
              type="button"
              onClick={() => selectCurrency(supported)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 dark:focus-visible:ring-teal-300 ${active
                ? 'border-teal-600/40 bg-teal-600/10 text-teal-700 dark:border-teal-300/40 dark:bg-teal-400/10 dark:text-teal-300'
                : 'border-slate-900/10 bg-white/50 text-slate-600 hover:border-teal-600/30 hover:text-teal-700 dark:border-white/10 dark:bg-slate-900/30 dark:text-slate-300 dark:hover:border-teal-300/30 dark:hover:text-teal-300'
                }`}
            >
              {supported}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SPONSOR_TIERS.map((tier, index) => {
          const price = prices.get(tier.id) ?? '';
          const featured = index === 1;

          return (
            <form
              key={tier.id}
              action="/sponsor-me/checkout"
              method="post"
              className={`flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-colors duration-300 ${featured
                ? 'border-teal-600/30 bg-white/70 shadow-[0_18px_40px_-30px_rgba(13,148,136,0.55)] dark:border-teal-300/25 dark:bg-slate-900/50'
                : 'border-slate-900/10 bg-white/50 hover:border-teal-600/25 dark:border-white/10 dark:bg-slate-900/30 dark:hover:border-teal-300/20'
                }`}
            >
              <input type="hidden" name="tier" value={tier.id} />
              <input type="hidden" name="currency" value={currency} />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                    0{index + 1}
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight">{tier.name}</h2>
                </div>
                <span className="text-m font-black tracking-tight text-teal-700 dark:text-teal-300">
                  {price}
                </span>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {tier.blurb}
              </p>

              <button
                type="submit"
                disabled={!configured}
                className="liquid-cta mt-6 flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 dark:focus-visible:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-950"
              >
                <span className="relative z-10">Sponsor {price}</span>
              </button>
            </form>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          action="/sponsor-me/checkout"
          method="post"
          className="rounded-2xl border border-slate-900/10 bg-white/50 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/30"
        >
          <h2 className="text-xl font-bold tracking-tight">Choose your own amount</h2>
          <p
            id="custom-amount-help"
            className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            One-time only, no subscription. Any amount from {minAmount} to {maxAmount}.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="currency" value={currency} />
            <div className="flex h-12 min-w-0 flex-1 items-center rounded-full border border-slate-900/15 bg-white/70 transition-colors focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700 dark:border-white/10 dark:bg-slate-950/40 dark:focus-within:border-teal-300 dark:focus-within:ring-teal-300">
              <label htmlFor="sponsor-amount" className="sr-only">
                Custom sponsorship amount
              </label>
              <span
                aria-hidden="true"
                className="pl-4 pr-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
              >
                {currencySymbol}
              </span>
              <input
                id="sponsor-amount"
                name="amount"
                type="number"
                required
                min={MIN_CUSTOM_AMOUNT}
                max={MAX_CUSTOM_AMOUNT}
                step="0.01"
                inputMode="decimal"
                placeholder="25"
                aria-describedby="custom-amount-help"
                className="h-full min-w-0 flex-1 bg-transparent pr-2 text-base font-semibold outline-none placeholder:text-slate-600 dark:placeholder:text-slate-400"
              />
              <span
                aria-hidden="true"
                className="pr-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400"
              >
                {currency}
              </span>
            </div>

            <button
              type="submit"
              disabled={!configured}
              className="liquid-cta flex h-12 items-center justify-center rounded-full px-6 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 dark:focus-visible:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-950"
            >
              <span className="relative z-10">Continue to Stripe</span>
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border border-dashed border-slate-900/15 bg-white/40 p-6 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/25">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            What your support funds
          </p>
          <ul className="mt-4 space-y-3">
            {supportItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
              >
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-slate-900/10 pt-4 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:text-slate-400">
            Payments are handled by Stripe. I never see your card details, only that you sponsored me.
          </p>
        </aside>
      </div>
    </>
  );
}
