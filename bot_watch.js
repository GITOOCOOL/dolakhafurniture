/**
 * DOLAKHA FURNITURE - LOCAL BOT ALARM
 * This script runs in the background and pokes the social heartbeat API every 5 minutes.
 * To start: node bot_watch.js
 */

const TARGET_URL = 'http://localhost:3000/api/social/cron/heartbeat';
const INTERVAL_MS = 5 * 60 * 1000; // 5 Minutes

console.log('--- 🤖 SanityBot Alarm Clock Active ---');
console.log(`Target: ${TARGET_URL}`);
console.log(`Interval: Every 5 minutes`);
console.log('----------------------------------------');

// The "Tap on the shoulder" function
async function pokeTheBot() {
    const timestamp = new Date().toLocaleTimeString();
    try {
        console.log(`[${timestamp}] 🔔 Poking the Bot...`);
        const response = await fetch(TARGET_URL);
        const data = await response.json();
        
        if (data.processed && data.processed.length > 0) {
            console.log(`[${timestamp}] ✅ Bot detected content!`);
            data.processed.forEach(item => {
                console.log(`   - Broadcasted: "${item.doc}"`);
                console.log(`     FB: ${item.facebook} | IG: ${item.instagram}`);
            });
        } else {
            console.log(`[${timestamp}] 💤 Bot scanned: Nothing scheduled for this window.`);
        }
    } catch (error) {
        console.error(`[${timestamp}] ❌ Heartbeat Failed: Make sure your dev server (localhost:3000) is running!`);
    }
}

// Fire once immediately
pokeTheBot();

// Set up the interval
setInterval(pokeTheBot, INTERVAL_MS);
