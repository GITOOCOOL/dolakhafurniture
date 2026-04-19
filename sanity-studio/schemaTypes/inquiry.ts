import { defineField, defineType } from "sanity";

export default defineType({
    name: "inquiry",
    title: "Inquiry",
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
                    { title: "📦 Order Question", value: "order" },
                    { title: "🪑 Product Customization", value: "custom" },
                    { title: "❓ General FAQ", value: "general" },
                    { title: "🏢 Bulk / Corporate", value: "bulk" },
                ]
            }
        }),
        defineField({
            name: "orderReference",
            title: "Order Reference",
            type: "string",
            description: "Selected order number for context"
        }),
        defineField({
            name: "topic",
            title: "FAQ Topic",
            type: "string",
            description: "Selected FAQ category"
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
        }),
    ],
});
