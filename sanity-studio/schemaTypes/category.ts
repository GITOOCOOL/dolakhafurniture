import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'The story or craft details for this category (displayed on desktop).',
      type: 'text',
    }),
    defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            options: { source: 'title'},
            validation: (Rule) => Rule.required(),
        }),
  ]
})
