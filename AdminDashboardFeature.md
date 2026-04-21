# 🛠 Feature: Admin Management Console

This document tracks the design, implementation, and evolution of the Dolakha Furniture Admin Hub.

## 🎯 Objective
A centralized, high-performance portal for managing business operations: Orders, Inventory, and Brand Content.

## 🏗 System Architecture

### **Core Hubs**
1. **Overview Dashboard**: Real-time business metrics (Sales, Leads, Stock alerts).
2. **Order Management**: Fulfillment tracking, manual order entry, and secure deletion.
3. **Service Inquiries**: Handling general support, order tracking, and FAQs.
4. **Sales Leads CRM**: High-intent sales pipeline with deal lifecycle tracking and sales notes.
5. **Inventory Center**: Quick restocking tool and visibility control.
5. **Meta Attribution Hub**: Real-time performance tracking from Meta Pixel and Ads Manager.

---

## 📐 Design Philosophy
- **Aesthetic**: Derived from the "Heritage Atelier" theme—grounded, high-contrast, and focused on information density without clutter.
- **Workflow**: "Action First"—critical tasks (like out-of-stock items or pending orders) are prioritized in the UI.

---

## 📜 Implementation Progress

### **✅ Completed**
- [x] Admin Layout with Role-based Access (Supabase).
- [x] Orders Listing with Status Updates & Secure Deletion.
- [x] **Service Inquiries**: Standardized support channel.
- [x] **Sales Leads CRM**: Sales intelligence pipeline with 'Elevation' workflow, deal status tracking, and priority management.
- [x] **Manual Order Portal**: Step-by-step creation with voucher overrides.
- [x] **Quick Restock Tool**: Single-click stock increments with automated timestamps.
- [x] Inquiry Management with direct WhatsApp/Email triggers.
- [x] User Role Management (Super Admin only).
- [x] Sanity Admin Write Client integration.

### **🚧 In Development**
- [x] **Live Stats Dashboard**: Real-time Total Revenue and Active Order counts from Sanity.
- [ ] **Meta Messaging Integration**: Unified Inbox for Facebook/Instagram DMs.
- [ ] **Meta Stats Integration**: Fetching event data (Conversions, WhatsApp hits) from Meta API.

### **📅 Future Concepts**
- [ ] **Revenue Analytics**: Margin tracking using `costPrice`.
- [ ] **Customer Timelines**: Interaction history for repeat buyers.
- [ ] **Automated Stock Alerts**: Low-stock notifications via staff emails.

---

## 📜 Agent logs for this Feature
- **2026-04-21**: Established Feature blueprint and identified core management hubs. Proposed schema updates for `orderSource` and `lastRestocked`. Integrated Meta Pixel attribution tracking into the dashboard vision.
- **2026-04-22**: Massive upgrade to Order and Inquiry systems. Implemented Manual Order creation and Secure Order Deletion. Restructured the entire CRM architecture: split Inquiries into **Service Inquiries** (Support) and **Artisan Leads** (CRM). Built the **Lead Elevation API** to bridge the two. Dedicated CRM dashboard live for high-value sales tracking.
