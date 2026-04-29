# 🤖 AgentLogs: Projekt-Dolakha

This file tracks the operational history of the AI assistant for Projekt-Dolakha.

---

## 📜 Logging Protocol
- **[prompt/response]**: Logged for every interaction cycle.
- **[Codebase/Feature Updates]**: Logged for every significant code change or feature implementation.

---

## 📅 2026-04-20

- **[prompt/response]**: Formally integrated the Logging & Project History protocol into the `context.md` under the Governance section. Ensuring that both `DevLogs.md` and `AgentLogs.md` are established as top-level project artifacts.
- **[Codebase/Feature Updates]**: Updated `context.md` Governance section to include formal logging protocols.

## 📅 2026-04-21

- **[prompt/response]**: Received greeting from user. Initialized context by reading `context.md` and `AgentLogs.md`. Ready for new tasks.
- **[Codebase/Feature Updates]**: Finalized the `FloatingContact` widget alignment and theme tokens. Addressed a secondary runtime crash in `ProductDetail.tsx` by strictly filtering for valid image assets, and resolved a persistent `.next/dev/lock` issue. Created an automated Sanity cleanup script (`delete-old-orders.ts`) to safely manage historical data.

## 📅 2026-04-22

- **[prompt/response]**: Stabilized the Artisan Dashboard registries and storefront following multiple runtime crashes.
- **[Codebase/Feature Updates]**: 
    - **Artisan Stabilization**: Implemented defensive null-checks in `AdminOrdersClient.tsx` to handle legacy malformed records.
    - **Registry Hardening**: Wrapped the `AdminUsersPage` in a full `try/catch` with environment variable guards to prevent server-side crashes when `SUPABASE_SERVICE_ROLE_KEY` is missing.
    - **Build Regression Fix**: Identified a critical `ReferenceError: __name is not defined` on the storefront caused by a recent `@opennextjs/cloudflare` patch update. Resolved by **pinning** the version to `1.19.1` strictly in `package.json`.
    - **Documentation**: Created `__nameBug.md` to archive the details of the OpenNext build pipeline failure and established version pinning as a project mandate.

## 📅 2026-04-24 / 04-25
- **[prompt/response]**: Hardened the Multimodal Content Engine and automated the global 24/7 broadcast heartbeat. Resolved critical Meta API 403 authorization blockers and Story Circle placement issues.
- **[Codebase/Feature Updates]**: 
    - **Multimodal Engine (v4.1)**: Rewrote the Facebook and Instagram engines to autonomously detect and handle **Photo** and **Video** assets. 📸🎞️
    - **Story Circle Protocol**: Implemented a specialized **Two-Step Shadow Upload** (Invisible Upload -> Story Publish) to bypass Facebook Feed limitations and land direct hits on the 24-hour Story Circle. ⭕🚀
    - **Cloud Sovereignty (Bot v6.1)**: Migrated the Heartbeat Bot from local Node.js to **GitHub Actions** (`cron: '*/5 * * * *'`), achieving total 24/7 technical independence from local hardware. 🛰️🏙️
    - **Sanity UI Hardening**: 
        - Integrated a `mediaType` selector for contextual asset switching.
        - Synchronized **Target Injected Credentials** to bypass `.env` constraints.
        - Generated comprehensive documentation: `CONTENT_ENGINE.md` and `MISSION_CONTROL.md`.
    - **Stability**: Refactored the Manual Router with diagnostic layers and deep asset resolution. Finalized the deployment with a master branch merge. 🏁✅

## 📅 2026-04-26

- **[prompt/response]**: User requested the current git branch. Identified that we are currently on the `ui-refinements` branch.
- **[prompt/response]**: Received request to improve the Checkout Drawer UI by moving the Total, Savings, and Confirm Button to a sticky footer to save vertical space.
- **[prompt/response]**: Refined the scope to focus exclusively on **Express Checkout** first, deferring standard checkout steps for later. Updated the implementation plan accordingly.
- **[prompt/response]**: Received instruction to move all voucher-related UI (pills, nudges, input) to a new row in the footer above the current summary row, and remove them from the content area.
- **[prompt/response]**: Implemented a 3-state logic for the Welcome Voucher in the Sentinel footer: Guests see a 'Signup & Save' nudge with a deep espresso brown background and white text for maximum light-mode contrast.
- **[Codebase/Feature Updates]**: Added an explicit 'Applied' tag with a checkmark icon to active vouchers in the Sentinel Row, providing unambiguous confirmation of which deals are currently active in the checkout session.
- **[prompt/response]**: Streamlined the financials summary by removing redundant voucher pills from the 'To Pay' section, keeping the pricing row focused and professional while offloading status confirmation to the dedicated management row above.

## 📅 2026-04-29

- **[prompt/response]**: Refactored the InquiryModal to replace the inquiry topic dropdown with a frictionless text-first approach and an interactive FAQ accordion. Addressed modal scroll jump on iOS by implementing a requestAnimationFrame deferred jump. Created a comprehensive staff manual and a specialized Admin Dashboard manual, integrating both directly into the Admin Sidebar via a new `/admin/documentations` route.
- **[Codebase/Feature Updates]**: 
    - **Inquiry & FAQ Refactor**: Replaced CSS grid transitions with Framer Motion `AnimatePresence` for butter-smooth accordion heights. Defaulted all tickets to `General Inquiry`.
    - **Scroll Restitution**: Hardened the iOS `position: fixed` modal hack by deferring the `window.scrollTo` restoration via `requestAnimationFrame` to prevent 0-height coordinate calculation bugs, and temporarily disabled smooth-scrolling to eliminate messy visual jumps.
    - **Admin Documentations**: Added `react-markdown` to parse project root `.md` files directly inside a new `/admin/documentations` route with a tabbed interface.




