"use server";

// Reads that browser components need. The Sanity dataset is private, so the
// browser can't query it; these run on the server with the token. Each function
// is a fixed query: never accept GROQ from the browser.

import { client } from "@/lib/sanity";
import { isAuthorizedAdmin } from "@/lib/auth";
import {
  activeCampaignsQuery,
  activeVouchersQuery,
  allMaterialsQuery,
  categoriesQuery,
  checkoutSettingsQuery,
  firstOrderVoucherQuery,
  paymentAccountsQuery,
  searchProductsQuery,
} from "@/lib/queries";

export async function getCategories() {
  const isAdmin = await isAuthorizedAdmin();
  return client.fetch(categoriesQuery, { isAdmin });
}

export async function getFirstOrderVoucher() {
  return client.fetch(firstOrderVoucherQuery);
}

export async function searchProducts(term: string) {
  const clean = String(term || "").slice(0, 60);
  if (!clean.trim()) return { products: [], categories: [] };
  const isAdmin = await isAuthorizedAdmin();
  return client.fetch(searchProductsQuery, { searchTerm: `${clean}*`, isAdmin });
}

export async function getCheckoutData() {
  const [campaigns, paymentAccounts, settings] = await Promise.all([
    client.fetch(activeCampaignsQuery),
    client.fetch(paymentAccountsQuery),
    client.fetch(checkoutSettingsQuery),
  ]);
  return { campaigns, paymentAccounts, settings };
}

export async function getActiveCampaignVouchers() {
  return client.fetch(
    `*[_type == "campaign" && status == "active"] | order(startDate desc)[0] {
      title,
      "vouchers": vouchers[]->{code, details, discountType, discountValue, isFirstOrderVoucher, isOneTimePerCustomer, minimumSpend}
    }`,
  );
}

export async function getManualOrderData() {
  if (!(await isAuthorizedAdmin())) throw new Error("Not authorized");
  const [vouchers, materials, products] = await Promise.all([
    client.fetch(activeVouchersQuery),
    client.fetch(allMaterialsQuery),
    client.fetch(`*[_type == "product" && isActive == true] {
      _id, title, price, "imageUrl": mainImage.asset->url, stock, category->{title}
    }`),
  ]);
  return { vouchers, materials, products };
}
