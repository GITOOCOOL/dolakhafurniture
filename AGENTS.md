# 🤖 AI Agent Instructions: Dolakha Furniture

This project is a monorepo containing a Next.js frontend and a Sanity CMS backend. Follow these instructions strictly to maintain the "Clean Slate" architecture.

## 🎯 Project Vision & Business Goals
- **Core Mission:** Build a high-performance e-commerce ecosystem for **Dolakha Furniture**.
- **Tech Goal:** Master a "Headless" architecture using Next.js (Web) and Sanity (CMS).
- **Mobile Roadmap:** A **React Native** mobile app is planned. All Sanity schemas and GROQ queries should be designed to be shared between Web and Mobile platforms.
- **Marketing Strategy:** This project is a key part of a **Marketing Funnel**. The goal is to build a strong brand presence and learn digital marketing through a tech-savvy approach.
- **Developer Goal:** Become a proficient, tech-forward marketing professional by building and managing this full-stack ecosystem.


## 🛠 Tech Stack & Versions
- **Frontend (`/web`):** Next.js 15.1.6 (App Router), React 19, Tailwind CSS, Zustand (Cart State).
- **Backend (`/sanity-studio`):** Sanity v5.16.0 (Studio V3 framework).
- **Database & Auth:** Supabase (Auth + Redirects), Google OAuth.
- **Deployment:** Vercel (Monorepo setup with separate Projects).

## 📂 Project Structure Snapshot
Refer to `tree.txt` for the full map. Key paths:
- `web/src/app`: File-system routing.
- `web/src/lib/sanity.ts`: Sanity client & image builder.
- `web/src/lib/queries.ts`: All GROQ queries live here.
- `web/src/utils/supabase/`: Client and Server auth logic.
- `sanity-studio/schemaTypes`: Content blueprints.

## 📜 Critical Rules
1. **Never commit `.env` files.** They are ignored by `.gitignore`. Use `npx vercel env pull` to sync.
2. **Path Doubling Prevention:** When using Vercel CLI, always navigate INTO the subfolder (`web` or `sanity-studio`) before running `npx vercel`.
3. **Sanity Schema Updates:** When modifying schemas, ensure the `sanity.config.ts` hardcoded `projectId` (`b6iov2to`) remains intact.
4. **Auth Flow:** Always use the `auth/callback/route.ts` pattern for Supabase + Google Login redirects.
5. **Guest Checkout:** Support a frictionless guest checkout flow. Do not force login to complete an order.

## ⌨️ Common Commands
### Web Frontend
- `cd web && npm run dev` (Localhost:3000)
- `npx vercel env pull .env.local` (Sync keys)
- `npx vercel --prod` (Deploy live)

### Sanity Studio
- `cd sanity-studio && npm run dev` (Localhost:3333)
- `npx vercel --prod` (Deploy admin panel)

## 🎯 Coding Preferences
- Use **TypeScript** for all new files.
- Use **Lucide React** for icons.
- Favor **Functional Components** and Tailwind utility classes.
- Keep GROQ queries inside `web/src/lib/queries.ts` to keep pages clean.

## 📂 Project Architecture & Maps
Refer to these files for a full architectural map:
- **`web/tree.txt` (Frontend):** Detailed map of the Next.js app. Refer here for:
  - **Components:** `src/components/` (ProductCard, NavbarActions, etc.)
  - **Pages:** `src/app/` (Dynamic routes like `category/[slug]` and `product/[slug]`)
  - **Libraries:** `src/lib/` (Sanity client & GROQ queries)
  - **Utilities:** `src/utils/supabase/` (Auth client & server logic)
## 📝 Technical Progress & Roadmap

### ✅ Completed Setup (The "Clean Slate")
- **Monorepo Architecture:** Separated `/web` (Next.js 15) and `/sanity-studio` (Sanity v5.16).
- **Vercel Integration:** Linked folders to independent Vercel projects to prevent "path doubling" errors.
- **Environment Sync:** Established `npx vercel env pull` workflow for local `.env.local` security.
- **Sanity Connection:** Verified local Studio (localhost:3333) pushes data to Sanity Cloud for the Frontend to fetch.
- **Auth Foundation:** Supabase client/server split configured with Google OAuth redirects in Google Console and Supabase Dashboard.
- **State Management:** Zustand implemented for the shopping cart logic (`src/store/useCart.ts`).
- **Hero Carousel:** Implemented an auto-sliding hero carousel in `Hero.tsx` using `framer-motion` for transitions. Features `object-contain` for full image visibility and a blurred background layer for a premium feel.
- **Type Safety Resolution:** Fixed TypeScript import errors for `Bulletin` and `HeroImage` types in the frontend.
- **Unified Authentication UI:** Implemented a reusable `AuthForm` component with Google, Facebook, and Email/Password support. Unified the UI across the `/auth` page and the Account Drawer with a premium Boho aesthetic.
- **Checkout Overhaul:** Implemented a high-performance, 2-column "AIM'N" style checkout flow with Guest checkout support, dynamic QR payments, and post-checkout inquiry modals.

### 🛠 Current Focus (Immediate Next Steps)
1. **Sanity Routing Fix:** Deploy `vercel.json` to `/sanity-studio` to handle Single Page App (SPA) rewrites and prevent 404s on refresh.
2. **CORS Finalization:** Ensure all Vercel Preview URLs are whitelisted in the Sanity Management Dashboard (API > CORS Origins).
3. **SEO & Metadata:** Review `app/product/[slug]/page.tsx` to ensure Sanity data is being injected into Next.js Metadata for better Google ranking.
4. **Mobile Strategy:** Start structuring Sanity schemas to be platform-agnostic for the upcoming **React Native** app.
5. **Checkout Overhaul:** Implement a premium, AIM'N style checkout flow featuring guest support, a 2-column layout, and detailed order summaries.

### 🚀 Future Marketing Goals
- **Funnel Integration:** Implement tracking for user journeys from landing pages to checkout.
- **Brand Consistency:** Ensure Tailwind theme matches the "Dolakha Furniture" brand guidelines across web and (eventually) mobile.

## 🚀 Deployment Readiness Checklist
Before running `npx vercel --prod`, always verify these critical items:
1. **Vercel Env Vars:** Ensure `NEXT_PUBLIC_FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` (if used server-side) are added to Vercel Project Settings.
2. **Meta Privacy Policy:** Facebook Login requires a valid Privacy Policy URL in the App Dashboard to remain active in Live mode.
3. **Supabase Redirects:** 
   - Ensure the "Site URL" is set to the production domain.
   - White-list only production domains (`dolakhafurniture.vercel.app`) and `localhost`. 
   - **Crucial:** Remove any temporary local IP addresses (e.g., `172.x.x.x`) used for mobile testing before going live.
4. **Auth Callback Resilience:** Verify that `auth/callback/route.ts` correctly handles the `next` parameter for post-login redirection.
