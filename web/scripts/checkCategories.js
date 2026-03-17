const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-01-01',
  useCdn: true,
});

async function run() {
  const data = await client.fetch('*[_type == "category"]{ _id, title, "slug": slug.current }');
  console.log(JSON.stringify(data, null, 2));
}

run().catch(console.error);
