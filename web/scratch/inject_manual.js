const { createClient } = require('@sanity/client');
const { nanoid } = require('nanoid');

const client = createClient({
  projectId: 'b6iov2to',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-04-24',
  token: process.env.SANITY_API_WRITE_TOKEN
});

async function injectLog() {
  const manualBody = `# 🛰️ Dolakha Content Engine (v4.1) Technical Manual

## 🚀 The Multi-Channel Distribution Factory
This engine transforms raw media into tactical assets for Web, Instagram, and Facebook.

---

### 1. 🎞️ Multimodal Intelligence
The engine autonomously detects Video vs. Photo types and optimizes the delivery pipeline:
- **Instagram**: Uses the Container API (Reels/Stories).
- **Facebook**: Uses the Token Exchange identity mask.

### 2. ⭕ Story Circle Protocol
To bypass the standard Facebook Feed and land directly in the "Circle," the engine uses a specialized **Shadow Upload** phase:
- Photo is uploaded as "Hidden" (published: false).
- The Shadow ID is then pulsed to the /photo_stories endpoint.

### 3. 🤖 Cloud Sovereignty (Bot v6.1)
The bot no longer sleeps! It is hosted on GitHub Actions, firing every 5 minutes.
- **AU/NP Timezone Control**: Ensures missions fire at the perfect local time for your audience.
- **Target Injected Credentials**: Direct-from-source Page IDs and Tokens ensure total jurisdictional security.

### 🕹️ How to Deploy
Use the **Social Hub Dashboard** in Sanity. Choose your asset, select your targets, and hit "Initiate Tactical Launch."

*Authenticated & Hardened: April 25, 2026* 🏘️🏮🏙️`;

  const logEntry = {
    _type: 'adminLog',
    _id: 'manual-content-engine-v41',
    title: '🛰️ Technical Manual: Content Engine v4.1',
    timestamp: new Date().toISOString(),
    type: 'Documentation',
    content: manualBody,
    status: 'Info'
  };

  try {
    const result = await client.createOrReplace(logEntry);
    console.log('✅ TECHNICAL MANUAL INJECTEDY TO SANITY: ' + result._id);
  } catch (err) {
    console.error('🔥 INJECTION FAILED:', err.message);
  }
}

injectLog();
