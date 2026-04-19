"use server";

import { client } from "@/lib/sanity";
import { createClient as createSupabase } from "@/utils/supabase/server";

export async function validateVoucher(code: string) {
  try {
    const normalizedCode = code.trim().toLowerCase();
    
    // 1. Fetch Voucher and its referring Campaign
    const voucher = await client.fetch(
      `*[_type == "discountVoucher" && lower(code) == $code && isActive == true][0]{
        ...,
        "campaign": *[_type == "campaign" && references(^._id)][0]
      }`,
      { code: normalizedCode }
    );

    if (!voucher) {
      return { success: false, message: "Invalid or inactive voucher code." };
    }

    const now = new Date();

    // 2. Specialized Logic for WELCOME5 (Signup Voucher)
    if (normalizedCode === "welcome5") {
      const supabase = await createSupabase();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, message: "Please log in or sign up to use the WELCOME5 voucher." };
      }

      // Check if user has already used it (One-time use check)
      const usageCount = await client.fetch(
        `count(*[_type == "order" && supabaseUserId == $userId && lower(voucherCode) == "welcome5"])`,
        { userId: user.id }
      );

      if (usageCount > 0) {
        return { success: false, message: "The WELCOME5 voucher can only be used once per customer." };
      }
    }

    // 3. Voucher Date Validation
    if (voucher.startsAt && new Date(voucher.startsAt) > now) {
      return { success: false, message: "This voucher is not active yet." };
    }
    if (voucher.endsAt && new Date(voucher.endsAt) < now) {
      return { success: false, message: "This voucher has expired." };
    }

    // 4. Linked Campaign Validation
    if (voucher.campaign) {
      if (voucher.campaign.status === 'draft') {
        return { success: false, message: "The associated campaign is not yet live." };
      }
      if (voucher.campaign.startDate && new Date(voucher.campaign.startDate) > now) {
        return { success: false, message: "The associated campaign hasn't started yet." };
      }
      // Note: We intentionally DO NOT check voucher.campaign.endDate here 
      // as the voucher uses its own endsAt as the definitive expiry.
    }

    return { 
      success: true, 
      discountType: voucher.discountType, 
      discountValue: voucher.discountValue 
    };
  } catch (error: any) {
    console.error("❌ Voucher validation error:", error.message || error);
    return { success: false, message: "Error validating voucher." };
  }
}
