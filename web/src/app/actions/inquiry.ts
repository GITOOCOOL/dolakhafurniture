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
    return {
      success: false,
      message: error.message || "Failed to submit inquiry. Please try again."
    };
  }
}
