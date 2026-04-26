"use server";

import { client } from "@/lib/sanity";
import { createClient as createSupabase } from "@/utils/supabase/server";

export async function validateVoucher(code: string) {
  try {
    const normalizedCode = code.trim().toLowerCase();
    
    // 1. Fetch Voucher and its referring Campaign - Bypass CDN for real-time validation
    const voucher = await client.fetch(
      `*[_type == "discountVoucher" && lower(code) == $code && isActive == true][0]{
        ...,
        "campaign": *[_type == "campaign" && references(^._id)][0]
      }`,
      { code: normalizedCode },
      { useCdn: false } // Force fresh data
    );

    if (!voucher) {
      return { success: false, message: "Invalid or inactive voucher code." };
    }

    const now = new Date();

    // 2. Specialized Logic for One-time use vouchers (including First-Order Vouchers)
    if (voucher.isOneTimePerCustomer || voucher.isFirstOrderVoucher) {
      const supabase = await createSupabase();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { 
          success: false, 
          message: voucher.isFirstOrderVoucher 
            ? "Please log in or sign up to use this first-order offer." 
            : "Please log in to use this one-time voucher."
        };
      }

      // Check if user has already used it (Robust One-time use check)
      const usageCount = await client.fetch(
        `count(*[_type == "order" && (supabaseUserId == $userId || customerEmail == $email) && count(voucherCodes[lower(@) == $code]) > 0])`,
        { 
          userId: user.id,
          email: user.email,
          code: normalizedCode
        },
        { useCdn: false }
      );

      if (usageCount > 0) {
        return { 
          success: false, 
          message: `The ${voucher.code.toUpperCase()} voucher has already been used on this account.` 
        };
      }
    }

    // 3. Voucher Date Validation
    if (!voucher.startsImmediately && voucher.startsAt && new Date(voucher.startsAt) > now) {
      return { success: false, message: "This voucher is not active yet." };
    }
    if (!voucher.neverExpires && voucher.endsAt && new Date(voucher.endsAt) < now) {
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

export async function checkVoucherUsage(voucherCode: string, userId: string, email?: string) {
  try {
    const normalizedCode = voucherCode.trim().toLowerCase();
    
    // Using a more aggressive search that catches any presence of the code
    const query = `count(*[_type == "order" && 
      (supabaseUserId == $userId || customerEmail == $email) && 
      (
        $code in voucherCodes || 
        count(voucherCodes[lower(@) == $code]) > 0 ||
        count(voucherCodes[@ match $code]) > 0
      )
    ])`;

    const usageCount = await client.fetch(
      query,
      { 
        userId,
        email: email || '___none___', // Avoid null match
        code: normalizedCode
      },
      { useCdn: false }
    );
    
    return usageCount > 0;
  } catch (error) {
    console.error("Error checking voucher usage:", error);
    return false;
  }
}

