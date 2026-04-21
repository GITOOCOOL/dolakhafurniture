import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { sanityAdminClient } from "@/lib/sanity.admin";

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAuthorizedAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { inquiryId } = await request.json();

    if (!inquiryId) {
      return NextResponse.json({ error: "Missing inquiryId" }, { status: 400 });
    }

    // 1. Fetch original inquiry
    const inquiry = await sanityAdminClient.fetch(`*[_type == "inquiry" && _id == $id][0]`, { id: inquiryId });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // 2. Create the Lead document
    const newLead = {
      _type: "lead",
      customerName: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      source: "web",
      status: "new",
      priority: "medium",
      productReference: inquiry.productReference ? {
        _type: "reference",
        _ref: inquiry.productReference._ref
      } : undefined,
      originalInquiry: {
        _type: "reference",
        _ref: inquiryId
      },
      createdAt: new Date().toISOString()
    };

    const leadResult = await sanityAdminClient.create(newLead);

    // 3. Update Inquiry status to 'elevated'
    await sanityAdminClient
      .patch(inquiryId)
      .set({ status: "elevated" })
      .commit();

    return NextResponse.json({ success: true, lead: leadResult });
  } catch (error: any) {
    console.error("Elevation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
