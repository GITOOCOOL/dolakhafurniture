import { defineField, defineType } from "sanity";

export default defineType({
    name: "customProduct",
    title: "Artisan Custom Creation",
    type: "document",
    fieldsets: [
        {
            name: "specifications",
            title: "Physical Specifications",
            options: { collapsible: true, collapsed: false }
        }
    ],
    fields: [
        defineField({
            name: "title",
            title: "Creation Name",
            type: "string",
            validation: (Rule) => Rule.required(),
            description: "e.g., Custom Walnut Dining Table - 8 Seater"
        }),
        defineField({
            name: "price",
            title: "Final Agreed Price (NPR)",
            type: "number",
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: "mainImage",
            title: "Reference Photo / Blueprint",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "description",
            title: "Artisan Notes / Specs",
            type: "text",
            description: "Detailed description of the custom work, special instructions, or client requests."
        }),
        defineField({
            name: "material",
            title: "Primary Material",
            type: "string",
            fieldset: "specifications",
            initialValue: "Solid Wood"
        }),
        defineField({
            name: "color",
            title: "Finish / Color",
            type: "string",
            fieldset: "specifications",
            description: "e.g., Dark Walnut Finish, Matte Black"
        }),
        defineField({
            name: "formica",
            title: "Formica / Laminate Selection",
            type: "reference",
            to: [{ type: "material" }],
            options: {
              filter: 'type == "formica"'
            },
            fieldset: "specifications",
            description: "Select from the Formica Registry"
        }),
        defineField({
            name: "fabric",
            title: "Fabric / Textile Selection",
            type: "reference",
            to: [{ type: "material" }],
            options: {
              filter: 'type == "fabric"'
            },
            fieldset: "specifications",
            description: "Select from the Fabric Registry"
        }),
        defineField({
            name: "length",
            title: "Length (in)",
            type: "number",
            fieldset: "specifications",
        }),
        defineField({
            name: "breadth",
            title: "Breadth (in)",
            type: "number",
            fieldset: "specifications",
        }),
        defineField({
            name: "height",
            title: "Height (in)",
            type: "number",
            fieldset: "specifications",
        }),
        defineField({
            name: "status",
            title: "Production Status",
            type: "string",
            initialValue: "quoted",
            options: {
                list: [
                    { title: "🏁 Quoted", value: "quoted" },
                    { title: "🔨 In Production", value: "production" },
                    { title: "🎨 Finishing", value: "finishing" },
                    { title: "✅ Completed", value: "completed" },
                ]
            }
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: (new Date()).toISOString(),
        }),
    ],
    preview: {
        select: {
            title: "title",
            material: "material",
            media: "mainImage",
            price: "price"
        },
        prepare({ title, material, media, price }) {
            return {
                title: title,
                subtitle: `${material || "Custom"} — Rs. ${price || 0}`,
                media: media
            };
        }
    }
});
