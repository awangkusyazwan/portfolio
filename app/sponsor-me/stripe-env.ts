import { getCloudflareContext } from '@opennextjs/cloudflare';

type SecretsStoreAccessor = {
  get: () => Promise<unknown>;
};

type StripeEnv = {
  STRIPE_LIVE_SECRET_KEY?: unknown;
  STRIPE_LIVE_PUBLISHABLE_KEY?: unknown;
};

const readEnvValue = async (value: unknown, processValue?: string): Promise<string | undefined> => {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  // Secrets Store bindings expose the secret through an async accessor,
  // e.g. `await env.STRIPE_LIVE_SECRET_KEY.get()`.
  if (value && typeof (value as SecretsStoreAccessor).get === 'function') {
    const result = await (value as SecretsStoreAccessor).get();

    if (typeof result === 'string') {
      return result.trim() || undefined;
    }
  }

  return processValue?.trim() || undefined;
};

/**
 * Resolves the Stripe keys from the Cloudflare environment (for example, the
 * bindings provided by the Cloudflare Secrets Store) and falls back to
 * `process.env` for local development or other runtimes.
 */
export async function getStripeEnv(): Promise<{
  secretKey?: string;
  publishableKey?: string;
}> {
  let cloudflareEnv: StripeEnv | undefined;

  try {
    cloudflareEnv = getCloudflareContext().env as unknown as StripeEnv;
  } catch {
    cloudflareEnv = undefined;
  }

  const [secretKey, publishableKey] = await Promise.all([
    readEnvValue(cloudflareEnv?.STRIPE_LIVE_SECRET_KEY, process.env.STRIPE_SECRET_KEY),
    readEnvValue(cloudflareEnv?.STRIPE_LIVE_PUBLISHABLE_KEY, process.env.STRIPE_PUBLISHABLE_KEY),
  ]);

  return { secretKey, publishableKey };
}

export async function getStripeSecretKey(): Promise<string | undefined> {
  const env = await getStripeEnv();

  return env.secretKey || undefined;
}
