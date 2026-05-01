"use server"

import { writeClient } from "@/lib/sanity";
import { createClient as createSupabase } from "@/utils/supabase/server";

export async function getCustomerOrders() {
  try {
    const supabase = await createSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized", orders: [] };
    }

    // Use writeClient because it has the token needed to read a private dataset
    const query = `*[_type == "order" && (supabaseUserId == $userId || customerEmail == $email)] | order(_createdAt desc)[0...5]`;
    const params = { userId: user.id, email: user.email };
    
    const orders = await writeClient.fetch(query, params);

    return { success: true, orders };
  } catch (error: any) {
    console.error("Error fetching customer orders:", error);
    return { success: false, message: error.message, orders: [] };
  }
}

export async function getFAQs() {
  try {
    // FAQs are public content, but we can still fetch them here for consistency
    const query = `*[_type == "faq"] | order(category asc)`;
    const faqs = await writeClient.fetch(query);
    return { success: true, faqs };
  } catch (error: any) {
    console.error("Error fetching FAQs:", error);
    return { success: false, message: error.message, faqs: [] };
  }
}
