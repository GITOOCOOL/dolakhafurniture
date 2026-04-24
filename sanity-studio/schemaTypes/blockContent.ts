import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    },
    { type: 'image', options: { hotspot: true } },
    { type: 'table' }, // THE NEW TABLE TECHNOLOGY
    {
      title: 'Editorial Callout',
      name: 'callout',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Style Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Variant A (Primary)', value: 'variant-a' },
              { title: 'Variant B (Secondary)', value: 'variant-b' },
              { title: 'Variant C (Tertiary)', value: 'variant-c' },
            ],
          },
        },
        { name: 'text', title: 'Text', type: 'text' },
      ],
    },
    {
      title: 'YouTube Embed',
      name: 'youtube',
      type: 'object',
      fields: [
        { name: 'url', title: 'Video URL', type: 'url' },
      ],
    },
  ],
});
