import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'bulletin',
    title: 'Bulletin',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'text',
        }),
        defineField({
            name: 'bulletinType',
            title: 'Bulletin Type',
            type: 'string',
            options: {
                list: [
                    { title: 'News', value: 'news' },
                    { title: 'Event', value: 'event' },
                    { title: 'Promotion', value: 'promotion' },
                ],
            },
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
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: new Date().toISOString(),
        }),
    ],
});