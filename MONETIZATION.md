# VisaSnap Monetization

VisaSnap is ready for three static-site monetization paths. Edit `monetization.js`, then redeploy with Netlify.

## Stripe Payment Link

Use this for a simple support, donation, or Pro purchase button.

1. Create a Stripe Payment Link in the Stripe Dashboard.
2. Copy the live `https://buy.stripe.com/...` URL.
3. Paste it into `stripePaymentLink` in `monetization.js`.
4. Update `stripeLabel` and `proFeatures`.

Stripe Payment Links are hosted by Stripe and do not require backend code.

## Sponsored or Affiliate Links

Add partner links to the `offers` array:

```js
offers: [
  {
    label: "Partner",
    title: "Travel insurance",
    description: "Compare policies before your visa appointment.",
    url: "https://example.com/your-affiliate-link"
  }
]
```

Use `rel="sponsored"` links and keep the visible disclosure. Only add links for programs you are approved to promote.

## Google AdSense

After AdSense approval, set:

```js
adsense: {
  client: "ca-pub-0000000000000000",
  slot: "0000000000"
}
```

Do not enable AdSense before approval. Google reviews site quality, ownership, policies, and age eligibility.

## Redeploy

```bash
npm run check
npx --yes netlify-cli deploy --prod --dir .
```
