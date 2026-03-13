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

export async function processOrder(cartItems: any[], total: number) {
  try {
    // 2. Authenticate the user via Supabase
    const supabase = await createSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("You must be logged in to complete a purchase.")
    }

    // 3. Prepare the Order Document for Sanity
    const orderDocument = {
      _type: 'order',
      supabaseUserId: user.id,
      customerName: user.user_metadata.full_name || user.email,
      totalPrice: total,
      status: 'paid', // Or 'pending' depending on your flow
      // Sanity requires a unique _key for every item in an array
      items: cartItems.map((item) => ({
        _key: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        productId: item._id // Good for tracking which product was bought
      })),
      orderDate: new Date().toISOString(),
    }

    // 4. Create the document in Sanity
    const result = await sanityAdmin.create(orderDocument)

    console.log("✅ Order created in Sanity:", result._id)

    return { 
      success: true, 
      orderId: result._id 
    }

  } catch (error: any) {
    console.error("❌ Checkout Error:", error.message)
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred during checkout." 
    }
  }
}
