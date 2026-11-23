# Dolakha Furniture website

Furniture shop site for Dolakha Furniture (dolakhafurniture.com). Owner is relearning the codebase:
go slowly, explain before changing, one topic per session.

## Rules
- Never push `master` without the owner's OK: a push to `master` deploys the live site.
- Work on a branch (current: `fixes`). Pushing a branch only makes preview builds.
- Sanity edits (Studio or API) are live immediately, no deploy step. Don't write to Sanity without asking.
- `web/.env.local` holds live keys (pulled from Vercel). Never read, print or commit it.
- Big files: read only the lines you need (search first). `CheckoutDrawer.tsx` is 1,788 lines.

## Pieces
- `web/`: Next.js 16 / React 19 / Tailwind 4 site. Dev: `cd web && npm run dev -- -p 3005`.
- Sanity (project `b6iov2to`, dataset `production`): the main database. Products, categories, campaigns,
  and also orders, inquiries, leads, vouchers, payment accounts. Schemas in `sanity-studio/schemaTypes/`.
- `sanity-studio/`: the owner's editing app for that data.
- Supabase: login only. `profiles` (role: customer/staff/admin) and `traffic_pulse`. `web/middleware.ts`
  sends non-staff away from `/admin`.
- `mobile/`: empty stub. `web/migrations/`: one-off catalog import scripts, not part of the running site.

## How it fits
- No business names in code ("white-label"): name, tagline, phone, WhatsApp, links, Pixel ID all come from
  the Sanity `businessMetaData` document. Missing fields show `undefined_setmetadata_in_studio` on purpose.
- Checkout and inquiry forms are server actions in `web/src/app/actions/` that create Sanity documents.
- Sanity is fetched with no cache (`web/src/lib/sanity.ts`, `useCdn: false`, `no-store`): edits show
  instantly, pages are slower.

## Hosting
- Live: Cloudflare Pages (`dolakhafurniture`, built with `npm run build:pages`; config `web/wrangler.toml`).
  DNS is on Cloudflare.
- Vercel also builds every push (`dolakhafurniture`, `dolakhafurniture-cms`) but the domain doesn't point
  there; likely to be turned off.
- Cloudflare builds `dolakhafurniture-sanity` and "Workers Builds: dolakhafurniture" fail on every push
  (leftovers).

## Owner facts
- WhatsApp is the owner's Australian number, on purpose.
- Brand is "Dolakha Furniture". Sanity `businessMetaData` still says "Shop Now Nepal" from a planned
  company move (2026); owner to change it in Studio.

## Open work
See `NowWorking.md`. Next: a guided tour of `web/`, then spam protection for forms and env-var guards.
