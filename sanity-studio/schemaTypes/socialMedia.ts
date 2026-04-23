import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'socialMedia',
  title: 'Social Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (Internal)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Used to identify this content in the Studio (e.g., "New Sofa Reel")'
    }),
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Story (Ephemeral look)', value: 'story' },
          { title: 'Reel (Permanent vertical video)', value: 'reel' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoFile',
      title: '🎥 Video Source (for Website) (Optional)',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Upload the vertical (9:16) video here. This file will be used to play the video directly on your website for maximum speed.',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail / Poster (Optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Shown while video is loading or in the gallery.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption (Optional)',
      type: 'text',
      rows: 3,
      description: 'Short description for the video.',
    }),
    defineField({
      name: 'externalUrl',
      title: '🔗 Reference Link (External Post) (Optional)',
      type: 'url',
      description: 'Optional: Paste the link to the already published post on Facebook/Instagram here. It will create a "View on Social" button on your website.',
    }),
    defineField({
      name: 'linkedProducts',
      title: 'Linked Products (Optional)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Tag products shown in this video to make it shoppable.',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active (Optional)',
      type: 'boolean',
      initialValue: true,
      description: 'If turned OFF, this content will be hidden from your website immediately.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on Home Page (Optional)',
      type: 'boolean',
      initialValue: false,
      description: 'Prioritizes this video and ensures it appears first in your website galleries.',
    }),
    defineField({
      name: 'publishDate',
      title: 'Website Publish Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'distribution',
      title: '📱 Social Command Center (Auto-Broadcasting)',
      type: 'object',
      description: 'Track and trigger the publishing of this content to your social pages. Use the "Broadcast" buttons in the sidebar on the right.',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook Page',
          type: 'object',
          fields: [
            { 
              name: 'status', 
              title: 'Status', 
              type: 'string', 
              initialValue: 'draft', 
              options: { list: ['draft', 'published', 'failed'] },
              description: 'This updates automatically when you use the Broadcast button. Leave as "Draft" if you are not posting to Facebook.'
            },
            { name: 'postId', title: 'Facebook Reel ID', type: 'string', readOnly: true, description: 'Automatically filled after using the Broadcast button.' },
            { name: 'storyId', title: 'Facebook Story ID', type: 'string', readOnly: true, description: 'Automatically filled after using the "Broadcast to FB Story" button.' },
            { name: 'publishedAt', title: 'Published At', type: 'datetime', readOnly: true, description: 'Automatically filled after using the Broadcast button.' },
          ]
        },
        {
          name: 'instagram',
          title: 'Instagram Business',
          type: 'object',
          fields: [
            { 
              name: 'status', 
              title: 'Status', 
              type: 'string', 
              initialValue: 'draft', 
              options: { list: ['draft', 'published', 'failed'] },
              description: 'This updates automatically when you use the Broadcast button. Leave as "Draft" if you are not posting to Instagram.'
            },
            { name: 'postId', title: 'Instagram Reel ID', type: 'string', readOnly: true, description: 'Automatically filled after using the Broadcast button.' },
            { name: 'storyId', title: 'Instagram Story ID', type: 'string', readOnly: true, description: 'Automatically filled after using the "Broadcast to IG Story" button.' },
            { name: 'publishedAt', title: 'Published At', type: 'datetime', readOnly: true, description: 'Automatically filled after using the Broadcast button.' },
          ]
        },
        {
          name: 'tiktok',
          title: 'TikTok Store',
          type: 'object',
          fields: [
            { 
              name: 'status', 
              title: 'Status', 
              type: 'string', 
              initialValue: 'draft', 
              options: { list: ['draft', 'published', 'failed'] },
              description: 'This updates automatically when you use the Broadcast button. Leave as "Draft" if you are not posting to TikTok.'
            },
            { name: 'postId', title: 'TikTok Video ID', type: 'string', readOnly: true, description: 'Automatically filled after using the Broadcast button.' },
            { name: 'publishedAt', title: 'Published At', type: 'datetime', readOnly: true, description: 'Automatically filled after using the Broadcast button.' },
          ]
        }
      ],
      options: {
        collapsible: true,
        collapsed: false,
      }
    }),
    defineField({
      name: 'hashtags',
      title: '📋 Recommended Hashtags (Optional)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Add hashtags without the # symbol. These will be automatically included when broadcasting to social media.',
    }),
    defineField({
      name: 'automation',
      title: '🤖 Bot Automation (Scheduling & Recurrence)',
      type: 'object',
      description: 'Set up your Bot to automatically broadcast this content on a recurring schedule.',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Automation',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'scheduledTime',
          title: 'Scheduled Time (Daily)',
          type: 'string',
          placeholder: '10:00',
          description: 'Format: HH:mm (24h clock). E.g., 10:00 or 20:30.',
        },
        {
            name: 'scheduledDays',
            title: 'Days of the Week',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
              list: [
                { title: 'Monday', value: 'monday' },
                { title: 'Tuesday', value: 'tuesday' },
                { title: 'Wednesday', value: 'wednesday' },
                { title: 'Thursday', value: 'thursday' },
                { title: 'Friday', value: 'friday' },
                { title: 'Saturday', value: 'saturday' },
                { title: 'Sunday', value: 'sunday' },
              ]
            }
        },
        {
          name: 'endDate',
          title: 'Automation End Date',
          type: 'date',
          description: 'The Bot will stop recurring after this date.',
        },
        {
          name: 'lastRun',
          title: 'Last Bot Run',
          type: 'datetime',
          readOnly: true,
        }
      ],
      options: {
        collapsible: true,
        collapsed: true,
      }
    }),
    defineField({
      name: 'marketingBrief',
      title: 'Internal Marketing Brief (Optional)',
      type: 'text',
      rows: 4,
      description: 'Notes for the team, or campaign strategy.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'thumbnail',
    },
    prepare({ title, type, media }) {
      return {
        title: title,
        subtitle: type ? type.toUpperCase() : 'Social Content',
        media: media,
      };
    },
  },
});
