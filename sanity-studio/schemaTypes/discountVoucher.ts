import { defineField, defineType } from "sanity";

export default defineType({
    name: "discountVoucher",
    title: "Discount Voucher",
    type: "document",
    fields: [
        defineField({
            name: "code",
            title: "Code",
            type: "string",
        }),
        defineField({
            name: "isFirstOrderVoucher",
            title: "Is First-Order Voucher",
            type: "boolean",
            initialValue: false,
            description: "If active, this voucher acts as a 'First Order' discount. It will be shown to guests and automatically forces a 'One-time use per customer' rule.",
        }),
        defineField({
            name: "isOneTimePerCustomer",
            title: "One-time use per customer",
            type: "boolean",
            initialValue: false,
            readOnly: ({ parent }) => parent?.isFirstOrderVoucher === true,
            description: "If active, this voucher can only be used once per logged-in account. (Note: Automatically enabled for First-Order Vouchers).",
        }),
        defineField({
            name: "discountType",
            title: "Discount Type",
            type: "string",
            options: {
                list: [
                    { title: "Percentage", value: "percentage" },
                    { title: "Fixed Amount", value: "fixed" },
                ],
            },
        }),
        defineField({
            name: "discountValue",
            title: "Discount Value",
            type: "number",
        }),
        defineField({
            name: "isActive",
            title: "Is Active",
            type: "boolean",
            initialValue: true,
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
        }),
        defineField({
            name: "startsImmediately",
            title: "Start Immediately",
            type: "boolean",
            initialValue: true,
            description: "If active, the voucher is valid as soon as it is published.",
        }),
        defineField({
            name: "startsAt",
            title: "Starts At",
            type: "datetime",
            hidden: ({ parent }) => parent?.startsImmediately === true,
            description: "Scheduled start date and time for this voucher.",
        }),
        defineField({
            name: "neverExpires",
            title: "No Expiry Date",
            type: "boolean",
            initialValue: true,
            description: "If active, this voucher will never expire.",
        }),
        defineField({
            name: "endsAt",
            title: "Ends At",
            type: "datetime",
            hidden: ({ parent }) => parent?.neverExpires === true,
            description: "The exact date and time this voucher should stop working.",
        }),
        defineField({
            name: "details",
            title: "Voucher Terms / Details",
            type: "text",
            description: "Describe the terms, e.g. 'Valid for orders above Rs. 10,000'",
            rows: 2,
        }),
    ],
});
