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
| `STRIPE_SECRET_KEY`   | Yes      | Stripe secret key used to create Checkout Sessions. Set a test key (e.g. `sk_test_...`) for dev. |
| `STRIPE_CURRENCY`     | No       | Three-letter ISO currency for sponsorships (`AUD`, `MYR`, `SGD`, or `USD`; defaults to `usd`). |
| `SITE_URL`            | No       | Canonical site origin used for the Stripe success/cancel URLs (defaults to the request origin).  |

For `next dev`, put `STRIPE_SECRET_KEY` in `.env.local`. For OpenNext/Cloudflare, put it in
`.dev.vars` or run `npx wrangler secret put STRIPE_SECRET_KEY`.

```bash
# local (next dev)
echo "STRIPE_SECRET_KEY=sk_test_..." > .env.local

# cloudflare / opennext
npx wrangler secret put STRIPE_SECRET_KEY
```

Use Stripe test keys while developing, and live keys before deploying the payment flow.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
