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
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'syncToFacebook',
            title: 'Sync to Facebook/Instagram',
            type: 'boolean',
            initialValue: true,
            description: 'If turned on, this product will be included in the automated Facebook catalog feed.'
        }),
        defineField({
            name: 'isActive',
            title: 'Active on Website',
            type: 'boolean',
            initialValue: true,
            description: 'If turned off, this product will be hidden from the website (Home, Categories, and Search).'
        }),
        defineField({
            name: 'mainImage',
            title: 'Main/Cover Photo (for cards)',
            type: 'image',
            options: {hotspot: true},
            description: 'Best Ratio: 4:5 (1200x1500px) or 1:1 (1200x1200px). Use 4:5 for a taller, premium look.',
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
            name: 'lastRestocked',
            title: 'Last Restocked Date',
            type: 'datetime',
            description: 'Can be set manually when new inventory arrives.',
            options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm',
            }
        }),
        defineField({
            name: 'costPrice',
            title: 'Cost Price (NPR)',
            type: 'number',
            description: 'Internal use only. Used to calculate margin and profits.',
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
