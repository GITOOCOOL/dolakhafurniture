const { createClient } = require('@sanity/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function run() {
  console.log('🛰️ Starting Elastic Convergence Protocol: Merging Daraz & Hitech Gold...');

  // 1. Fetch all products
  const products = await client.fetch('*[_type == "product"]{_id, title, images, mainImage}');
  
  const hitechProducts = products.filter(p => p._id.startsWith('hitech-gold-'));
  const darazProducts = products.filter(p => !p._id.startsWith('hitech-gold-') && !p.title.startsWith('reviewTodelete_'));

  console.log(`📊 Found ${hitechProducts.length} Hitech Gold listings and ${darazProducts.length} Daraz listings.`);

  let mergedCount = 0;
  const transaction = client.transaction();

  for (const hitech of hitechProducts) {
    const idParts = hitech._id.split('-');
    const rawCode = idParts[idParts.length - 1];
    
    if (rawCode.toUpperCase() === 'UNNAMED') continue;
    
    // Normalize code for matching (remove all non-alphanumeric)
    const normalizedCode = rawCode.toLowerCase().replace(/[^a-z0-9]/g, '');

    console.log(`\n🔍 Searching for Daraz matches for normalized code: ${normalizedCode}`);

    // Find Daraz products that contain this code when normalized
    const matches = darazProducts.filter(p => {
      const normalizedTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedTitle.includes(normalizedCode);
    });

    if (matches.length > 0) {
      console.log(`✅ Found ${matches.length} matches for ${rawCode}.`);
      
      let allDarazImages = [];
      for (const match of matches) {
        if (match.mainImage) allDarazImages.push(match.mainImage);
        if (match.images) allDarazImages.push(...match.images);
        
        transaction.patch(match._id, {
          set: { 
            title: `reviewTodelete_${match.title}`,
            isActive: false,
            adminPreview: false
          }
        });
      }

      if (allDarazImages.length > 0) {
        const existingImages = hitech.images || [];
        const newImages = [...existingImages];
        
        allDarazImages.forEach(img => {
          const assetId = img.asset?._ref;
          if (assetId && !existingImages.some(ex => ex.asset?._ref === assetId)) {
            newImages.push({
              ...img,
              _key: `merged-${Math.random().toString(36).substring(7)}`,
              isVisible: true
            });
          }
        });

        transaction.patch(hitech._id, {
          set: { images: newImages }
        });
        
        console.log(`🔗 Grafted ${allDarazImages.length} images onto ${hitech.title}.`);
        mergedCount++;
      }
    }
  }

  if (mergedCount > 0) {
    console.log(`\n🚀 Committing ${mergedCount} merges to Sanity...`);
    await transaction.commit();
    console.log('🏁 Elastic Convergence Complete!');
  } else {
    console.log('\n🤷 No matches found to merge.');
  }
}

run().catch(err => {
  console.error('❌ Error during convergence:', err.message);
});
