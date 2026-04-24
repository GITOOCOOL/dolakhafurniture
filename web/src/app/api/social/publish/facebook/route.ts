import { NextResponse } from 'next/server';

/**
 * FACEBOOK TACTICAL ENGINE (V4.1 - PHOTO STORY PRECISION)
 * Implements the Two-Step 'Shadow Upload' protocol to target the Story Circle specifically.
 */
export async function POST(request: Request) {
  try {
    const { videoUrl: mediaUrl, caption, hashtags, type, targetId, targetToken } = await request.json();
    
    let PAGE_ID = targetId || process.env.FACEBOOK_PAGE_ID;
    let SYSTEM_USER_TOKEN = targetToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!PAGE_ID || !SYSTEM_USER_TOKEN) {
      return NextResponse.json({ error: 'Facebook configuration missing' }, { status: 500 });
    }

    // --- STEP 0: TACTICAL TOKEN EXCHANGE (Required for Stories) ---
    const tokenUrl = `https://graph.facebook.com/${PAGE_ID}?fields=access_token&access_token=${SYSTEM_USER_TOKEN}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();
    const PAGE_ACCESS_TOKEN = tokenData.access_token;

    if (!PAGE_ACCESS_TOKEN) return NextResponse.json({ error: 'Failed to obtain Page Identity', details: tokenData }, { status: 500 });

    const isVideo = mediaUrl?.match(/\.(mp4|mov|m4v)$/i) !== null;
    const isStory = type === 'story' || type === 'facebook-story';
    const fullCaption = `${caption || ''}\n\n${(hashtags || []).map((t: string) => `#${t}`).join(' ')}`.trim();

    // --- STEP 1: MULTIMODAL STORY GATE ---
    let resultData;
    let response;

    if (isVideo) {
      // VIDEO STORY BRANCH
      const fbEndpoint = isStory ? 'video_stories' : 'video_reels';
      console.log(`📡 [FB ENGINE] Launching Video Story via /${fbEndpoint}...`);
      
      const initRes = await fetch(`https://graph.facebook.com/${PAGE_ID}/${fbEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_phase: 'start', access_token: PAGE_ACCESS_TOKEN })
      });
      const initData = await initRes.json();
      
      if (!initRes.ok) return NextResponse.json({ error: 'Video Init Failed', details: initData }, { status: 500 });

      await fetch(initData.upload_url, {
        method: 'POST',
        headers: { 'Authorization': `OAuth ${PAGE_ACCESS_TOKEN}`, 'file_url': mediaUrl }
      });
      
      const finishBody: any = { upload_phase: 'finish', access_token: PAGE_ACCESS_TOKEN, video_id: initData.video_id, video_state: 'PUBLISHED' };
      if (!isStory) finishBody.description = fullCaption;

      response = await fetch(`https://graph.facebook.com/${PAGE_ID}/${fbEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finishBody)
      });
      resultData = await response.json();
    } 
    else if (isStory) {
      // --- PHOTO STORY CIRCLE BRANCH (THE TWO-STEP DANCE) ---
      console.log(`📡 [FB ENGINE] Launching Photo Story via /photo_stories...`);
      
      // Step A: Shadow Upload (published: false)
      const uploadRes = await fetch(`https://graph.facebook.com/${PAGE_ID}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: mediaUrl,
          published: false,
          access_token: PAGE_ACCESS_TOKEN
        })
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) return NextResponse.json({ error: 'Photo Shadow Upload Failed', details: uploadData }, { status: 500 });

      // Step B: Final Story Launch
      response = await fetch(`https://graph.facebook.com/${PAGE_ID}/photo_stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo_id: uploadData.id,
          access_token: PAGE_ACCESS_TOKEN
        })
      });
      resultData = await response.json();
    }
    else {
      // STANDARD FEED POST BRANCH
      console.log(`📡 [FB ENGINE] Launching Photo Feed Post via /photos...`);
      response = await fetch(`https://graph.facebook.com/${PAGE_ID}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: mediaUrl, message: fullCaption, access_token: PAGE_ACCESS_TOKEN })
      });
      resultData = await response.json();
    }

    if (!response.ok) {
      console.error('🔥 [FB ENGINE] Final Dispatch Error:', resultData);
      return NextResponse.json({ error: 'Facebook Story Handshake Failed', details: resultData }, { status: 500 });
    }

    return NextResponse.json({ success: true, postId: resultData.id || resultData.post_id, data: resultData });

  } catch (error: any) {
    console.error('🔥 [FB ENGINE] System Crash:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3333',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
