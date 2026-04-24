import React from 'react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'socialChannel',
  title: 'Social Distribution Channel',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Channel Name',
      type: 'string',
      description: 'e.g., "Dolakha Main", "Galli Nepal", "Testing Ground"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Website', value: 'website' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platformId',
      title: 'Channel/Page ID',
      type: 'string',
      description: 'The unique ID from the platform (e.g., Facebook Page ID)',
      hidden: ({ parent }) => parent?.platform === 'website',
      validation: (Rule) => Rule.custom((value, context: any) => {
        if (context.parent?.platform !== 'website' && !value) return 'Required for Social Channels';
        return true;
      }),
    }),
    defineField({
      name: 'accessToken',
      title: 'Access Token / Key',
      type: 'string',
      description: 'Authentication token for this specific channel.',
      hidden: ({ parent }) => parent?.platform === 'website',
      validation: (Rule) => Rule.custom((value, context: any) => {
        if (context.parent?.platform !== 'website' && !value) return 'Required for Social Channels';
        return true;
      }),
      components: {
        input: (props: any) => {
          const { renderDefault, elementProps } = props;
          return renderDefault({
            ...props,
            elementProps: { ...elementProps, type: 'password' },
          });
        },
      },
    }),
    defineField({
      name: 'targetUrl',
      title: 'Target Webhook / API URL',
      type: 'url',
      description: 'Where should the content be sent? (e.g., https://your-site.com/api/blog)',
      hidden: ({ parent }) => parent?.platform !== 'website',
      validation: (Rule) => Rule.custom((value, context: any) => {
        if (context.parent?.platform === 'website' && !value) return 'Required for Website Channels';
        return true;
      }),
    }),
    defineField({
      name: 'isActive',
      title: 'Channel Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      platform: 'platform',
    },
    prepare({ title, platform }) {
      const icons: any = { facebook: '🔵', instagram: '📸', tiktok: '🎵', youtube: '🔴' }
      return {
        title: title,
        subtitle: `${icons[platform] || '📡'} ${platform.toUpperCase()}`,
      };
    },
  },
});
