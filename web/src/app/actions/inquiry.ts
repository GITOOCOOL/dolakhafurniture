"use server";

import { createClient } from "@sanity/client";

const sanityAdmin = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-12",
});

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  // 1.5 Safety Check: Verify Write Token
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("❌ ERROR: SANITY_API_WRITE_TOKEN is missing in environment variables.")
    return { 
      success: false, 
      message: "Configuration error: Missing write permissions for inquiries." 
    }
  }

  try {
    const inquiryDocument = {
      _type: "inquiry",
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      createdAt: new Date().toISOString(),
    };

    const result = await sanityAdmin.create(inquiryDocument);
    console.log("Inquiry submitted successfully:", result._id);
    return { success: true, message: "Inquiry submitted successfully!" };
  } catch (error: any) {
    console.error("Error submitting inquiry:", error);
    if (error.message?.includes("insufficient permissions")) {
      return { 
        success: false, 
        message: "Permission Denied: Inquiry token is not 'Editor' level." 
      }
    }
    return {
      success: false,
      message: error.message || "Failed to submit inquiry. Please try again."
    };
  }
}
