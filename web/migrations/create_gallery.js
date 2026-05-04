const fs = require("fs");
const path = require("path");

const dir = "raw_photos";
const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("photo_"))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Dolakha Photo Index</title>
    <style>
        body { font-family: sans-serif; background: #111; color: #fff; padding: 20px; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .item { background: #222; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #333; }
        img { max-width: 100%; border-radius: 4px; height: 180px; object-fit: contain; background: #fff; }
        .name { margin-top: 10px; font-weight: bold; color: #00ffcc; font-size: 1.2em; }
    </style>
</head>
<body>
    <h1>🛰️ Dolakha Furniture - Visual Ingestion Index</h1>
    <p>Match these numbers to your catalog codes!</p>
    <div class="gallery">
`;

files.forEach((f) => {
  html += `
    <div class="item">
        <img src="${f}" />
        <div class="name">${f}</div>
    </div>
  `;
});

html += `
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(dir, "index.html"), html);
console.log("✅ Visual Index created at: web/migrations/raw_photos/index.html");
