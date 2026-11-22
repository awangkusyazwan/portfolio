import { NextResponse } from 'next/server';
import { getResendConfig } from '../resend-env';

const CONTACT_PAGE_PATH = '/contact';
const RECIPIENT_EMAIL = 'me+contact-portfolio@awangkusyazwan.my';
const DEFAULT_FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

const FIELD_LIMITS = {
  name: 200,
  email: 320,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getOrigin(request: Request): string {
  const configured = process.env.SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  return new URL(request.url).origin;
}

function redirectWithStatus(request: Request, status: string) {
  const url = new URL(CONTACT_PAGE_PATH, getOrigin(request));
  url.searchParams.set('status', status);

  return NextResponse.redirect(url, 303);
}

function readField(formData: FormData, key: keyof typeof FIELD_LIMITS): string | null {
  const value = formData.get(key);

  if (typeof value !== 'string') return null;

  const trimmed = value.trim();

  if (!trimmed || trimmed.length > FIELD_LIMITS[key]) return null;

  return trimmed;
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return redirectWithStatus(request, 'invalid');
  }

  // Honeypot: real visitors never fill this hidden field. Respond as if the
  // message were sent so bots get no signal that they were caught.
  const honeypot = formData.get('company');
  if (typeof honeypot === 'string' && honeypot.trim()) {
    return redirectWithStatus(request, 'success');
  }

  const name = readField(formData, 'name');
  const email = readField(formData, 'email');
  const message = readField(formData, 'message');

  if (!name || !email || !message || !EMAIL_PATTERN.test(email)) {
    return redirectWithStatus(request, 'invalid');
  }

  const { apiKey, fromEmail } = await getResendConfig();

  if (!apiKey) {
    console.error('Contact form is unavailable: RESEND_API_KEY is not set.');
    return redirectWithStatus(request, 'unavailable');
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail ?? DEFAULT_FROM_EMAIL,
        to: [RECIPIENT_EMAIL],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`Resend rejected the contact email (status ${response.status}).`);
      return redirectWithStatus(request, 'error');
    }

    return redirectWithStatus(request, 'success');
  } catch (error) {
    console.error('Failed to send the contact email.', error);
    return redirectWithStatus(request, 'error');
  }
}
