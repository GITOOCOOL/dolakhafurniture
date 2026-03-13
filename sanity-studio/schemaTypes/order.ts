export default {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    { name: 'supabaseUserId', title: 'Supabase User ID', type: 'string' },
    { name: 'customerName', title: 'Customer Name', type: 'string' },
    { name: 'totalPrice', title: 'Total Price (NPR)', type: 'number' },
    { name: 'status', title: 'Status', type: 'string', initialValue: 'paid' },
    
    // ADD THIS FIELD TO REMOVE THE WARNING
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
          { name: 'quantity', type: 'number' }
        ]
      }]
    }
  ]
}
