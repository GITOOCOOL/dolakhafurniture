# 🏛 Projekt-Dolakha: System Blueprint & Context

This document serves as the "Source of Truth" for the Dolakha Furniture ecosystem. It maintains the architectural vision, current implementation status, and future roadmap.

---

## 🏗 Infrastructure & Architecture

### **Core Stack**

- **Frontend (`/web`)**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion.
- **CMS (`/sanity-studio`)**: Sanity v3 (Headless), GROQ Queries, Hotspot Image Support.
- **Database & Auth**: Supabase (PostgreSQL + Google OAuth).
- **Deployment**: Cloudflare Pages (Monorepo setup with OpenNext).

---

## 🔗 Resource Map & Endpoints

### **Production Environments**

- **Main Storefront**: [https://dolakhafurniture.com](https://dolakhafurniture.com)
- **Sanity CMS Dashboard**: [https://dolakhafurniture.pages.dev](https://dolakhafurniture.pages.dev)
- **Facebook Data Feed**: [https://dolakhafurniture.com/api/feed/facebook](https://dolakhafurniture.com/api/feed/facebook)
- **Supabase Dashboard**: [https://app.supabase.com](https://app.supabase.com)

### **Local Development (Docker)**

- **Command**: `docker-compose up` (Starts both Web and Studio)
- **Local Web**: [http://localhost:3000](http://localhost:3000)
- **Local Studio**: [http://localhost:3333](http://localhost:3333)

---

### **Architectural Patterns**

- **Hybrid Data Flow**:
  - **Dynamic Pages**: Critical pages (Campaigns, Price Lists) use `force-dynamic` and `no-store` to ensure real-time inventory and pricing accuracy.
  - **Static Content**: Marketing landing pages and category lists are served via Cloudflare's edge for maximum performance.
- **Design System: Glassmorphism / Boho-Premium**:
  - Custom tailored HSL color palettes (Espresso, Bone, Terracotta).
  - Heavy use of backdrop-blur and organic rounded corners.
- **Shared Schemas**: Content blueprints are designed to be shared between the current Web platform and the upcoming Mobile application.

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

### **🚧 In Development**

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

### **Critical Rules**

1. **Never commit `.env` files.**
2. **Query Management**: All GROQ queries MUST live in `web/src/lib/queries.ts`.
3. **Component Reusability**: Extract logic (like `PriceListTable`) into standalone components to maintain consistency across PDF and Web views.
4. **Copywriting & UI Tone**: Avoid over-the-top buzzwords (e.g., "artisanal", "meticulous", "investment"). Use simple, direct, and helpful language.

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
