export default {
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      description: "System generated unique identifier, or manually enter one for phone orders (e.g., #DF-A4F2)",
    },
    { name: "supabaseUserId", title: "Supabase User ID", type: "string" },
    { name: "customerName", title: "Customer Name", type: "string" },
    { name: "customerEmail", title: "Customer Email", type: "string" },
    { 
      name: "voucherCodes", 
      title: "Applied Voucher Codes", 
      type: "array", 
      of: [{ type: "string" }]
    },
    {
      name: "customerPhone",
      title: "Customer Phone",
      type: "string",
      validation: (Rule: any) =>
        Rule.required()
          .regex(/^9\d{9}$/)
          .error("Must be a valid 10-digit phone number starting with 9"),
    },
    {
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "firstName", type: "string" },
        { name: "lastName", type: "string" },
        { name: "address", type: "string" },
        { name: "apartment", type: "string" },
        { name: "city", type: "string" },
        { name: "state", type: "string" },
        { name: "postcode", type: "string" },
        { name: "country", type: "string" },
      ],
    },
    { name: "shippingMethod", title: "Shipping Method", type: "string" },
    { name: "paymentMethod", title: "Payment Method", type: "string" },
    { name: "totalPrice", title: "Total Price (NPR)", type: "number" },
    {
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "🕒 Pending", value: "pending" },
          { title: "✅ Confirmed", value: "confirmed" },
          { title: "🔨 In Production", value: "production" },
          { title: "🚚 Shipped", value: "shipped" },
          { title: "🏠 Delivered", value: "delivered" },
          { title: "❌ Cancelled", value: "cancelled" },
        ],
        layout: "dropdown",
      },
    },
    {
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
      },
    },
    {
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { 
              name: "product", 
              title: "Link to Store Product (Optional)", 
              type: "reference", 
              to: [{ type: "product" }],
              description: "Select an existing product from the catalog."
            },
            { name: "title", type: "string" },
            { name: "price", type: "number" },
            { name: "quantity", type: "number" },
            { name: "productId", type: 'string' },
            { name: "image", title: "Product Image", type: "image", options: { hotspot: true } },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "orderNumber",
      customerName: "customerName",
      status: "status",
      date: "orderDate",
    },
    prepare({ title, customerName, status, date }: any) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : "";
      return {
        title: title ? `#${title}` : "Untitled Order",
        subtitle: `${customerName || "Guest"} (${status || "pending"})`,
        description: `Date: ${formattedDate}`,
      };
    },
  },
};
