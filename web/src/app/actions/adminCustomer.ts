"use server";

import { client as sanityClient } from "@/lib/sanity";
import { revalidatePath } from "next/cache";

export async function getCustomerIntelligence(email: string) {
  if (!email) return { success: false, message: "Email is required" };

  try {
    const query = `{
      "orders": *[_type == "order" && customerEmail == $email] | order(_createdAt desc) {
        _id,
        _createdAt,
        orderNumber,
        status,
        totalPrice,
        customerPhone,
        items[] {
          "title": coalesce(title, product->title),
          quantity
        }
      },
      "inquiries": *[_type == "inquiry" && email == $email] | order(_createdAt desc) {
        _id,
        _createdAt,
        inquiryType,
        status,
        message
      },
      "leads": *[_type == "lead" && email == $email] | order(_createdAt desc) {
        _id,
        _createdAt,
        status,
        priority,
        productReference-> { title }
      }
    }`;

    const data = await sanityClient.fetch(query, { email }, { useCdn: false });

    // Calculate aggregated metrics
    const totalSpend = data.orders.reduce((acc: number, order: any) => acc + (order.totalPrice || 0), 0);
    const orderCount = data.orders.length;
    
    const latestActivity = [
      data.orders[0]?._createdAt,
      data.inquiries[0]?._createdAt,
      data.leads[0]?._createdAt
    ].filter(Boolean).sort().reverse()[0] || null;

    return {
      success: true,
      data: {
        ...data,
        metrics: {
          totalSpend,
          orderCount,
          latestActivity
        }
      }
    };
  } catch (error: any) {
    console.error("Customer Intelligence Error:", error);
    return { success: false, message: error.message || "Failed to fetch customer data" };
  }
}
