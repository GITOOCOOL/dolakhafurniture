import { defineType, defineField } from 'sanity'

export const businessMetaData = defineType({
  name: 'businessMetaData',
  title: 'Business Meta Data',
  type: 'document',
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Business Tagline',
      type: 'string',
      description: 'Used for SEO titles and headings (e.g. Quality Handcrafted Furniture)'
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Primary contact phone number'
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Business WhatsApp contact'
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Physical Address',
      type: 'string',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
    }),
    defineField({
      name: 'businessUrl',
      title: 'Business Website URL',
      type: 'url',
      description: 'Primary website URL (e.g. https://yourshop.com)'
    }),
    defineField({
      name: 'messengerUrl',
      title: 'Messenger URL',
      type: 'url',
      description: 'Direct link to Facebook Messenger (e.g. https://m.me/yourpage)'
    }),
    defineField({
      name: 'facebookPixelId',
      title: 'Facebook Pixel ID',
      type: 'string',
      description: 'The Meta Pixel ID for tracking. For maximum stability and speed, also ensure this is set in your .env as NEXT_PUBLIC_FACEBOOK_PIXEL_ID (which will take priority).'
    }),
  ],
})
