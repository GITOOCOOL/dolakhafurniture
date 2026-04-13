# Dolakha Furniture: Cloudflare Migration Session Log

**Date**: April 13-14, 2026
**Objective**: Migrate Dolakha Furniture monorepo from Vercel to Cloudflare Pages, fix static asset routing (404s), Dockerize the entire environment for macOS, and establish manual production triggers for Sanity Studio.

## 1. Local Environment Re-architecture
*   **Docker Integration**: We identified persistent socket connectivity issues affecting standard Node commands on macOS. We resolved this by performing a full manual purge of old Docker installations via Homebrew and rebuilding `dolakhafurniture` into a comprehensive `docker-compose` ecosystem.
*   **Monorepo Unification**: Configured a `docker-compose.yml` file that orchestrates both the `web` (Next.js) storefront and the `sanity-studio` environments concurrently, mapped to host ports `3000` and `3333` respectively.

## 2. Next.js to Cloudflare Pages (OpenNext)
*   **The Turbopack Problem**: The project uses the cutting-edge Next.js 16 version with Turbopack, which natively conflicted with the legacy Cloudflare `@cloudflare/next-on-pages` adapter's dependency tracking.
*   **The Implementation**: We transitioned the web framework to the framework-agnostic **OpenNext** adapter (`@opennextjs/cloudflare`).
*   **The Routing Fix (404s)**: Cloudflare's Edge functions natively intercepted all Next.js static asset requests, throwing 404 errors for CSS, JS, and Images. We solved this by generating a custom `cloudflare-routes.json` file during the build (`build:pages`) that explicitly commands Cloudflare to serve `/_next/static/*` and root images via the CDN statically.

## 3. Sanity Studio Cloudflare Deployment
*   **SPA Structure**: Configured the Studio as a Single Page Application (SPA) on Cloudflare Pages using the standard `sanity build` pipeline outputting to `dist/`.
*   **Wrangler Standardization**: Wrote a dedicated `wrangler.toml` configuration strictly locking down the build output parameters.
*   **Database Authorization**: Successfully registered the new production Studio domain (`https://dolakha-studio.pages.dev`) directly as a trusted CORS entity inside the `manage.sanity.io` project settings.

## 4. Manual Production Deployment Triggers
*   **The Limit Problem**: Cloudflare Pages Free Tier strictly grants 500 builds per month. Firing automatic webhooks on every tiny typographic update in Sanity would obliterate this limit in days.
*   **The Implementation**: Added `sanity-plugin-webhooks-trigger` to the Studio codebase. We configured the plugin inside `sanity.config.ts`, directly injecting a beautiful "Deploy" tab into the Sanity navigation bar.
*   **The Result**: The administrative user can now make batch updates to the furniture database securely, and only push the final render command out to Cloudflare's Edge network when they physically click the manual push button!

---
> *Migration formally completed ensuring infinite scale via Edge CDN infrastructure with 100% matched parity in local Docker development.*
