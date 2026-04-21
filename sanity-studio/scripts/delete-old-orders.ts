import { getCliClient } from 'sanity/cli'

/**
 * delete-old-orders.ts
 * 
 * Safely deletes all documents of type 'order' where 'orderDate' is 
 * before 2026-04-20. 
 * 
 * Run with: npx sanity exec scripts/delete-old-orders.ts --with-user-token
 */

const client = getCliClient()

async function deleteOldOrders() {
  // 1. Strict Query: Only 'order' type and before the specific date
  const query = '*[_type == "order" && orderDate < "2026-04-20"]._id'
  
  console.log('--- Order Deletion Task ---')
  console.log('Query:', query)
  
  try {
    const ids = await client.fetch(query)

    if (!ids || ids.length === 0) {
      console.log('Result: No orders found matching the criteria.')
      process.exit(0)
    }

    console.log(`Result: Found ${ids.length} orders to delete.`)
    console.log('Target IDs:', ids)

    // 2. Batch Deletion via Transaction
    const transaction = client.transaction()
    ids.forEach((id) => {
      transaction.delete(id)
    })

    console.log('Committing deletion transaction...')
    await transaction.commit()
    
    console.log('Success: All targeted orders have been deleted.')
  } catch (err) {
    console.error('Error during deletion:', err.message)
    process.exit(1)
  }
}

deleteOldOrders()
