import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'product',
    title: 'Decor Items',
    type: 'document',
    fieldsets: [
        {
            name: 'specifications',
            title: 'Physical Specifications',
            options: { collapsible: true, collapsed: false }
        }
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Product Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            options: { source: 'title'},
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Price (NPR)',
            type: 'number',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Main/Cover Photo (for cards)',
            type: 'image',
            options: {hotspot: true},
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'images',
            title: 'Gallery Images (for detail page)',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: {hotspot: true},
                    fields: [
                        {
                            name: 'isVisible',
                            type: 'boolean',
                            title: 'Visible in Web UI',
                            initialValue: true,
                        }
                    ]
                }
            ]
        }),
        defineField({
            name: 'category',
            title: 'Category',
            // This is the link to your Category documents
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Story/Description',
            type: 'text',
        }),
        defineField({
            name: 'stock',
            title: 'In Stock Count',
            type: 'number',
            validation: (Rule) => Rule.required(),
            initialValue: 0,
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured Product',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'material',
            title: 'Material',
            type: 'string',
            fieldset: 'specifications',
        }),
        defineField({
            name: 'length',
            title: 'Length (in)',
            type: 'number',
            fieldset: 'specifications',
        }),
        defineField({
            name: 'breadth',
            title: 'Breadth (in)',
            type: 'number',
            fieldset: 'specifications',
        }),
        defineField({
            name: 'height',
            title: 'Height (in)',
            type: 'number',
            fieldset: 'specifications',
        }),
    ],
});
