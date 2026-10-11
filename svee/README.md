# Svea portfolio & print enquiries

React/Vite portfolio, deployed on Netlify. Eight supplied oil paintings replace the previous painting placeholders; the nine existing illustrations remain. All 17 artworks are shared between galleries and the Prints catalogue.

## Run and verify

```sh
npm ci
npm run check
npm test
npm run build
npm run dev
```

The cart contains only artwork IDs, formats and quantities and is stored in localStorage. Customer details are never persisted in browser storage. Prices in `client/src/data/artworks.ts`: A5 €12, A4 €24, A3 €52. The server independently resolves titles/prices and stores integer cents.

## Deploy and orders

The repository's `netlify.toml` uses `svee` as its base, publishes `client/dist/public`, and builds functions from `netlify/functions`. Netlify detects `@netlify/database` and provisions the database; migrations live in `svee/netlify/database/migrations`. This requires a supported Netlify credit-based plan. Verify migration discovery in deploy logs before enabling enquiries.

`POST /.netlify/functions/orders` validates customer/address data, catalogue items and quantities; saves a request in `orders`; then returns its UUID and total. Failed storage returns 503 and the UI retains the cart. Identical retries reuse the request ID without duplicate orders; altered payloads with a reused ID return 409. Netlify rate limiting, same-origin checks and a honeypot help reduce unwanted requests. There is no public order-list or customer-data endpoint.

View incoming requests privately in Netlify Database's data explorer (`orders`, newest `created_at` first). Shipping and payment details are agreed by email. The request itself is non-binding and triggers no payment.

### Optional owner email notifications

Set these server-only Netlify environment variables (Functions scope):

- `RESEND_API_KEY`: API key for your Resend account.
- `ORDER_EMAIL_FROM`: verified sender address/domain in that account.
- `ORDER_EMAIL_TO`: artist's inbox that should receive enquiries.

An email contains the validated request with the customer's email as Reply-To. Without configuration the request is still saved, with `notification_status = pending`; delivery errors are marked `failed`. There is no automatic resend or customer email. Check pending/failed requests in the database. No API keys are embedded in the client.

On Vercel or plain static hosting this Netlify-specific endpoint is unavailable; use Netlify for the full enquiry flow or implement a corresponding backend before switching hosts.

## Content still needing owner input

- The PDF describes two five-piece book print sets (€12 each). Their five specific images were not supplied/identified; they are not offered as products yet. Their illustration project descriptions have been added.
- The PDF lists additional painting titles and SOLD labels, but does not unambiguously map them to the eight uploaded files. The supplied previous-run titles are retained; no dimensions or sold status were invented. Sami uses the supplied 2026 year.
- Complete imprint, privacy and any sales terms require the artist's verified business/contact information and actual shipping/tax terms. These pages were not fabricated. The enquiry data-processing hint is not a substitute for a privacy policy.
- Confirm that the existing contact email `abarkha@outlook.com` is the artist's intended inbox; it was retained from the repository.
- The Zonta news text comes from the brief. Confirm its October 20 date and calendar year before publishing.

## Deployment acceptance check

1. Open `/prints` and `/kasse` directly in a deploy preview; confirm all 17 images load.
2. Add two formats, change quantities, reload and confirm the cart persists.
3. Submit a clearly labelled test enquiry in the isolated preview database. Verify stored customer data, authoritative prices and request ID. No online payment occurs.
4. Simulate a failed request and verify the cart remains and no success receipt appears.
5. Configure and test owner notifications separately; verify `notification_status`.
6. Review artwork title mappings and complete legal/contact information before public shop launch.

Local validation: production build, TypeScript check and automated tests for validation, server-side prices, cart restoration, persistence failures, idempotency and notification failure handling. No live database or email request was sent during development.

The local sandbox reported all 18 individual test cases as passing, but the Vitest process did not finish shutting down. Re-run `npm test` in CI or a normal development environment before merge. Browser launch was unavailable in this sandbox, so visual and live deployment acceptance checks above remain required.
