import { defineField, defineType } from "sanity";

export default defineType({
    name: "checkoutSettings",
    title: "Checkout Settings",
    type: "document",
    fields: [
        defineField({
            name: "method",
            title: "Checkout Method",
            type: "string",
            initialValue: "standard",
            options: {
                list: [
                    { title: "Standard (Multi-step)", value: "standard" },
                    { title: "Express (One-step)", value: "express" },
                ],
                layout: "radio",
            },
            description: "Switch between the full multi-step checkout and the simplified one-step express checkout.",
        }),
        defineField({
            name: "autoApplyVouchers",
            title: "Auto-apply Vouchers",
            type: "boolean",
            initialValue: true,
            description: "Automatically apply best available vouchers during Express Checkout.",
        }),
    ],
});
