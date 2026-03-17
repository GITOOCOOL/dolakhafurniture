import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'promotion',
    title: 'Promotion',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'string'
        }),
        defineField({
            name: 'buttonText',
            title: 'Button Text',
            type: 'string',
        }),
        defineField({
            name: 'buttonLink',
            title: 'Button Link',
            type: 'string',
        }),
        defineField({
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
        }),
        defineField({
            name: 'endsAt',
            title: 'Ends At',
            type: 'datetime',
        }),
    ],
});