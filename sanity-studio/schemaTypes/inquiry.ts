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
                    { title: "📦 Order Inquiry", value: "order" },
                    { title: "❓ General Inquiry", value: "general" },
                    { title: "🪑 Product Customization", value: "custom" },
                    { title: "🏢 Bulk / Corporate Inquiry", value: "bulk" },
                ]
            }
        }),
        defineField({
            name: "orderReference",
            title: "Order Reference",
            type: "string",
            description: "The order number or ID associated with this inquiry."
        }),
        defineField({
            name: "topic",
            title: "Specific Topic",
            type: "string",
            description: "The specific FAQ topic or custom subject selected."
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
