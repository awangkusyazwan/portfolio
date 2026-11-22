This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Sponsorship page

The `/sponsor-me` route connects visitors to a Stripe Checkout payment page. Choosing a
tier submits a form to a server route that creates a one-time Checkout Session and
redirects the visitor to Stripe to complete the payment.

### Environment variables

| Variable              | Required | Description                                                                                     |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`   | Yes      | Stripe secret key used to create Checkout Sessions. Live key in production; for dev use `STRIPE_SECRET_KEY_SANDBOX`. |
| `STRIPE_CURRENCY`     | No       | Three-letter ISO currency for sponsorships (`AUD`, `MYR`, `SGD`, or `USD`; defaults to `usd`). |
| `SITE_URL`            | No       | Canonical site origin used for the Stripe success/cancel URLs (defaults to the request origin).  |

For `next dev`, put the sandbox key in `.env.local` (for example, `STRIPE_SECRET_KEY_SANDBOX=sk_test_...`).
For OpenNext/Cloudflare, put the sandbox secret in `.dev.vars` or run
`npx wrangler secret put STRIPE_SECRET_KEY_SANDBOX`.

```bash
# local (next dev)
echo "STRIPE_SECRET_KEY_SANDBOX=sk_test_..." > .env.local

# cloudflare / opennext
npx wrangler secret put STRIPE_SECRET_KEY_SANDBOX
```

Use sandbox keys while developing, and live keys before deploying the payment flow. Production keeps
the `STRIPE_*_KEY` pattern (for example, `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY`), while dev uses
the `STRIPE_*_KEY_SANDBOX` pattern (for example, `STRIPE_SECRET_KEY_SANDBOX` / `STRIPE_PUBLISHABLE_KEY_SANDBOX`).

## Contact form

The `/contact` page posts to `/contact/send`, which validates the submission and sends the
message through [Resend](https://resend.com) to `me+contact-portfolio@awangkusyazwan.my`.
The visitor's address is set as the `reply_to`, so replying goes straight to them. There is
also a hidden honeypot field to cut down on bot submissions.

### Environment variables

| Variable              | Required | Description                                                                                     |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`      | Yes      | Resend API key used to send contact emails.                                                     |
| `CONTACT_FROM_EMAIL`  | No       | Verified sender address, e.g. `Portfolio Contact <no-reply@awangkusyazwan.my>`. Defaults to Resend's `onboarding@resend.dev`, which can only send to the email on your Resend account. |
| `SITE_URL`            | No       | Canonical origin used for the redirect after submitting (defaults to the request origin).        |

For `next dev`, put the key in `.env.local` (`RESEND_API_KEY=re_...`). For Cloudflare/OpenNext,
add `RESEND_API_KEY` as a secret binding (plain or Secrets Store) and, once you have verified
your domain, set `CONTACT_FROM_EMAIL` to an address on it:

```bash
npx wrangler secret put RESEND_API_KEY
# or, with the Secrets Store used by this repo:
npx wrangler secrets-store secret put a17f23808ed3474aa94521d60783be05 RESEND_API_KEY
```

`RESEND_API_KEY` is already bound from the repo's Secrets Store in `wrangler.jsonc`. If you also
store `CONTACT_FROM_EMAIL` there, add a matching entry to `secrets_store_secrets` so the worker
receives it as a binding.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
