import { defineField, defineType } from "sanity";

export default defineType({
    name: "inquiry",
    title: "Inquiry",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "phone",
            title: "Phone",
            type: "string",
        }),
        defineField({
            name: "message",
            title: "Message",
            type: "text",
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
        }),
    ],
});
