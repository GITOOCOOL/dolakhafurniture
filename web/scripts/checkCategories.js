const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'b6iov2to', 
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});

async function run() {
  const data = await client.fetch('*[_type == "category"]{ _id, title, "slug": slug.current }');
  console.log(JSON.stringify(data, null, 2));
}

run().catch(console.error);
