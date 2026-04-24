const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'b6iov2to',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-04-24',
  token: process.env.SANITY_API_WRITE_TOKEN
});

client.fetch('*[_type == "socialChannel" && platform == "facebook"][0]').then(res => {
  if (res) {
    console.log('✅ FOUND FACEBOOK CHANNEL: ' + res.name);
    console.log('🔑 TOKEN: ' + res.accessToken);
  } else {
    console.log('❌ NO FACEBOOK CHANNEL FOUND');
  }
});
