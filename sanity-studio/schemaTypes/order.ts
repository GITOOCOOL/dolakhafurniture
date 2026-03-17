export default {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    { name: 'supabaseUserId', title: 'Supabase User ID', type: 'string' },
    { name: 'customerName', title: 'Customer Name', type: 'string' },
    { name: 'customerEmail', title: 'Customer Email', type: 'string' },
    { name: 'customerPhone', title: 'Customer Phone', type: 'string' },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'apartment', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'postcode', type: 'string' },
        { name: 'country', type: 'string' },
      ]
    },
    { name: 'shippingMethod', title: 'Shipping Method', type: 'string' },
    { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
    { name: 'totalPrice', title: 'Total Price (NPR)', type: 'number' },
    { name: 'status', title: 'Status', type: 'string', initialValue: 'pending' },
    
    { 
      name: 'orderDate', 
      title: 'Order Date', 
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      }
    },

    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'price', type: 'number' },
          { name: 'quantity', type: 'number' },
          { name: 'productId', type: 'string' }
        ]
      }]
    }
  ]
}
