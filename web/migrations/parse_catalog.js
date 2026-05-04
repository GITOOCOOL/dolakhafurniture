const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Configuration
const INPUT_FILE = path.join(__dirname, 'catalog.xlsx');
const OUTPUT_FILE = path.join(__dirname, 'products_to_import.json');

function cleanDescription(html) {
  if (!html) return '';
  return html
    .toString()
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parse() {
  console.log('🛰️ Starting Global Excel Sweep...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: ${INPUT_FILE} not found.`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(INPUT_FILE);
  let allProducts = [];

  workbook.SheetNames.forEach(sheetName => {
    console.log(`🔍 Scanning Sheet: ${sheetName}...`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const sheetProducts = data.map((row, index) => {
      // Mapping based on your specific columns
      const nameEnglish = row['Product Name(English)'] || row['title'];
      const nameNepali = row['*Product Name(Nepali) look function'];
      const productId = row['Product ID'] || row['id'] || `ext-${sheetName}-${index}`;
      
      const title = nameEnglish || nameNepali || '';
      const image1 = row['*Product Images1'] || row['image'] || '';
      const htmlDescription = row['Main Description'] || '';
      const highlights = row['Highlights'] || '';

      if (!title || title === '.') return null;

      return {
        externalId: productId,
        title: title.toString().trim(),
        slug: title.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: cleanDescription(htmlDescription || highlights),
        price: 1,
        images: [image1].filter(Boolean),
        category: row['catId'] || 'Uncategorized',
        isActive: false
      };
    }).filter(Boolean);

    allProducts = allProducts.concat(sheetProducts);
  });

  // Remove duplicates based on externalId
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.externalId, p])).values());

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueProducts, null, 2));
  console.log(`✅ Success! Swept all sheets and extracted ${uniqueProducts.length} UNIQUE products to ${OUTPUT_FILE}`);
}

parse();


