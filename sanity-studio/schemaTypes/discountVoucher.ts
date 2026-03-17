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
            name: "endsAt",
            title: "Ends At",
            type: "datetime",
        }),
    ],
});
