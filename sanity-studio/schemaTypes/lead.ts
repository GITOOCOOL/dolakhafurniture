import { defineField, defineType } from "sanity";

export default defineType({
    name: "lead",
    title: "Sales Lead",
    type: "document",
    fields: [
        defineField({
            name: "customerName",
            title: "Customer Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email Address",
            type: "string",
        }),
        defineField({
            name: "phone",
            title: "Phone Number",
            type: "string",
        }),
        defineField({
            name: "status",
            title: "Lead Status",
            type: "string",
            initialValue: "new",
            options: {
                list: [
                    { title: "🆕 New Lead", value: "new" },
                    { title: "💬 Contacted", value: "contacted" },
                    { title: "🔥 Hot Deal", value: "hot" },
                    { title: "🏆 Won / Converted", value: "won" },
                    { title: "❄️ Lost / Cold", value: "lost" },
                ]
            }
        }),
        defineField({
            name: "priority",
            title: "Priority Level",
            type: "string",
            initialValue: "medium",
            options: {
                list: [
                    { title: "🔴 High", value: "high" },
                    { title: "🟡 Medium", value: "medium" },
                    { title: "🟢 Low", value: "low" },
                ]
            }
        }),
        defineField({
            name: "internalNotes",
            title: "Internal Staff Notes",
            type: "text",
            description: "Log touchpoints and negotiation history here."
        }),
        defineField({
            name: "source",
            title: "Lead Source",
            type: "string",
            options: {
                list: [
                    { title: "🌐 Website Inquiry", value: "web" },
                    { title: "📸 Instagram DM", value: "instagram" },
                    { title: "📘 Facebook Message", value: "facebook" },
                    { title: "💬 WhatsApp", value: "whatsapp" },
                    { title: "🤝 Manual Entry", value: "manual" },
                ]
            }
        }),
        defineField({
            name: "productReference",
            title: "Interested Product",
            type: "reference",
            to: [{ type: "product" }]
        }),
        defineField({
            name: "originalInquiry",
            title: "Originating Inquiry",
            type: "reference",
            to: [{ type: "inquiry" }],
            description: "Link to the inquiry that was elevated to this lead"
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: (new Date()).toISOString(),
        }),
    ],
});
