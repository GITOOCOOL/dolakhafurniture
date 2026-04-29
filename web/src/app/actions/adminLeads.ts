"use server";

import { sanityAdminClient } from "@/lib/sanity.admin";
import { getUserRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createLead(formData: {
  customerName: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
  source: string;
  internalNotes?: string;
  productReferenceId?: string;
}) {
  try {
    const { role } = await getUserRole();
    if (role !== "admin" && role !== "staff") {
      throw new Error("Unauthorized access to lead management.");
    }

    const doc = {
      _type: "lead",
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      priority: formData.priority,
      source: formData.source,
      internalNotes: formData.internalNotes,
      createdAt: new Date().toISOString(),
      ...(formData.productReferenceId ? {
        productReference: {
          _type: "reference",
          _ref: formData.productReferenceId
        }
      } : {})
    };

    const result = await sanityAdminClient.create(doc);
    revalidatePath("/admin/leads");
    return { success: true, leadId: result._id };
  } catch (error: any) {
    console.error("Lead creation error:", error);
    return { success: false, error: error.message };
  }
}
