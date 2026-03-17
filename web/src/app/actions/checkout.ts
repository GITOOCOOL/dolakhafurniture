"use server"

import { createClient as createSupabase } from "@/utils/supabase/server"
import { createClient as createSanity } from "@sanity/client"

// 1. Initialize the Sanity Admin Client with Write Permissions
const sanityAdmin = createSanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // MUST be false for writes
  token: process.env.SANITY_API_WRITE_TOKEN, // Ensure this is an EDITOR token
  apiVersion: "2024-03-12"
})

export async function processOrder(cartItems: any[], total: number, customerData: any) {
  try {
    const supabase = await createSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Prepare the Order Document for Sanity
    const orderDocument = {
      _type: 'order',
      supabaseUserId: user?.id || 'guest',
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
        productId: item._id
      })),
      orderDate: new Date().toISOString(),
    }

    const result = await sanityAdmin.create(orderDocument)
    return { success: true, orderId: result._id }
  } catch (error: any) {
    console.error("❌ Checkout Error:", error.message)
    return { success: false, message: error.message || "An unexpected error occurred." }
  }
}
