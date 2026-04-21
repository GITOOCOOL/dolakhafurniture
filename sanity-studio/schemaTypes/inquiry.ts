import { defineField, defineType } from "sanity";

export default defineType({
    name: "inquiry",
    title: "Support Inquiry",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "phone",
            title: "Phone",
            type: "string",
        }),
        defineField({
            name: "message",
            title: "Message",
            type: "text",
        }),
        defineField({
            name: "inquiryType",
            title: "Inquiry Type",
            type: "string",
            options: {
                list: [
                    { title: "📦 Order Update / Tracking", value: "tracking" },
                    { title: "🪑 Product Information", value: "product" },
                    { title: "❓ General Question", value: "general" },
                    { title: "🏢 Business / Bulk Enquiry", value: "business" },
                ]
            }
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            initialValue: "new",
            options: {
                list: [
                    { title: "New", value: "new" },
                    { title: "In Progress", value: "progress" },
                    { title: "Resolved", value: "resolved" },
                    { title: "Elevated to Lead", value: "elevated" },
                ]
            }
        }),
        defineField({
            name: "productReference",
            title: "Related Product",
            type: "reference",
            to: [{ type: "product" }]
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: (new Date()).toISOString(),
        }),
    ],
});
