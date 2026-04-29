import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";

export default defineType({
  name: "contentIdea",
  title: "Content Ideas",
  type: "document",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "title",
      title: "Idea Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., Time-lapse of sofa cushion filling"
    }),
    defineField({
      name: "contentType",
      title: "Content Format",
      type: "string",
      options: {
        list: [
          { title: "🤳 Story (Short-term)", value: "story" },
          { title: "🎥 Reel (Permanent Video)", value: "reel" },
          { title: "📸 Static Social Post", value: "post" },
          { title: "📖 Blog Post / Article", value: "blog" },
          { title: "🚩 Campaign Media (Banner/Ad)", value: "campaign" },
          { title: "🪑 Product Content (Catalog/Detail)", value: "product_content" },
        ]
      },
      initialValue: "reel"
    }),
    defineField({
      name: "linkedProducts",
      title: "Linked Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Which products is this content specifically for?"
    }),
    defineField({
      name: "description",
      title: "Core Concept",
      type: "text",
      rows: 3,
      description: "Quick summary of what happens in the content."
    }),
    defineField({
      name: "platform",
      title: "Target Platforms",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Instagram Reels", value: "instagram_reels" },
          { title: "Instagram Stories", value: "instagram_stories" },
          { title: "Facebook Feed", value: "facebook_feed" },
          { title: "TikTok", value: "tiktok" },
          { title: "YouTube Shorts", value: "youtube_shorts" },
        ]
      }
    }),
    defineField({
      name: "priority",
      title: "Priority Level",
      type: "string",
      options: {
        list: [
          { title: "🔥 High", value: "high" },
          { title: "⚡ Medium", value: "medium" },
          { title: "🧊 Low", value: "low" },
        ],
        layout: "radio"
      },
      initialValue: "medium"
    }),
    defineField({
      name: "status",
      title: "Workflow Status",
      type: "string",
      options: {
        list: [
          { title: "📋 Backlog", value: "backlog" },
          { title: "🔍 Researching", value: "researching" },
          { title: "🎬 Ready to Shoot", value: "ready" },
          { title: "✂️ Editing", value: "editing" },
          { title: "✅ Completed", value: "completed" },
        ],
        layout: "dropdown"
      },
      initialValue: "backlog"
    }),
    defineField({
      name: "mediaType",
      title: "Moodboard Media Type",
      type: "string",
      options: {
        list: [
          { title: "📸 Photo", value: "photo" },
          { title: "🎥 Video", value: "video" },
        ],
        layout: "radio"
      },
      initialValue: "photo"
    }),
    defineField({
      name: "referenceImage",
      title: "Visual Reference / Moodboard (Photo)",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === "video"
    }),
    defineField({
      name: "referenceVideo",
      title: "Visual Reference / Moodboard (Video)",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.mediaType === "photo"
    }),
    defineField({
      name: "script",
      title: "Content Script / Voiceover Copy",
      type: "text",
      rows: 5,
      description: "The spoken script or on-screen text for audio generation."
    }),
    defineField({
      name: "inspirations",
      title: "Inspiration Links",
      type: "array",
      of: [{ type: "url" }],
      description: "URLs to Reels, TikToks, or YouTube videos that inspired this idea."
    }),
    defineField({
      name: "notes",
      title: "Production Notes",
      type: "text",
      description: "Any special gear, locations, or props needed."
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      media: "referenceImage"
    },
    prepare({ title, status, media }) {
      const statusMap: any = {
        backlog: "📋",
        researching: "🔍",
        ready: "🎬",
        editing: "✂️",
        completed: "✅"
      };
      return {
        title,
        subtitle: `${statusMap[status] || "💡"} ${status?.toUpperCase()}`,
        media
      };
    }
  }
});
