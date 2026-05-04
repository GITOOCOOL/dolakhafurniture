const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configuration
const client = createClient({
  projectId: 'b6iov2to',
  dataset: 'production',
  useCdn: false,
  token: 'skX1YY2jNc2jl1T9XsaCViNSEyFHUrAPxQGrWBkrDwOm5tFXntMrfZP6FIJIloN8cvod7DqjVksQr31vIxr46Rw6FGn1MZDgYj8ehVsFbeUrQSqRIW96InqNHyie3xYWtPLq6C9k637gNYDRK8u7XIGIuctyXv8ddVdNoOr7kKNY7Geh5Tge',
  apiVersion: '2024-03-01',
});

async function run() {
  console.log('🩺 Starting Inventory Health Scan...');

  // 1. Fetch all products with their image status
  const products = await client.fetch('*[_type == "product"]{_id, title, mainImage}');
  
  const total = products.length;
  const withImages = products.filter(p => p.mainImage).length;
  const missingImages = products.filter(p => !p.mainImage);

  console.log(`\n--- 📊 INVENTORY REPORT ---`);
  console.log(`Total Products: ${total}`);
  console.log(`✅ With Images: ${withImages}`);
  console.log(`❌ Missing Images: ${missingImages.length}`);
  console.log(`---------------------------\n`);

  if (missingImages.length > 0) {
    const reportPath = path.join(__dirname, 'missing_images_report.txt');
    const list = missingImages.map(p => `- ${p.title} (ID: ${p._id})`).join('\n');
    fs.writeFileSync(reportPath, `PRODUCTS MISSING IMAGES\n\n${list}`);
    console.log(`📝 Full list of missing items saved to: ${reportPath}`);
  } else {
    console.log('✨ Perfection! All products have images.');
  }
}

run();
