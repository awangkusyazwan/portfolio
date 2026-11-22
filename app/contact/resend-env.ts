import { getCloudflareContext } from '@opennextjs/cloudflare';

type SecretsStoreAccessor = {
  get: () => Promise<unknown>;
};

type ResendEnv = {
  RESEND_API_KEY?: unknown;
  CONTACT_FROM_EMAIL?: unknown;
};

async function readEnvValue(value: unknown, processValue?: string): Promise<string | undefined> {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  // Secrets Store bindings expose the secret through an async accessor,
  // e.g. `await env.RESEND_API_KEY.get()`.
  if (value && typeof (value as SecretsStoreAccessor).get === 'function') {
    const result = await (value as SecretsStoreAccessor).get();

    if (typeof result === 'string') {
      return result.trim() || undefined;
    }
  }

  return processValue?.trim() || undefined;
}

/**
 * Resolves the Resend credentials from the Cloudflare environment (including
 * Secrets Store bindings) and falls back to `process.env` for local development.
 */
export async function getResendConfig(): Promise<{ apiKey?: string; fromEmail?: string }> {
  let cloudflareEnv: ResendEnv | undefined;

  try {
    cloudflareEnv = getCloudflareContext().env as unknown as ResendEnv;
  } catch {
    cloudflareEnv = undefined;
  }

  return {
    apiKey: await readEnvValue(cloudflareEnv?.RESEND_API_KEY, process.env.RESEND_API_KEY),
    fromEmail: await readEnvValue(cloudflareEnv?.CONTACT_FROM_EMAIL, process.env.CONTACT_FROM_EMAIL),
  };
}
