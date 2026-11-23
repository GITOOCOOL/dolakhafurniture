"use server"

import { createClient as createSupabase } from "@/utils/supabase/server"
import { createClient as createSanity } from "@sanity/client"
import { CartItem, CustomerData } from "@/types"
import { checkSpam } from "@/lib/spamGuard"

// 1. Initialize the Sanity Admin Client with Write Permissions
const sanityAdmin = createSanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // MUST be false for writes
  token: process.env.SANITY_API_WRITE_TOKEN, // Ensure this is an EDITOR token
  apiVersion: "2024-03-12"
})

function generateOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous characters like O, 0, I, 1
  let result = "DF-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function processOrder(cartItems: CartItem[], total: number, customerData: CustomerData, voucherCodes: string[] = []) {
  // 1.5 Safety Check: Verify Write Token
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("❌ ERROR: SANITY_API_WRITE_TOKEN is missing in environment variables.")
    return { 
      success: false, 
      message: "Store configuration error: Missing write permissions. Please contact support." 
    }
  }

  const spam = await checkSpam("checkout", customerData.website, {
    firstName: customerData.firstName, lastName: customerData.lastName, email: customerData.email,
    phone: customerData.phone, address: customerData.address, apartment: customerData.apartment,
    city: customerData.city, state: customerData.state, postcode: customerData.postcode,
  })
  if (!spam.ok) {
    // Honeypot: look successful to the bot, save nothing
    if (spam.silent) return { success: true, orderId: "", orderNumber: generateOrderNumber() }
    return { success: false, message: spam.message }
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.length > 50) {
    return { success: false, message: "Your cart is empty or invalid." }
  }

  try {
    const supabase = await createSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    const orderNumber = generateOrderNumber();

    // 2. Server-side Recalculation (Integrity Check)
    // Prices come from Sanity, never from the browser: the cart lives in the visitor's
    // browser and could be edited to any price.
    const ids = cartItems.map((item) => item._id)
    const dbProducts = await sanityAdmin.fetch<{ _id: string; title: string; price: number }[]>(
      `*[_id in $ids]{ _id, title, price }`,
      { ids }
    )
    const priceById = new Map(dbProducts.map((p) => [p._id, p]))
    for (const item of cartItems) {
      const q = item.quantity
      if (!priceById.has(item._id) || typeof priceById.get(item._id)!.price !== "number") {
        return { success: false, message: `"${item.title}" is no longer available. Please remove it from your cart.` }
      }
      if (!Number.isInteger(q) || q < 1 || q > 99) {
        return { success: false, message: `Invalid quantity for "${item.title}".` }
      }
    }
    const pricedItems = cartItems.map((item) => ({ ...item, price: priceById.get(item._id)!.price }))
    const serverSubtotal = pricedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let serverShipping = customerData.shippingMethod === 'express' ? 500 : 0;
    
    // Multi-Voucher Calculation
    let serverDiscount = 0;
    const { validateVoucher } = await import("./vouchers");

    for (const code of voucherCodes) {
       const voucherResult = await validateVoucher(code);
       if (!voucherResult.success) {
          return {
            success: false,
            message: `Voucher Error (${code}): ${voucherResult.message}`
          }
       }
       
       if (voucherResult.discountType === 'percentage') {
          serverDiscount += Math.floor((serverSubtotal * (voucherResult.discountValue || 0)) / 100);
       } else {
          serverDiscount += voucherResult.discountValue || 0;
       }
    }

    const serverTotal = Math.max(0, serverSubtotal + serverShipping - serverDiscount);

    // 3. Prepare the Order Document for Sanity
    const orderDocument = {
      _type: 'order',
      orderNumber,
      supabaseUserId: user?.id || 'guest',
      voucherCodes: voucherCodes.map(c => c.toLowerCase()),
      customerName: user ? (user.user_metadata.full_name || user.email) : `${customerData.firstName} ${customerData.lastName}`,
      customerEmail: user?.email || customerData.email,
      customerPhone: customerData.phone,
      shippingAddress: {
        _type: 'object',
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        address: customerData.address,
        apartment: customerData.apartment,
        city: customerData.city,
        state: customerData.state,
        postcode: customerData.postcode,
        country: customerData.country || 'Nepal',
      },
      shippingMethod: customerData.shippingMethod,
      paymentMethod: customerData.paymentMethod,
      totalPrice: serverTotal,
      status: 'pending',
      items: pricedItems.map((item) => ({
        _key: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        productId: item._id,
        image: item.mainImage
      })),
      orderDate: new Date().toISOString(),
    }

    const result = await sanityAdmin.create(orderDocument)
    return { success: true, orderId: result._id, orderNumber }
  } catch (error: any) {
    console.error("❌ Checkout Error:", error.message)
    // Handle specific Sanity permission errors
    if (error.message?.includes("insufficient permissions")) {
      return { 
        success: false, 
        message: "Permission Denied: The Sanity token does not have 'Editor' rights. Please check Cloudflare environment variables." 
      }
    }
    return { success: false, message: error.message || "An unexpected error occurred." }
  }
}
