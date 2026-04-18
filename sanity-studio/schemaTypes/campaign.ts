import { defineField, defineType } from "sanity";

export default defineType({
    name: "campaign",
    title: "Campaign",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Campaign Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Campaign Slug",
            type: "slug",
            options: { source: "title" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "status",
            title: "Campaign Status",
            type: "string",
            initialValue: "draft",
            options: {
                list: [
                    { title: "Draft", value: "draft" },
                    { title: "Active", value: "active" },
                    { title: "Paused", value: "paused" },
                    { title: "Completed", value: "completed" },
                ],
            },
        }),
        defineField({
            name: "themeColor",
            title: "Theme Color (Hex)",
            type: "string",
            description: "Hex code for branding (e.g., #a3573a)",
            initialValue: "#a3573a",
        }),
        defineField({
            name: "startDate",
            title: "Start Date",
            type: "datetime",
        }),
        defineField({
            name: "endDate",
            title: "End Date",
            type: "datetime",
        }),
        defineField({
            name: "platforms",
            title: "Campaign Platforms",
            type: "array",
            of: [{ type: "string" }],
            options: {
                list: [
                    { title: "Facebook", value: "facebook" },
                    { title: "Instagram", value: "instagram" },
                    { title: "TikTok", value: "tiktok" },
                    { title: "Google Ads", value: "google" },
                    { title: "Pinterest", value: "pinterest" },
                ],
            },
        }),
        defineField({
            name: "promotedProducts",
            title: "Promoted Products",
            type: "array",
            of: [{ type: "reference", to: [{ type: "product" }] }],
        }),
        defineField({
            name: "vouchers",
            title: "Linked Vouchers/Coupons",
            type: "array",
            of: [{ type: "reference", to: [{ type: "discountVoucher" }] }],
        }),
        defineField({
            name: "tagline",
            title: "Ad Copy / Tagline",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "banner",
            title: "Campaign Banner / Hero Image",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "marketingAssets",
            title: "Marketing Assets (Logos, Graphics, social media)",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        {
                            name: "alt",
                            title: "Alt Text",
                            type: "string",
                        },
                        {
                            name: "assetType",
                            title: "Asset Type",
                            type: "string",
                            options: {
                                list: [
                                    { title: "Square Post (Instagram)", value: "square" },
                                    { title: "Story / Vertical (IG/TikTok)", value: "story" },
                                    { title: "Facebook Banner", value: "fb_banner" },
                                    { title: "Other", value: "other" },
                                ],
                            },
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: "campaignBrief",
            title: "Internal Campaign Brief",
            type: "text",
            description: "Notes for the marketing team about strategy, hashtags, or goals.",
            rows: 5,
        }),
    ],
});
