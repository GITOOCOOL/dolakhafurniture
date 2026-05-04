const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

const HITECH_LIST_PATH = path.join(__dirname, 'hitech.list');
const IMAGES_BASE_DIR = path.join(__dirname, 'hitech good images');

// Helper to find all folders recursively
function getAllFolders(dir, folderList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      folderList.push({ name: file.toLowerCase().replace(/[^a-z0-9]/g, ''), path: filePath });
      getAllFolders(filePath, folderList);
    }
  }
  return folderList;
}

const ALL_FOLDERS = getAllFolders(IMAGES_BASE_DIR);

async function getCategory(name) {
  const categories = await client.fetch('*[_type == "category"]{title, _id}');
  const chairCat = categories.find(c => c.title.toLowerCase().includes(name.toLowerCase()));
  return chairCat ? chairCat._id : categories[0]?._id;
}

async function uploadImage(imagePath) {
  try {
    if (fs.statSync(imagePath).isDirectory()) return null;
    const imageData = fs.readFileSync(imagePath);
    const asset = await client.assets.upload('image', imageData, {
      filename: path.basename(imagePath)
    });
    return asset._id;
  } catch (err) {
    console.error(`❌ Error uploading ${imagePath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('🚀 Starting Smart-Match Hitech Gold Ingestion...');
  
  const chairCategoryId = await getCategory('Chair');
  console.log(`📂 Using Category ID: ${chairCategoryId}`);

  const content = fs.readFileSync(HITECH_LIST_PATH, 'utf-8');
  const items = content.split(/[\n,]/).map(line => line.trim()).filter(line => line.length > 0);

  console.log(`📋 Found ${items.length} items to process.`);

  for (let i = 0; i < items.length; i++) {
    const originalCode = items[i];
    const isMissingCode = originalCode === '-';
    
    const cleanCode = isMissingCode ? null : originalCode.toLowerCase().replace(/[^a-z0-9]/g, '');
    const productName = isMissingCode ? `Hitech Product ${i + 1}` : originalCode.toUpperCase().replace(/,/g, '');
    
    const productId = `hitech-gold-${i + 1}-${isMissingCode ? 'unnamed' : cleanCode}`;
    
    console.log(`\n📦 Processing [${i + 1}/${items.length}]: ${productName}`);

    let mainImageId = null;
    let galleryImageIds = [];

    // Smart Folder Match
    if (cleanCode) {
      // Find folder that starts with the code OR contains the code
      const matchedFolder = ALL_FOLDERS.find(f => f.name === cleanCode || f.name.startsWith(cleanCode) || cleanCode.startsWith(f.name));
      
      if (matchedFolder) {
        console.log(`🔍 Smart-Matched folder: ${matchedFolder.path}`);
        const files = fs.readdirSync(matchedFolder.path).filter(f => !f.startsWith('.') && !fs.statSync(path.join(matchedFolder.path, f)).isDirectory()).sort();
        
        for (let j = 0; j < files.length; j++) {
          const filePath = path.join(matchedFolder.path, files[j]);
          const assetId = await uploadImage(filePath);
          if (assetId) {
            if (j === 0) {
              mainImageId = assetId;
            } else {
              galleryImageIds.push(assetId);
            }
          }
        }
      } else {
        console.log(`⚠️ No smart-match found for code: ${cleanCode}`);
      }
    }

    const doc = {
      _type: 'product',
      _id: productId,
      title: productName,
      slug: { _type: 'slug', current: productName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7) },
      isActive: false,
      adminPreview: true,
      category: { _type: 'reference', _ref: chairCategoryId },
      price: 999,
      stock: 10,
      description: productName,
    };

    if (mainImageId) {
      doc.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: mainImageId } };
    }
    
    if (galleryImageIds.length > 0) {
      doc.images = galleryImageIds.map(id => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'image',
        asset: { _type: 'reference', _ref: id },
        isVisible: true
      }));
    }

    try {
      await client.createOrReplace(doc);
      console.log(`✅ Success: ${productName} synced to Sanity.`);
    } catch (err) {
      console.error(`❌ Failed: ${productName}`, err.message);
    }
  }

  console.log('\n🏁 Smart-Match Hitech Gold Ingestion Complete!');
}

run();
