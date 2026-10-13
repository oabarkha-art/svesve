# Portfolio backend

Production: Supabase project `fotvltwehrujlkfvoses` (Frankfurt), Vercel project `svesve`.

The public site reads published `artworks` and `print_prices` from Supabase. `/admin` uses Supabase Auth and database-enforced access rules for editing artwork metadata, uploading JPG/PNG/WebP images, changing print prices, and reviewing/updating order requests. Hide an artwork by clearing Published; original painting Sold does not disable print sales.

## First administrator

In Supabase Dashboard > Authentication > Users > Add user > Create new user, create a password account for `svea.fritzenkoetter00@gmail.com` or `oabarkha@gmail.com`. Use Auto Confirm only when creating these known owner accounts directly in the trusted dashboard. Set the password privately, then sign in at `/admin`. The database checks the current Auth user, confirmed email, and private allowlist. Client-controlled user metadata never grants access. Ordinary signed-in users cannot edit works or read orders.

## Environment

Vercel variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_ORDER_ANON_KEY` (legacy public anon JWT used only by the JWT-verifying guest order endpoint). No service-role key is shipped to the browser. The `orders` Edge Function uses its platform-provided server-side Supabase credentials. Deploy with JWT verification enabled.

Orders POST to `/functions/v1/orders` on the Supabase URL. It validates input, obtains current artwork titles and prices from the database, persists the request, enforces idempotency, and rate limits requests. Requests are non-binding and no online payment occurs. Customer details have no anonymous Data API access. Test requests have been removed after verification.

Email notifications are **not activated**. All requests are visible in `/admin`; `notification_status=pending` does not imply that mail was sent. Connect a transactional email provider and verified sender before enabling notification delivery. The old Netlify function is retained for history but is no longer called by the Vercel frontend.

## Schema and seeds

`schema/portfolio.sql` records the migration applied through the Supabase connector. The local Supabase CLI crashed in this environment, so no fabricated migration version is checked in. Use Supabase migration history / `db pull` to sync on a working CLI. `seed.json` records the original 25 works; it is initialization data, not an ongoing sync source. Do not overwrite future admin changes with the seed.

The security advisor reports two informational no-policy notices: `private.admin_emails` and `order_rate_limits` intentionally deny browser access and are only read through the restricted admin lookup / server role. No security warnings or errors were reported at setup.

## Verification

- TypeScript check and production build succeed.
- 21 existing/updated Vitest cases pass individually; this environment hangs during Vitest shutdown and the bounded test command exits 124.
- Live API checks: 25 public works, anonymous read/write denial, persistence with server prices, idempotent retry, conflicting retry rejection, unknown artwork rejection.
- Authenticated unapproved-role SQL check confirms no admin privileges or artwork updates.
- First real admin login/upload must be checked after the owner creates their account.

## Full website content management

`site_content` stores the 109 active German/English text, homepage-image and contact/link fields. `books` stores the three initial books/series, bilingual descriptions, cover, up to four preview images, visibility and ordering. Both are protected by the existing admin allowlist and RLS. The admin page adds searchable text editing, image replacement, contact/link editing, and book creation/editing/hiding. Text is rendered as plain React text, never HTML. Executable image/link URLs are rejected; existing templates retain their placeholders.

The initial fallback is in `client/src/data/siteContent.ts`; once loaded, database values drive the public pages. Admin saves reload the content without rebuilding/deploying. Existing open tabs refresh on window focus or page reload. Artist titles, dimensions, descriptions and pictures remain in the artwork editor. The fixed layout and icon designs are still code, not content fields.

Verification: four new content tests pass (live-data rendering, English switch, book previews, placeholder/blank values, unsafe URL checks); existing 21 cases pass. The sandbox still hangs at Vitest shutdown, so bounded runs exit 124. TypeScript/build pass. SQL role checks verify confirmed-admin writes and non-admin denial with all test writes rolled back. The latest advisor additionally flags the project's disabled leaked-password protection setting; this is an Auth platform setting, not a new table/RLS finding: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
