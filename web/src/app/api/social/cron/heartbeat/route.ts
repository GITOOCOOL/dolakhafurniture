import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

/**
 * SOCIAL HUB CRON HEARTBEAT
 * This route is intended to be called by a cron job (e.g., Vercel Cron, GitHub Actions, or a local interval).
 * It scans for documents that are scheduled for automation and triggers their broadcast.
 */
export async function GET(request: Request) {
  try {
    // 1. Get current time and day in local context (or UTC depending on preference)
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHour}:${currentMinute}`;
    const todayISO = now.toISOString().split('T')[0];

    console.log(`[BOT HEARTBEAT] ${currentDay.toUpperCase()} at ${currentTimeStr}. Scanning...`);

    // 2. Query Sanity for documents that need publishing today
    // We look for:
    // - Automation enabled
    // - scheduledDays contains current day
    // - endDate is not passed
    // - lastRun is NOT today (prevents double firing)
    const query = `*[_type == "socialMedia" && 
      automation.enabled == true && 
      $currentDay in automation.scheduledDays && 
      (automation.endDate == null || automation.endDate >= $todayISO) &&
      (automation.lastRun == null || !(automation.lastRun match $todayISO + "*"))
    ] {
      _id,
      title,
      type,
      caption,
      hashtags,
      "videoUrl": videoFile.asset._ref,
      automation
    }`;

    const scheduledDocs = await client.fetch(query, { 
      currentDay, 
      todayISO 
    });

    if (scheduledDocs.length === 0) {
      return NextResponse.json({ message: 'No content scheduled for this window.' });
    }

    console.log(`[BOT] Found ${scheduledDocs.length} items to broadcast!`);

    const results = [];

    // 3. Process each document
    for (const doc of scheduledDocs) {
      const { scheduledTime } = doc.automation;
      
      // Basic time window check (within 20 mins of scheduled time to account for cron intervals)
      // Implementation: Convert both to minutes from midnight
      const [sHour, sMin] = scheduledTime.split(':').map(Number);
      const scheduledMinutes = (sHour * 60) + sMin;
      const currentMinutes = (parseInt(currentHour) * 60) + parseInt(currentMinute);
      
      // If we are within the window (e.g., scheduled time was 10:00 and now is 10:05)
      // Or if you want it to fire as soon as it's passed.
      if (currentMinutes >= scheduledMinutes) {
        console.log(`[BOT] Firing broadcast for: "${doc.title}"...`);
        
        try {
          // Determine type for FB (Story vs Reel)
          const isStory = doc.type === 'story';
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

          // Trigger Facebook / Instagram (we'll call the internal APIs we built)
          // Note: In a real serverless env, you might want to call these directly as functions 
          // but for this architecture, we HIT the endpoints.
          
          // FB Broadcast
          const fbRes = await fetch(`${baseUrl}/api/social/publish/facebook`, {
            method: 'POST',
            body: JSON.stringify({
              videoUrl: doc.videoUrl,
              caption: doc.caption,
              hashtags: doc.hashtags,
              type: doc.type
            })
          });
          const fbData = await fbRes.json();

          // IG Broadcast
          const igRes = await fetch(`${baseUrl}/api/social/publish/instagram`, {
            method: 'POST',
            body: JSON.stringify({
              videoUrl: doc.videoUrl,
              caption: doc.caption,
              hashtags: doc.hashtags,
              type: doc.type
            })
          });
          const igData = await igRes.json();

          // Update Sanity with Success and Last Run timestamp
          await client.patch(doc._id)
            .set({ 
              'automation.lastRun': new Date().toISOString(),
              'distribution.facebook.status': 'published',
              'distribution.facebook.publishedAt': new Date().toISOString(),
              'distribution.instagram.status': 'published',
              'distribution.instagram.publishedAt': new Date().toISOString()
            })
            .commit();

          results.push({ 
            doc: doc.title, 
            facebook: fbData.success ? 'Success' : 'Failed',
            instagram: igData.success ? 'Success' : 'Failed'
          });

        } catch (postError: any) {
          console.error(`[BOT] Error processing "${doc.title}":`, postError);
          results.push({ doc: doc.title, error: postError.message });
        }
      } else {
         console.log(`[BOT] "${doc.title}" is scheduled for ${scheduledTime}, too early to fire.`);
      }
    }

    return NextResponse.json({ 
      timestamp: new Date().toISOString(),
      processed: results 
    });

  } catch (error: any) {
    console.error('[BOT CRITICAL ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
