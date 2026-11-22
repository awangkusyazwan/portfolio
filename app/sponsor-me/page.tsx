import type { Metadata } from 'next';
import { LottieAnimation } from '../components/lottie-animation';
import { Navbar } from '../components/navbar';
import { SponsorTiers } from '../components/sponsor-tiers';
import { getStripeSecretKey } from './stripe-env';
import { SUPPORTED_CURRENCIES, getDefaultCurrency, isSupportedCurrency } from './sponsorship';

export const metadata: Metadata = {
  title: "Sponsor Me | Syazwan's Portfolio",
  description: 'Support my work with a one-time sponsorship through Stripe.',
};

const statusMessages = {
  success: {
    tone: 'success',
    title: 'Thank you for sponsoring!',
    body: 'Your payment went through. Your support genuinely helps keep the projects moving.',
  },
  cancelled: {
    tone: 'neutral',
    title: 'Checkout cancelled',
    body: 'No charge was made. Pick a tier again whenever you are ready.',
  },
  invalid: {
    tone: 'error',
    title: "That amount didn't look right",
    body: 'Choose a tier or enter a custom amount within the allowed range.',
  },
  unavailable: {
    tone: 'warning',
    title: "Sponsorship isn't available right now",
    body: 'The payment page is not configured yet. Please check back soon.',
  },
  error: {
    tone: 'error',
    title: "The checkout couldn't start",
    body: 'Something went wrong while opening Stripe. Please try again in a moment.',
  },
} as const;

type StatusKey = keyof typeof statusMessages;

const bannerToneClasses = {
  success:
    'border-teal-600/25 bg-teal-500/10 text-teal-950 dark:border-teal-300/25 dark:bg-teal-400/10 dark:text-teal-50',
  neutral:
    'border-slate-900/10 bg-white/60 text-slate-800 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200',
  warning:
    'border-amber-600/25 bg-amber-500/10 text-amber-950 dark:border-amber-300/25 dark:bg-amber-400/10 dark:text-amber-50',
  error:
    'border-rose-600/25 bg-rose-500/10 text-rose-950 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-50',
} as const;

type SponsorMePageProps = {
  searchParams: Promise<{ status?: string | string[]; currency?: string | string[] }>;
};

function isStatusKey(value: string): value is StatusKey {
  return value in statusMessages;
}

function resolveCurrency(value: string | string[] | undefined): (typeof SUPPORTED_CURRENCIES)[number] {
  const requested = typeof value === 'string' ? value.trim().toUpperCase() : '';

  return isSupportedCurrency(requested) ? requested : getDefaultCurrency();
}

function StatusBanner({ status }: { status: StatusKey }) {
  const message = statusMessages[status];

  return (
    <div
      role={message.tone === 'error' ? 'alert' : 'status'}
      className={`rounded-2xl border px-5 py-4 backdrop-blur-xl ${bannerToneClasses[message.tone]}`}
    >
      <p className="text-sm font-bold">{message.title}</p>
      <p className="mt-1 text-sm leading-relaxed opacity-80">{message.body}</p>
    </div>
  );
}

export default async function SponsorMePage({ searchParams }: SponsorMePageProps) {
  const { status: rawStatus, currency: rawCurrency } = await searchParams;
  const status = typeof rawStatus === 'string' && isStatusKey(rawStatus) ? rawStatus : null;
  const currency = resolveCurrency(
    typeof rawCurrency === 'string' ? rawCurrency : Array.isArray(rawCurrency) ? rawCurrency[0] : undefined,
  );
  const configured = Boolean(await getStripeSecretKey());

  return (
    <main className="relative flex min-h-svh w-full flex-col overflow-x-clip bg-background px-6 py-6 text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <Navbar />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <section aria-label="Sponsor me" className="flex flex-1 flex-col gap-8 sm:gap-10">
          <div className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between sm:gap-8 lg:gap-12">
            <div className="w-full max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Sponsor
              </p>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Keep the{' '}
                <span className="bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-400">
                  projects shipping
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                I build and share software in the open. If something here has been useful, a
                one-time sponsorship helps me keep experimenting, coding, and shipping new stuff.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="rounded-full border border-slate-900/10 bg-white/50 px-3 py-1 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/30">
                  One-time payment only
                </span>
                <span className="rounded-full border border-slate-900/10 bg-white/50 px-3 py-1 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/30">
                  No periodic subscription model
                </span>
                <span className="rounded-full border border-slate-900/10 bg-white/50 px-3 py-1 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/30">
                  Secure checkout, handled by Stripe
                </span>
              </div>
            </div>

            <div className="w-32 shrink-0 sm:w-44 lg:w-64">
              <LottieAnimation src="/lottie/sponsor.json" className="aspect-square w-full" />
            </div>
          </div>

          {status && <StatusBanner status={status} />}
          {!configured && !status && <StatusBanner status="unavailable" />}

          <SponsorTiers currency={currency} configured={configured} />

          <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            You will be redirected to Stripe to complete your sponsorship. No account is
            required.
          </p>
        </section>
      </div>
    </main>
  );
}
