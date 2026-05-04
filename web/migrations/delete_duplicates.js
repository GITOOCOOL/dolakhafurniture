const { createClient } = require('@sanity/client');

// Configuration
const client = createClient({
  projectId: 'b6iov2to',
  dataset: 'production',
  useCdn: false,
  token: 'skX1YY2jNc2jl1T9XsaCViNSEyFHUrAPxQGrWBkrDwOm5tFXntMrfZP6FIJIloN8cvod7DqjVksQr31vIxr46Rw6FGn1MZDgYj8ehVsFbeUrQSqRIW96InqNHyie3xYWtPLq6C9k637gNYDRK8u7XIGIuctyXv8ddVdNoOr7kKNY7Geh5Tge',
  apiVersion: '2024-03-01',
});

async function run() {
  console.log('🧹 Starting Deduplication Mission...');

  // 1. Fetch all products
  const products = await client.fetch('*[_type == "product"]{_id, title, _createdAt}');
  console.log(`🔍 Found ${products.length} total products. checking for clones...`);

  const groups = {};
  products.forEach(p => {
    const key = p.title.toLowerCase().trim();
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  const toDelete = [];
  let keptCount = 0;

  Object.keys(groups).forEach(title => {
    const group = groups[title];
    if (group.length > 1) {
      // Sort by ID to prioritize our new "product-import-..." IDs
      // and then by creation date.
      group.sort((a, b) => {
        const aIsNew = a._id.startsWith('product-import-');
        const bIsNew = b._id.startsWith('product-import-');
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        return new Date(b._createdAt) - new Date(a._createdAt);
      });

      // Keep the first one, delete the rest
      const [keep, ...duplicates] = group;
      console.log(`⚠️ Found ${group.length} versions of "${keep.title}". Keeping ${keep._id}`);
      duplicates.forEach(d => toDelete.push(d._id));
    }
    keptCount++;
  });

  if (toDelete.length === 0) {
    console.log('✅ No duplicates found. Your Studio is clean!');
    return;
  }

  console.log(`🗑️ Preparing to delete ${toDelete.length} duplicates...`);

  // Delete in batches of 20 for stability
  for (let i = 0; i < toDelete.length; i += 20) {
    const batch = toDelete.slice(i, i + 20);
    const transaction = client.transaction();
    batch.forEach(id => transaction.delete(id));
    await transaction.commit();
    console.log(`✅ Deleted batch ${Math.floor(i/20) + 1}/${Math.ceil(toDelete.length/20)}`);
  }

  console.log(`🏁 Mission Accomplished. Kept ${keptCount} unique products.`);
}

run();
