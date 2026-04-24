import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'socialMedia',
  title: 'Social Content Hub',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Content Title / Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The internal name or blog headline.'
    }),
    defineField({
      name: 'type',
      title: 'Primary Content Format',
      type: 'string',
      options: {
        list: [
          { title: 'Story (Short-term)', value: 'story' },
          { title: 'Reel (Permanent)', value: 'reel' },
          { title: 'Blog Post (Article)', value: 'blog' },
          { title: 'Post (Static)', value: 'post' },
        ],
        layout: 'radio',
      },
      initialValue: 'reel',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Sub-headline',
      type: 'string',
      description: 'A catchy summary for the blog list view.',
      hidden: ({ document }) => document?.type !== 'blog',
    }),
    defineField({
      name: 'body',
      title: 'Blog Content / Body',
      type: 'blockContent',
      description: '📡 UNIVERSAL CONTENT PORT: This field outputs structured JSON.',
      hidden: ({ document }) => document?.type !== 'blog',
    }),
    defineField({
      name: 'mediaType',
      title: 'Tactical Media Mode',
      type: 'string',
      options: {
        list: [
          { title: '🎞️ VIDEO (Reel/Video Story)', value: 'video' },
          { title: '📸 PHOTO (Static Story/Post)', value: 'photo' }
        ],
        layout: 'radio'
      },
      initialValue: 'video'
    }),
    defineField({
      name: 'masterMedia',
      title: 'Video Asset (Reel/Video Story) 🎞️',
      description: 'Upload or select your high-definition video.',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      hidden: ({ document }) => document?.mediaType !== 'video'
    }),
    defineField({
      name: 'imageMedia',
      title: 'Image Asset (Static Story/Post) 📸',
      description: 'Select your static image from the library.',
      type: 'image',
      options: {
        hotspot: true
      },
      hidden: ({ document }) => document?.mediaType !== 'photo'
    }),
    defineField({
      name: 'thumbnail',
      title: 'Poster / Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'The preview image for the reel or the main header image for the blog.'
    }),
    defineField({
      name: 'caption',
      title: 'Caption / Meta Description',
      type: 'text',
      description: 'For socials: the text below. For blogs: the SEO meta description.',
    }),
    defineField({
      name: 'hashtags',
      title: 'Hashtags / Context Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'linkedProducts',
      title: 'Shop the Look / Mentioned Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Tag products seen in the video or article.',
      hidden: ({ document }) => document?.type === 'blog' || document?.type === 'post',
    }),
    defineField({
      name: 'isActive',
      title: 'Visible on Web (Public Frontend Gatekeeper)',
      type: 'boolean',
      initialValue: true,
      description: 'FRONTEND UNLOCK: If TRUE, content appears in the /stories hub.'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'thumbnail'
    },
    prepare({ title, type, media }) {
      const icons: any = { story: '🤳', reel: '🎥', blog: '📖', post: '📸' };
      return {
        title: title || 'Untitled Content',
        subtitle: `${icons[type] || '📡'} ${String(type || '').toUpperCase()}`,
        media: media
      }
    }
  }
});
