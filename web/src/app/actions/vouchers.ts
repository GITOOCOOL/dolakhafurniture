"use server";

import { client } from "@/lib/sanity";

export async function validateVoucher(code: string) {
  try {
    const voucher = await client.fetch(
      `*[_type == "discountVoucher" && code == $code && isActive == true][0]`,
      { code }
    );

    if (!voucher) {
      return { success: false, message: "Invalid or inactive voucher code." };
    }

    // Check expiration
    if (voucher.endsAt && new Date(voucher.endsAt) < new Date()) {
      return { success: false, message: "This voucher has expired." };
    }

    return { 
      success: true, 
      discountType: voucher.discountType, 
      discountValue: voucher.discountValue 
    };
  } catch (error: any) {
    console.error("Voucher validation error:", error);
    return { success: false, message: "Error validating voucher." };
  }
}
