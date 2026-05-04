const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration - Reading from your .env.local
const client = createClient({
  projectId: 'b6iov2to',
  dataset: 'production',
  useCdn: false,
  token: 'skX1YY2jNc2jl1T9XsaCViNSEyFHUrAPxQGrWBkrDwOm5tFXntMrfZP6FIJIloN8cvod7DqjVksQr31vIxr46Rw6FGn1MZDgYj8ehVsFbeUrQSqRIW96InqNHyie3xYWtPLq6C9k637gNYDRK8u7XIGIuctyXv8ddVdNoOr7kKNY7Geh5Tge',
  apiVersion: '2024-03-01',
});

const INPUT_FILE = path.join(__dirname, 'products_to_import.json');

async function uploadImage(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(url)
    });
    return asset._id;
  } catch (error) {
    console.error(`❌ Failed to upload image: ${url}`, error.message);
    return null;
  }
}

async function run() {
  console.log('🚀 Starting Sanity Bulk Injection...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error('❌ JSON file not found. Run parse_catalog.js first.');
    return;
  }

  const products = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  
  // 1. Ensure a "Bulk Import" category exists
  const categoryId = 'category-bulk-import';
  await client.createIfNotExists({
    _id: categoryId,
    _type: 'category',
    title: 'Bulk Import',
    slug: { _type: 'slug', current: 'bulk-import' }
  });

  for (const item of products) {
    console.log(`📦 Processing: ${item.title}...`);

    try {
      let mainImageId = null;
      if (item.images && item.images[0]) {
        mainImageId = await uploadImage(item.images[0]);
      }

      const doc = {
        _type: 'product',
        _id: `product-import-${item.externalId}`, // DETERMINISTIC ID
        title: item.title,
        slug: { _type: 'slug', current: item.slug },
        price: 1, // Minimum required
        isActive: false, // Hidden for safety
        description: item.description,
        stock: 0,
        category: {
          _type: 'reference',
          _ref: categoryId
        },
        mainImage: mainImageId ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: mainImageId
          }
        } : undefined
      };

      const result = await client.createOrReplace(doc); // UPSERT MODE
      console.log(`✅ Synced ${result.title} (ID: ${result._id})`);

    } catch (error) {
      console.error(`❌ Failed to import ${item.title}:`, error.message);
    }
  }

  console.log('🏁 Mission Accomplished. All products injected as Drafts.');
}

run();
