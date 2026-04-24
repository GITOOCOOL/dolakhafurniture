/**
 * ⚡️ NITRO PULSAR (BOT V2)
 * Native Version (No dependencies required for Node 18+)
 */

const HEARTBEAT_URL = 'http://localhost:3000/api/social/cron/heartbeat';
const PULSE_MS = 60000; // 1 Minute

async function pulse() {
  const timestamp = new Date().toLocaleTimeString();
  process.stdout.write(`\r[📡 PULSE] ${timestamp} - Pinging Heartbeat... `);

  try {
    const response = await fetch(HEARTBEAT_URL);
    const data = await response.json();

    if (data.report && data.report.length > 0) {
      console.log('\n\x1b[32m%s\x1b[0m', '🚀 MISSION DETECTED & EXECUTED!');
      console.table(data.report.map(r => ({ 
        Mission: r.mission, 
        Targets: r.results.length,
        Status: 'Success' 
      })));
    } else if (data.message) {
       // All quiet
    } else {
       console.log('\n\x1b[33m%s\x1b[0m', '💤 Heartbeat silent: No missions due.');
    }
  } catch (err) {
    console.error('\n\x1b[31m%s\x1b[0m', `❌ PULSE FAILED: ${err.message}`);
    console.log('Ensure your Next.js server is running on http://localhost:3000');
  }
}

console.log('\x1b[36m%s\x1b[0m', '🏮 DOLAKHA OMNI-CHANNEL NITRO PULSAR ACTIVE');
console.log('--------------------------------------------');
console.log(`Target: ${HEARTBEAT_URL}`);
console.log(`Frequency: Every ${PULSE_MS / 1000}s`);
console.log('--------------------------------------------\n');

// Start the pulse
pulse();
setInterval(pulse, PULSE_MS);
