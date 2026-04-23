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

## 📅 2026-04-23 / 04-24

- **[prompt/response]**: Collaborated with user to solve critical voucher security flaws and UI stability issues.
- **[Codebase/Feature Updates]**: 
    - **Voucher Security**: Implemented server-side, real-time validation for vouchers (pinning to User ID/Email) to prevent multi-use exploitation. Hardened `processOrder` with a fail-hard validation check.
    - **Auth Stability**: Fixed a "frozen UI" bug caused by Supabase lock contention between `Navbar` and `CheckoutDrawer`. Centralized auth state in `NavbarActions`.
    - **UX Advancements**: 
        - Created an **Interactive Voucher Inspector** showing real-time discount details on hover/tap.
        - Implemented an intelligent **Soft-Gate Nudge** for vouchers that respects user input.
        - Refined Step 3 (Delivery) with better field ordering, mandatory "Tole/Area", and aligned label/input styling.
    - **Authentication Refinement**: Updated redirect logic in `AuthForm.tsx` and `AuthPage.tsx` to land users on the home page (`/`) instead of the account page (`/account`) after signup and login.
    - **Documentation Refactor**: Created `FutureUpdates.md` to centralize long-term concepts and features, keeping `context.md` lean. Added the **Home Page Remaster** (Funnel Machine) initiative to the roadmap.
    - **Performance**: Cleaned up `.next` cache, freeing over 1GB of disk space.
    - **Deployment**: Successfully merged all refinements into `master`.
