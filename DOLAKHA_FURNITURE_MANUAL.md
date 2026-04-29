# 🛋️ Dolakha Furniture - Complete System Manual

Welcome to the Dolakha Furniture System Manual! This guide is designed for staff members, managers, and administrators to understand how to operate the digital storefront. It covers how to manage content in the back office (Sanity CMS) and explains what the customers experience on the front-end website.

This manual is written in plain language so that anyone on the team can confidently manage the store.

---

## 📑 Table of Contents
1. [Introduction to the System](#1-introduction-to-the-system)
2. [Managing the Store (Sanity CMS)](#2-managing-the-store-sanity-cms)
   - [Business Settings & Store Info](#business-settings--store-info)
   - [Adding & Editing Products](#adding--editing-products)
   - [Managing Categories](#managing-categories)
   - [Updating Banners & Announcements](#updating-banners--announcements)
3. [Sales, Marketing & Discounts](#3-sales-marketing--discounts)
   - [Running Campaigns](#running-campaigns)
   - [Creating Discount Vouchers](#creating-discount-vouchers)
4. [Customer Service & Orders](#4-customer-service--orders)
   - [Viewing Customer Orders](#viewing-customer-orders)
   - [Handling Inquiries & Leads](#handling-inquiries--leads)
   - [Managing FAQs & Instant Responses](#managing-faqs--instant-responses)
5. [The Customer Experience (Frontend)](#5-the-customer-experience-frontend)
   - [Browsing & Searching](#browsing--searching)
   - [The Checkout Process](#the-checkout-process)
   - [Asking for Help](#asking-for-help)

---

## 1. Introduction to the System

Our platform is divided into two main parts:
- **The Frontend (The Storefront):** This is the public website where customers browse furniture, add items to their cart, and place orders. It is designed to be fast, beautiful, and easy to use on mobile phones.
- **The Backend (Sanity Studio):** This is your secure "Back Office." It is where staff members log in to add new furniture, change prices, update the store's phone number, view orders, and manage discount codes. 

---

## 2. Managing the Store (Sanity CMS)

Sanity Studio is your control center. When you log in, you will see a list of categories on the left side of your screen. Clicking on any of these will allow you to edit that specific part of the store.

### Business Settings & Store Info
If you ever change your phone number, WhatsApp link, Facebook Messenger URL, or store address, you do *not* need to call a developer. 
- Go to **Business MetaData** in Sanity.
- Here, you can update your store's name, tagline, contact numbers, and social media links.
- *Note:* Whenever you update these, the changes will automatically update everywhere on the website (including the Quick Connect Hub).

### Adding & Editing Products
To add a new sofa, bed, or table to the website:
1. Go to **Products**.
2. Click the button to create a new product.
3. Fill in the details:
   - **Title:** The name of the furniture piece.
   - **Slug:** Click "Generate" to automatically create the web link for this product.
   - **Price & Compare-At Price:** If an item is on sale, put the original higher price in "Compare-At" and the sale price in "Price".
   - **Images:** Upload beautiful, high-quality images. The first image will be the main display picture.
   - **Details:** Add descriptions, dimensions, and materials.
4. Hit **Publish** when you are ready for customers to see it.

### Managing Categories
Categories help customers find what they are looking for (e.g., "Living Room", "Beds", "Decor").
- Go to **Categories**.
- You can create new categories and assign products to them. 
- Make sure to upload a nice thumbnail image for each category, as these appear in the scrolling ribbon at the top of the website.

### Updating Banners & Announcements
- **Hero Images:** Go to the Hero Image section to change the massive, eye-catching banners on the homepage. 
- **Bulletins:** Need to announce "Free Delivery in Kathmandu"? Create a new Bulletin. These appear in the scrolling ticker at the very top of the website.

---

## 3. Sales, Marketing & Discounts

### Running Campaigns
When festival season arrives (like Dashain or Tihar), you can launch a site-wide campaign.
- Go to **Campaigns**.
- Set a catchy title (e.g., "Dashain Mega Sale").
- Add a start and end date.
- You can link specific **Vouchers** to this campaign so customers automatically know what discount codes to use.
- Active campaigns will show up as beautiful pop-ups and banners on the storefront.

### Creating Discount Vouchers
Want to give 10% off or a flat Rs. 2000 discount?
1. Go to **Discount Vouchers**.
2. Set the **Code** (e.g., `DASHAIN10`).
3. Choose the type: **Percentage** (10%) or **Fixed Amount** (Rs. 2000).
4. Set rules: You can make it so the voucher only works if the customer spends over Rs. 50,000, or limit how many times the voucher can be used in total.

---

## 4. Customer Service & Orders

### Viewing Customer Orders
When a customer completes a checkout, the details instantly arrive here.
- Go to **Orders**.
- You will see the customer's name, phone number, delivery address, and exactly what they ordered.
- The order will show a status (like "Processing"). You can update this as the furniture is built and shipped.
- The system also securely records whether they want to pay via Cash on Delivery, Bank Transfer, or exact change.

### Handling Inquiries & Leads
If a customer has a custom request or a question, they will submit a form.
- Go to **Inquiries**.
- You will see their name, contact info, and their message.
- *Pro-tip:* The system tells you if this inquiry is a "General Inquiry", an "Order Inquiry", or a "Custom Request". If it's about an existing order, the Order ID will be attached so you know exactly what they are talking about before you even call them back!

### Managing FAQs & Instant Responses
We want to save your staff time by answering common questions automatically.
- Go to **FAQs & Instant Responses**.
- Add common questions like *"Do you deliver outside the valley?"* and provide the answer.
- These will instantly appear in an interactive accordion on the website's contact form. Customers can tap the question and immediately get your answer without having to call or message you!

---

## 5. The Customer Experience (Frontend)

Understanding what the customer sees will help you assist them better.

### Browsing & Searching
- **Mobile First:** The site is heavily optimized for mobile phones.
- **Quick View:** Customers don't have to open a new page to see a product. They can tap a product to open a fast "Quick View" modal, allowing them to rapidly browse through your catalog.
- **Search:** The search bar opens a full-screen, distraction-free search window.

### The Checkout Process
We use a custom "Zero-G Checkout" system. It is designed to be as frictionless as possible.
- Customers do not have to leave the page to check out. The cart simply slides up from the bottom of the screen.
- They can enter discount vouchers right there.
- They can easily select their delivery district and choose their preferred payment method in one continuous, smooth flow.

### Asking for Help
If a customer is stuck, they will tap the help icons. 
- They are presented with a **Quick Connect Hub** featuring three pill-shaped buttons: **WhatsApp**, **Messenger**, and **Call Us**.
- Tapping these buttons instantly opens the respective apps on their phone using the exact numbers you put in the Sanity Business MetaData section.
- If they prefer to write, they can use the **Frictionless Form** below it to send a direct message into your Sanity back office.
