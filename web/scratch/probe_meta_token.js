const { createClient } = require('@sanity/client');
const fetch = require('node-fetch');

const client = createClient({
  projectId: 'b6iov2to',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-04-24',
  token: process.env.SANITY_API_WRITE_TOKEN || 'skC0Iu9L4Z1m668kXp9L06p8H67Y8p9h9978...your_token...' // Fallback
});

async function probeMetaToken() {
  try {
    console.log('📡 [FORENSIC PROBE] Fetching Facebook Channel from Sanity...');
    const channels = await client.fetch(`*[_type == "socialChannel" && platform == "facebook"]`);
    
    for (const channel of channels) {
      console.log(`🤖 Checking Channel: "${channel.name}" (ID: ${channel.platformId})`);
      const token = channel.accessToken;
      
      if (!token) {
        console.log('❌ No token found for this channel.');
        continue;
      }

      console.log('🛰️ Pinging Meta Debug Engine...');
      // Note: Debugging a token requires the token itself as the input
      const debugRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`);
      const debugData = await debugRes.json();

      if (debugData.error) {
         // If direct debug fails, try "me" info
         const meRes = await fetch(`https://graph.facebook.com/me?fields=name,id,category&access_token=${token}`);
         const meData = await meRes.json();
         console.log('🔎 [ME DATA]:', meData);
         if (meData.id === channel.platformId) {
           console.log('✅ Token matches ID, but permissions might be missing.');
         } else {
           console.log('⚠️ Token belongs to a DIFFERENT identity than the one stored.');
         }
      } else {
         console.log('📊 [DEBUG DATA]:', JSON.stringify(debugData.data, null, 2));
      }
    }
  } catch (err) {
    console.error('🔥 [PROBE FAILED]:', err.message);
  }
}

probeMetaToken();
