import { defineField, defineType } from "sanity";

export default defineType({
    name: "paymentAccount",
    title: "Payment Account",
    type: "document",
    fields: [
        defineField({
            name: "accountName",
            title: "Account Name",
            type: "string",
        }),
        defineField({
            name: "accountNumber",
            title: "Account Number",
            type: "string",
        }),
        defineField({
            name: "bankNameOrWalletName",
            title: "Bank Name Or Wallet Name",
            type: "string",
        }),
        defineField({
            name: "accountType",
            title: "Account Type",
            type: "string",
            options: {
                list: [
                    { title: "Bank Account", value: "bank" },
                    { title: "Wallet", value: "wallet" },
                ],
            },
        }),
        defineField({
            name: "qrCodeImage",
            title: "QR Code Image",
            type: "image",
        }),
        defineField({
            name: "isActive",
            title: "Is Active",
            type: "boolean",
            initialValue: true,
        }),
    ],
});