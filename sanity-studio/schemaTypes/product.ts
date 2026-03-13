import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'product',
    title: 'Decor Items',
    type: 'document',
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
            title: 'Main Photo',
            type: 'image',
            options: {hotspot: true},
            validation: (Rule) => Rule.required(),
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
    ],
});
