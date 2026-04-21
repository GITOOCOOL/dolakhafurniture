# 🛠 Feature: Admin Management Console

This document tracks the design, implementation, and evolution of the Dolakha Furniture Admin Hub.

## 🎯 Objective
A centralized, high-performance portal for managing business operations: Orders, Inventory, and Brand Content.

## 🏗 System Architecture

### **Core Hubs**
1. **Overview Dashboard**: Real-time business metrics (Sales, Inquiries, Stock alerts).
2. **Order Management**: Fulfillment tracking, manual order entry, and internal communication.
3. **Inventory Center**: In-line stock updates, pricing control, and multi-channel sync (Web/Meta).
4. **Content Hub**: Management of Bulletins, Campaigns, and Featured products.
5. **Meta Attribution Hub**: Real-time performance tracking from Meta Pixel and Ads Manager.

---

## 📐 Design Philosophy
- **Aesthetic**: Derived from the "Heritage Atelier" theme—grounded, high-contrast, and focused on information density without clutter.
- **Workflow**: "Action First"—critical tasks (like out-of-stock items or pending orders) are prioritized in the UI.

---

## 📜 Implementation Progress

### **✅ Completed**
- [x] Admin Layout with Role-based Access (Supabase).
- [x] Orders Listing with Status Updates.
- [x] Inquiry Management with direct WhatsApp/Email triggers.
- [x] User Role Management (Super Admin only).
- [x] Sanity Admin Write Client integration.

### **🚧 In Development**
- [ ] **Live Stats Dashboard**: Integrating real-time counts from Sanity/Supabase.
- [ ] **Manual Order Form**: Support for #isPhoneOrder workflow.
- [ ] **Inventory Hub**: Inline editing for price/stock.
- [ ] **Meta Stats Integration**: Fetching event data (Conversions, WhatsApp hits) from Meta API.

### **📅 Future Concepts**
- [ ] **Revenue Analytics**: Margin tracking using `costPrice`.
- [ ] **Customer Timelines**: Interaction history for repeat buyers.
- [ ] **Automated Stock Alerts**: Low-stock notifications via staff emails.

---

## 📜 Agent logs for this Feature
- **2026-04-21**: Established Feature blueprint and identified core management hubs. Proposed schema updates for `orderSource` and `lastRestocked`. Integrated Meta Pixel attribution tracking into the dashboard vision.
