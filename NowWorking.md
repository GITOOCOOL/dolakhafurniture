# 🛡️ NowWorking: Website Hardening & Stabilization

This document tracks active bugs, security improvements, and stabilization tasks for the Dolakha Furniture website.

---

## 🚩 Critical Bugs & Inconsistencies

- [x] **WhatsApp Number**: no longer hardcoded; every button reads `businessMetaData.whatsapp` from Sanity. The Australian number is the real business WhatsApp (intended).
- [ ] **Brand back to Dolakha Furniture**: Sanity `businessMetaData` still says "Shop Now Nepal" (name, tagline, links) from the planned company move.
- [ ] **Messenger ID Sync**: Verify if the Messenger ID `224061751418570` matches the current business page.

---

## 🔒 Security & Robustness

- [ ] **Spam Protection**: Implement rate-limiting or a basic honey-pot for `Inquiry` and `Checkout` server actions to prevent bot spam.
- [ ] **Environment Guards**: Refactor server utilities to gracefully handle missing environment variables instead of hard-asserting (`!`).
- [ ] **Sanity Token Scoping**: Ensure tokens used in client-accessible patterns (if any) are restricted to READ-ONLY.

---

## ⚡ Optimization & Performance

- [ ] **Image Optimization**: Replace remaining `<img>` tags with `next/image` in `ProductCard.tsx` and `CheckoutDrawer.tsx` for better performance and smaller bundle sizes.
- [ ] **Feed Caching**: Add `revalidate` logic to `api/feed/facebook` instead of `force-dynamic` to reduce load on Sanity and improve response times.
- [ ] **Memoization**: Use `useMemo` for subtotal and discount calculations in `CheckoutDrawer` to prevent redundant logic execution on every state update.

---

## 🛠 Refactoring Potential

- [ ] **Decompose CheckoutDrawer**: Break down the 1400+ line `CheckoutDrawer.tsx` into smaller components (e.g., `VoucherInspector`, `CartList`, `AddressForm`).
- [ ] **Query Pruning**: Review `lib/queries.ts` to ensure we aren't fetching full image arrays where only a thumbnail is needed.

---

## 📈 Stabilization Progress
*Track active fixes here.*

1. **[COMPLETED]**: Hardened Content Engine (v4.1). Implemented multimodal intelligence, cloud-based GitHub Actions heartbeat, and 2-step Photo Story Circle protocol. 🛰️✅
2. **[COMPLETED]**: WhatsApp numbers now come from Sanity (`businessMetaData.whatsapp`).
