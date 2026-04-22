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
    {
      name: "isPhoneOrder",
      title: "Phone / Manual Order",
      type: "boolean",
      description: "Toggle this ON if you are manually creating this order for a customer.",
      initialValue: false,
    },
    {
      name: "orderSource",
      title: "Order Source",
      type: "string",
      description: "Where did this order originate?",
      initialValue: "website",
      options: {
        list: [
          { title: "🌐 Website", value: "website" },
          { title: "📞 Phone", value: "phone" },
          { title: "💬 WhatsApp", value: "whatsapp" },
          { title: "🚶 Walk-in", value: "walk-in" },
          { title: "🔵 Facebook", value: "facebook" },
        ],
        layout: "dropdown",
      },
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
    { name: "advanceDeposit", title: "Advance Deposit (NPR)", type: "number", initialValue: 0 },
    { name: "discountValue", title: "Discount Amount (NPR)", type: "number", initialValue: 0 },
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
              to: [{ type: "product" }, { type: "customProduct" }],
              description: "Select an existing catalog product or an artisan custom creation."
            },
            { name: "title", type: "string" },
            { name: "price", type: "number" },
            { name: "quantity", type: "number" },
            { name: "productId", type: 'string' },
            { name: "isCustom", title: "Is Custom Creation", type: "boolean", initialValue: false },
            { name: "image", title: "Product Image", type: "image", options: { hotspot: true } },
          ],
        },
      ],
    },
    {
      name: "internalNotes",
      title: "Internal Staff Notes",
      type: "text",
      description: "Hidden from customers. Use for tracking fulfillments, issues, or special requests.",
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
