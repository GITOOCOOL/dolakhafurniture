"use server"

import { createClient as createSupabase } from "@/utils/supabase/server"
import { createClient as createSanity } from "@sanity/client"
import { CartItem, CustomerData } from "@/types"

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

export async function processOrder(cartItems: CartItem[], total: number, customerData: CustomerData, voucherCode?: string) {
  // 1.5 Safety Check: Verify Write Token
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("❌ ERROR: SANITY_API_WRITE_TOKEN is missing in environment variables.")
    return { 
      success: false, 
      message: "Store configuration error: Missing write permissions. Please contact support." 
    }
  }

  try {
    const supabase = await createSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    const orderNumber = generateOrderNumber();

    // 2. Prepare the Order Document for Sanity
    const orderDocument = {
      _type: 'order',
      orderNumber,
      supabaseUserId: user?.id || 'guest',
      voucherCode: voucherCode?.toLowerCase() || null,
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
      totalPrice: total,
      status: 'pending',
      items: cartItems.map((item) => ({
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
