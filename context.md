# 🏛 Projekt-Dolakha: System Blueprint & Context

This document serves as the "Source of Truth" for the Dolakha Furniture ecosystem. It maintains the architectural vision, current implementation status, and future roadmap.

---

## 🏗 Infrastructure & Architecture

### **Core Stack**

- **Frontend (`/web`)**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion.
- **CMS (`/sanity-studio`)**: Sanity v3 (Headless), GROQ Queries, Hotspot Image Support.
- **Database & Auth**: Supabase (PostgreSQL + Google OAuth + Facebook Login).
- **Deployment**: Cloudflare Pages (Monorepo setup with OpenNext).

---

## 🔗 Resource Map & Endpoints

### **Production Environments**

- **Main Storefront**: [https://dolakhafurniture.com](https://dolakhafurniture.com)
- **Sanity CMS Dashboard**: [https://dolakhafurniture-sanity.pages.dev](https://dolakhafurniture-cms.pages.dev)
- **Facebook Data Feed**: [https://dolakhafurniture.com/api/feed/facebook](https://dolakhafurniture.com/api/feed/facebook)
- **Supabase Dashboard**: [https://app.supabase.com](https://app.supabase.com)

### **Local Development (Docker)**

- **Command**: gave up docker for local development to save RAM, and using npm run dev now
- **Local Web**: [http://localhost:3000](http://localhost:3000)
- **Local Studio**: [http://localhost:3333](http://localhost:3333)

---

### **Architectural Patterns**

- **Hybrid Data Flow**:
  - **Dynamic Pages**: Critical pages (Campaigns, Price Lists) use `force-dynamic` and `no-store` to ensure real-time inventory and pricing accuracy.
  - **Static Content**: Marketing landing pages and category lists are served via Cloudflare's edge for maximum performance.(Dont know about this, if its still the case, gotta check and verify and understand)
- **Theme Design System: Heritage Atelier (Literal Semantic)**
  - **Philosophy**: "Warm Minimalism" & "Tactile Craftsmanship". A sturdy, grounded aesthetic that mirrors the durability of physical furniture.
  - **Naming**: Literal Intent-based tokens (`bg-app`, `text-heading`, `border-divider`) for robust themeability.
  - **Aesthetic**: Rejection of glassmorphism and transparency in favor of solid surfaces, defined borders, and high-contrast typography.
  - **Typography**: Paired **Cormorant Garamond** (Serif/Poetic) with **Montserrat** (Sans/Architectural).
  - **Alternative Directions**:
    - _Modern Industrial_: Grayscale, sharp black lines, rigid architectural grids.
    - _Nordic Retreat_: Pale woods, soft grays, and rounded, friendly organic shapes.
    - _Lux Boutique_: Deep blacks, gold accents, and ultra-fine, sophisticated lines.

---

## 📈 Implementation Registry

### **✅ Features Implemented**

- **Advanced Product Catalog**:
  - Multiple high-res images with "Show on Web" toggles.
  - Physical specifications (Inches: Length, Breadth, Height) and Material tagging.
- **Campaign Landing System**:
  - Editorial-style landing pages with thematic brand colors.
  - "Promoted Product" grids with broken-reference protection.
- **Professional PDF Engine**:
  - **Download Catalog**: Automated 2x2 grid (4 products per page) with dedicated cover page support.
  - **Master Price List**: Dynamic tabular PDF grouped by category with item thumbnails.
- **Inventory Awareness**:
  - "Stock Out / Made after order" badges using glassmorphism styling.
  - Dynamic CTA buttons ("Order Custom Piece" vs "Inquiry Now").

- **Admin Management Console**:
  - **Orders HUB**: Real-time fulfillment tracking, manual order entry, and secure deletion.
  - **Service Inquiries**: Standardized channel for order tracking, FAQs, and general support.
  - **Artisan Leads CRM**: Sales intelligence pipeline with 'Elevation' workflow, deal status tracking, and priority management.
  - **Inventory Center**: Quick restocking tool, direct price/stock management, and visibility toggles.
  - **Content Central**: High-density dashboard for managing Bulletins and Campaigns.
  - [Detailed Design & Logs](file:///Users/suraj/Developer/dolakha-mac/dolakhafurniture/AdminDashboardFeature.md)
- **Marketing & Catalog Hub**:
  - **Facebook Data Feed**: Automated RSS 2.0 XML feed for Meta Commerce Manager (NPR Currency).
  - **Content Centralization**: Expanding Sanity to hold square/vertical social media graphics and marketing briefs.
- **Campaign Tracking**: Integrating platform-specific traffic monitoring for Instagram, Facebook, and TikTok.

### **💡 Future Concepts**

- **React Native Mobile App**: Leveraging the same Sanity GROQ queries for a native shopping experience.
- **Customer Account Portal**: Personalized dashboards for order tracking and voucher management.
- **B2B Quote Generator**: Allowing bulk buyers to generate custom priced PDFs directly from the dashboard.

- **Meta Business Assets**:
  - **Active Dataset (Pixel)**: `1192490926171504` (Primary tracking for website)
  - **Active Ad Account**: `385134134880141`
  - **Auth Dataset (Legacy)**: `1259206078984085` (Automatically created for FB Login)
  - **Admin Profile**: Using the profile with **no profile picture** (Profile A) for managing the Dolakha Bhimeshwor Furniture business portfolio.

---

## 🛠 Main Upgrade Workflows

### **1. 🎯 Meta Integration & Ads Optimization**

- 📅 **Agenda 1: Advanced Conversion Tracking**: Implement event tracking for high-intent actions (WhatsApp inquiries, PDF downloads).
- 📅 **Agenda 2: Artisan CRM Intelligence**: Implement Lead Status cycles and internal note-taking for high-intent inquiries.
- 📅 **Agenda 3: Meta Messaging Unified Inbox**: Integrate Facebook/Instagram DMs directly into the Artisan CRM dashboard.

### **2. 💎 Website Optimizations & UI/UX Refinements**

---

## 🚀 Important Future Features

- **Offline Conversions Sync (Meta CAPI)**:
  - **Goal**: Perfect attribution for Cash-on-Delivery (COD) orders.
  - **Logic**: A script or webhook that triggers when an order is marked as "Paid/Delivered" in Sanity, sending a final "Purchase" signal to Meta via the Conversions API. This ensures Meta only optimizes for customers who actually handed over the cash.

---

## 📜 Governance & Workflows

### **Deployment Pipeline**

1. **Sanity Deploy**: Content changes trigger a Cloudflare rebuild webhook to refresh the global cache.
2. **Git Workflow**: Code changes mapped to `origin/master` auto-deploy to Cloudflare Pages.
3. **Build Command**: `npx @opennextjs/cloudflare build` (Frontend).

### **Project Logging & History**

1. **DevLogs.md**: Solely maintained by the **Human Developer**. Contains personal notes, high-level decisions, and manual technical logs.
- **AgentLogs.md**: Solely maintained by the **AI Agent**.
   - Every prompt/response cycle must be logged under the **`[prompt/response]`** tag.
   - Significant code changes or features must be logged under the **`[Codebase/Feature Updates]`** tag.
3. **Feature Documentation**: Complex features (like **Admin Dashboard**) have dedicated `.md` files for deep-dive logs and designs.

### **Critical Rules**

1. **Never commit `.env` files.**
2. **Query Management**: All GROQ queries MUST live in `web/src/lib/queries.ts`.
3. **Component Reusability**: Extract logic (like `PriceListTable`) into standalone components to maintain consistency across PDF and Web views.
4. **Copywriting & UI Tone**: Avoid over-the-top buzzwords (e.g., "artisanal", "meticulous", "investment"). Use simple, direct, and helpful language.
5. **Styling Governance**: For any UI or layout changes, developers MUST review and adhere to **[StylingGuide.md](file:///Users/suraj/Developer/dolakha-mac/dolakhafurniture/StylingGuide.md)**. Any new colors or roles must be added there first.

---

## 🕰 Archive: Historical Context (Pre-April 2026)

<!-- The contents below were the context from before April 18, 2026 -->

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
- **Deployment:** Cloudflare Pages (Monorepo setup with separate Projects using OpenNext).

[... Rest of old content preserved ...]
