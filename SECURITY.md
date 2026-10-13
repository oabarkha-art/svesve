# Security hardening — 2026-10-13

## Implemented

- Vercel response headers enforce a Content Security Policy (self-hosted scripts, specific Supabase API origin, no objects, no framing or base-URL injection), nosniff, strict-origin referrers, disabled camera/microphone/location/payment APIs, and same-origin opener isolation. Inline styles are retained for the React/Radix UI; inline scripts and eval are not allowed. Admin HTML is no-store and noindex. HTTPS/HSTS is supplied by Vercel.
- Supabase RLS restricts editing, storage uploads and customer orders to confirmed, allowlisted admin users. The privileged lookup now checks an existing, unexpired Auth session and bans. A verified MFA factor requires both the JWT and stored session to be AAL2; revoked sessions immediately lose data access.
- `/admin` offers authenticator-app enrollment and challenges. Enrollment requires the owner to scan/retain the setup key and verify a current code; no factor has been enabled on the owner's behalf. Lost-device recovery is through the owner's Supabase dashboard. Secrets are only shown locally during enrollment and are not persisted by this UI.
- Orders continue to validate and recalculate prices server-side, enforce idempotency, restrict CORS, and rate limit IP/email. Bodies are now read incrementally with a 32 KiB ceiling rather than fully buffered before validation. The previously unconnected custom-domain origins were removed; add only verified domains when connecting them.
- Removed unused streamdown and typography dependencies; upgraded Vite, React plugin and Vitest to patched versions. Removed optional legacy debug plugins. Dev/preview servers bind to loopback by default.

## Verification

- `npm audit` (all dependencies): zero reported vulnerabilities at verification time.
- `npm run check`, production build: pass.
- Vitest: 8 files, 31 tests, clean exit 0. The old shutdown hang is resolved by the updated tooling.
- Live order regression: server pricing, persistence, identical retry, conflicting retry, unknown artwork, anonymous read/write denial. Test order deleted.
- SQL role regression: even an allowlisted user with an AAL2 claim but no matching Auth session cannot administer or read orders. The query rolled back.
- An attempted transaction-only Auth/MFA fixture test returned a connector request-state error; no fixture remained (zero sessions/factors). Actual positive login/enrollment must be verified by the owner using their password and authenticator. UI enrollment/challenge behavior is covered by tests.

## Remaining / limits

- The owner must enable two-factor authentication in `/admin` to gain its protection. Before enrollment, a valid password session remains accepted.
- Supabase's leaked-password screening is disabled and requires Pro or above. No paid upgrade was made. Use a strong, unique password and protect both hosting-provider accounts with MFA.
- The two RLS-without-policy informational notices are deliberate default-deny server-only tables (`private.admin_emails`, `order_rate_limits`).
- Rate limits are basic abuse protection, not a CAPTCHA or a DDoS guarantee. Public guest order requests remain intentionally available. This work is targeted hardening and verification, not an independent penetration test or a guarantee against all attacks.
- CSP allows HTTPS images because the content editor supports external image URLs. New API/script providers require deliberate CSP changes.
