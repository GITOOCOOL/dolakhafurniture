import { defineField, defineType } from "sanity";

export default defineType({
    name: "material",
    title: "Material Registry",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Material Name",
            type: "string",
            validation: (Rule) => Rule.required(),
            description: "e.g., Greenlam Marble, Navy Velvet, Solid Oak"
        }),
        defineField({
            name: "type",
            title: "Material Type",
            type: "string",
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: "🪑 Wood / Timber", value: "wood" },
                    { title: "🧪 Formica / Laminate", value: "formica" },
                    { title: "🧵 Fabric / Textile", value: "fabric" },
                    { title: "⚙️ Metal / Hardware", value: "metal" },
                    { title: "✨ Other", value: "other" },
                ]
            }
        }),
        defineField({
            name: "brand",
            title: "Brand / Manufacturer",
            type: "string",
            description: "e.g., Greenlam, Merino, Sunmica"
        }),
        defineField({
            name: "colorCode",
            title: "Color / Design Code",
            type: "string",
            description: "The specific catalog code (e.g., GH-402, Glossy White)"
        }),
        defineField({
            name: "swatch",
            title: "Material Swatch / Sample",
            type: "image",
            options: { hotspot: true },
            description: "Upload a photo of the texture or color sample."
        }),
    ],
    preview: {
        select: {
            title: "title",
            type: "type",
            media: "swatch",
            brand: "brand"
        },
        prepare({ title, type, media, brand }) {
            const types: Record<string, string> = {
                wood: "Wood",
                formica: "Formica",
                fabric: "Fabric",
                metal: "Metal",
                other: "Other"
            };
            return {
                title: title,
                subtitle: `${types[type] || "Material"} ${brand ? `— ${brand}` : ""}`,
                media: media
            };
        }
    }
});
