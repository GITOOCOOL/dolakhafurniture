import { defineField, defineType } from "sanity";

export default defineType({
    name: "faq",
    title: "FAQs & Instant Responses",
    type: "document",
    fields: [
        defineField({
            name: "question",
            title: "Question",
            type: "string",
            description: "The common question customers ask"
        }),
        defineField({
            name: "answer",
            title: "Instant Response (Answer)",
            type: "text",
            description: "The automated answer that will appear instantly when this topic is selected."
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    { title: "Delivery & Shipping", value: "delivery" },
                    { title: "Materials & Care", value: "materials" },
                    { title: "Custom Orders", value: "custom" },
                    { title: "Returns & Warranty", value: "returns" },
                ]
            }
        }),
    ],
    preview: {
        select: {
            title: "question",
            subtitle: "category"
        }
    }
});
