# 🚀 Future Updates & Roadmap: Projekt-Dolakha

This document serves as the repository for all future concepts, feature ideas, and architectural evolutions for the Dolakha Furniture ecosystem. It is intended to decouple long-term vision from the immediate `context.md`.

---

## 💡 Future Concepts

- **React Native Mobile App**: Leveraging the same Sanity GROQ queries for a native shopping experience.
- **Customer Account Portal**: Personalized dashboards for order tracking and voucher management.
- **B2B Quote Generator**: Allowing bulk buyers to generate custom priced PDFs directly from the dashboard.
- **In-App Browser Intelligence (Shadowed)**: A rhythmic triple-bounce alert for Messenger/Facebook users to guide them to external browsers. Currently deactivated for "System Polish" (Requires timing refinement).

---

## 💎 Important Future Features

- **Offline Conversions Sync (Meta CAPI)**:
  - **Goal**: Perfect attribution for Cash-on-Delivery (COD) orders.
  - **Logic**: A script or webhook that triggers when an order is marked as "Paid/Delivered" in Sanity, sending a final "Purchase" signal to Meta via the Conversions API. This ensures Meta only optimizes for customers who actually handed over the cash.

---

## 🔒 Infrastructure & Security Hardening

- **Supabase Traffic Sentinel (Anti-Spam)**:
  - **Goal**: Prevent malicious "anon" key exploitation or pulse-flooding.
  - **Strategy**: Implement a PostgreSQL function and trigger on the `traffic_pulse` table to rate-limit insertions by IP address.
  - **Protection**: If an IP sends more than X pulses per minute, the database will temporarily reject the `INSERT` request, protecting your storage and performance.


---

## 📈 Roadmap & Pipeline
*Items added here should be moved to implementation status in `context.md` once completed.*

- **Home Page Remaster (High Priority)**: 
  - **Vision**: Transition the homepage from a static gallery to a dynamic "Funnel Machine".
  - **Strategy**: Editorial-style storytelling, high-intent call-to-actions, and performance-optimized sections designed to guide users from brand awareness to conversion (Lead or Purchase).
  - **Tech**: High-performance "Solid" styling, Framer Motion sequence for storytelling, and integration with live Sanity campaigns.

- **Sanity Studio UI Refinement (Heritage Atelier)**:
  - **Goal**: Transform the default Sanity interface into a premium, branded internal business tool.
  - **Key Features**: 
    - Custom branding (colors, fonts, logos) matching the Dolakha Furniture aesthetic.
    - **Reel Mockup Preview**: A live iPhone frame preview inside the editor to visualize social content before publishing.
    - **Social Command Center Dashboard**: A custom landing page widget in the studio showing real-time reach, views, and engagement metrics from the Meta API.
    - **Layout Tabs**: Reorganizing complex documents into clear, tabbed sections (Content, Distribution, Performance).
