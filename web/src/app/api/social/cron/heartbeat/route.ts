import { NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity';
import { nanoid } from 'nanoid';

/**
 * OMNI-CHANNEL BOT HEARTBEAT (V6.1 - RESULTS POLISHED)
 * This route manages multi-continent tactical missions by context-switching timezones.
 */
export async function GET() {
  try {
    const rawNow = new Date();
    console.log(`[📡 PULSE] Universal UTC Scan starting at ${rawNow.toISOString()}`);

    // 1. Fetch ALL Missions in Autopilot
    const missions = await client.fetch(`
      *[_type == "broadcast" && automation.isEnabled == true] {
        _id,
        title,
        targets,
        automation,
        "payload": content-> {
          _id,
          title,
          caption,
          "videoUrl": coalesce(masterMedia.asset->url, imageMedia.asset->url),
          hashtags
        }
      }
    `);

    if (!missions || missions.length === 0) {
       console.log('🤖 BOT STATUS: 0 active missions currently armed.');
       return NextResponse.json({ message: 'Fleet is dormant.' });
    }

    const channels = await client.fetch(`*[_type == "socialChannel" && isActive == true]`);
    const report = [];
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 2. TACTICAL LOOP: Process each mission in its OWN local context
    for (const mission of missions) {
      const { 
        timezone = 'UTC', 
        scheduledTime, 
        frequency, 
        recurringDays, 
        dayOfMonth, 
        lastRun, 
        startDate, 
        endDate, 
        isFastTrack 
      } = mission.automation || {};

      // --- CALCULATE LOCAL MISSION CONTEXT ---
      const tzOptions: any = { timeZone: timezone };
      const localNowStr = rawNow.toLocaleDateString('en-CA', tzOptions); 
      const localDay = rawNow.toLocaleDateString('en-US', { weekday: 'long', ...tzOptions }).toLowerCase();
      const localDate = parseInt(rawNow.toLocaleDateString('en-US', { day: 'numeric', ...tzOptions }));
      const localHour = rawNow.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false, ...tzOptions }).padStart(2, '0');
      const localMin = rawNow.toLocaleTimeString('en-US', { minute: '2-digit', ...tzOptions }).padStart(2, '0');
      const localTimeShort = `${localHour}:${localMin}`;

      console.log(`🛰️ [${mission.title}] Context: ${timezone} | Local: ${localDay} ${localNowStr} ${localTimeShort}`);

      // --- GATING LOGIC ---
      
      // A. Window Gates
      if (startDate && localNowStr < startDate) {
        console.log(`   ⏭️ Blocked: Awaiting start date (${startDate})`);
        continue;
      }
      if (endDate && localNowStr > endDate) {
        console.log(`   ⏭️ Blocked: Mission expired (${endDate})`);
        continue;
      }

      // B. Fast-Track Bypass
      let shouldFire = false;
      if (isFastTrack) {
        const lastRunDate = lastRun ? new Date(lastRun) : null;
        if (!lastRunDate) {
          shouldFire = true;
        } else {
          const diffMs = rawNow.getTime() - lastRunDate.getTime();
          shouldFire = Math.floor(diffMs / 60000) >= 1; 
        }
      } else {
        // C. Standard Recurrence Check
        const missionTimeShort = (scheduledTime || '').substring(0, 5);
        
        if (missionTimeShort === localTimeShort) {
          // Check Frequency
          if (frequency === 'daily') {
            shouldFire = true;
          } else if (frequency === 'weekly') {
            if (recurringDays?.includes(localDay)) shouldFire = true;
          } else if (frequency === 'monthly') {
            if (localDate === dayOfMonth) shouldFire = true;
          }

          // Once-per-day safety gate
          const lastRunDate = lastRun ? new Date(lastRun) : null;
          const lastRunLocalStr = lastRunDate ? lastRunDate.toLocaleDateString('en-CA', tzOptions) : null;
          if (lastRunLocalStr === localNowStr) {
            console.log(`   ⏭️ Skip: Already executed in this local day window.`);
            shouldFire = false;
          }
        }
      }

      // --- EXECUTION ---
      if (shouldFire) {
        console.log(`🚀 [${mission.title}] TRIGGERING TACTICAL LAUNCH...`);
        
        const loadout = mission.targets || [];
        const payload = mission.payload;
        if (!payload) {
          console.log(`   ❌ Aborted: Source content missing.`);
          continue;
        }

        const missionResults = [];
        for (const target of loadout) {
          const platformKey = target.platform; // 'instagram', 'facebook', etc.
          const placement = target.placement || 'feed';
          const channel = channels.find((c: any) => c.platform === platformKey || (platformKey === 'website' && c.platform === 'website'));
          
          if (!channel) continue;

          try {
            // ROUTING FIX: 
            // Placements (story/feed/reel) should use the Platform engine (instagram/video/etc.)
            let enginePath = platformKey; 
            if (platformKey === 'website') enginePath = 'stories'; // Internal website stories
            
            console.log(`   📡 Launching ${platformKey} (${placement}) via /api/social/publish/${enginePath}...`);
            
            const res = await fetch(`${baseUrl}/api/social/publish/${enginePath}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                videoUrl: payload.videoUrl,
                caption: payload.caption,
                hashtags: payload.hashtags,
                type: placement, // 'story', 'reel', etc.
                documentId: payload._id,
                targets: [`${placement}||${channel._id}`]
              })
            });

            missionResults.push({ 
              _key: nanoid(),
              platform: platformKey, 
              placement: placement, 
              status: res.ok ? 'success' : 'failed', 
              timestamp: new Date().toISOString() 
            });
          } catch (err: any) {
            missionResults.push({ 
              _key: nanoid(),
              platform: platformKey, 
              placement: placement, 
              status: 'failed', 
              error: err.message, 
              timestamp: new Date().toISOString() 
            });
          }
        }

        await writeClient.patch(mission._id)
          .set({ 'automation.lastRun': new Date().toISOString(), status: 'success' })
          .setIfMissing({ results: [] }) 
          .insert('after', 'results[-1]', missionResults)
          .commit();

        report.push({ mission: mission.title, results: missionResults });
      }
    }

    return NextResponse.json({ processedCount: report.length, report });
  } catch (error: any) {
    console.error('[🤖 BOT CRITICAL ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
