import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

/**
 * API Route to publish content to Facebook Page Reels
 * Expected Body: { videoUrl: string, caption: string, hashtags: string[] }
 */
export async function POST(request: Request) {
  try {
    const { videoUrl: videoAssetRef, caption, hashtags, type } = await request.json();

    const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
    const SYSTEM_USER_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!PAGE_ID || !SYSTEM_USER_TOKEN) {
      const res = NextResponse.json(
        { error: 'Facebook configuration missing (PAGE_ID or ACCESS_TOKEN)' },
        { status: 500 }
      );
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    // 0. FETCH PAGE ACCESS TOKEN (The "Page Mask")
    // Meta sometimes requires a Page-specific token for Stories even if System User has permissions.
    console.log(`Exchanging System User token for Page token for ${PAGE_ID}...`);
    const tokenUrl = `https://graph.facebook.com/v21.0/${PAGE_ID}?fields=access_token&access_token=${SYSTEM_USER_TOKEN}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
        console.error('Token Exchange Error:', tokenData);
        const res = NextResponse.json({ error: 'Failed to obtain Page Access Token', details: tokenData }, { status: 500 });
        res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
        return res;
    }

    const PAGE_ACCESS_TOKEN = tokenData.access_token;
    console.log("Page Access Token obtained successfully.");

    // 1. Resolve Sanity Video URL from Asset Reference
    let directVideoUrl = '';
    if (videoAssetRef) {
      const asset = await client.fetch(`*[_id == $id][0]`, { id: videoAssetRef });
      if (asset?.url) {
        directVideoUrl = asset.url;
      } else if (videoAssetRef.startsWith('http')) {
        directVideoUrl = videoAssetRef;
      } else {
        const res = NextResponse.json({ error: 'Could not resolve video asset URL' }, { status: 400 });
        res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
        return res;
      }
    }

    const fullCaption = `${caption || ''}\n\n${(hashtags || []).map((t: string) => `#${t}`).join(' ')}`.trim();
    const isStory = type === 'story';
    const fbEndpoint = isStory ? 'video_stories' : 'video_reels';

    console.log(`Starting Facebook ${isStory ? 'Story' : 'Reel'} publish for Page ${PAGE_ID}...`);

    // --- FACEBOOK PUBLISHING FLOW ---
    
    // Step 1: Initialize Upload Session
    const initResponse = await fetch(
      `https://graph.facebook.com/v21.0/${PAGE_ID}/${fbEndpoint}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upload_phase: 'start',
          access_token: PAGE_ACCESS_TOKEN,
        }),
      }
    );

    const initData = await initResponse.json();
    if (!initResponse.ok) {
      console.error('FB Init Error:', initData);
      const res = NextResponse.json({ error: 'FB Initialization failed', details: initData }, { status: 500 });
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    const { video_id, upload_url } = initData;

    // Step 2: Upload Video via URL
    const uploadResponse = await fetch(upload_url, {
      method: 'POST',
      headers: {
        'Authorization': `OAuth ${PAGE_ACCESS_TOKEN}`,
        'file_url': directVideoUrl,
      }
    });

    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok) {
      console.error('FB Upload Error:', uploadData);
      const res = NextResponse.json({ error: 'FB Upload failed', details: uploadData }, { status: 500 });
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    // Step 3: Finalize and Publish
    const finishBody: any = {
      upload_phase: 'finish',
      access_token: PAGE_ACCESS_TOKEN,
      video_id: video_id,
      video_state: 'PUBLISHED',
    };

    // Stories usually don't support the 'description' field like Reels do
    if (!isStory) {
      finishBody.description = fullCaption;
    }

    const finishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${PAGE_ID}/${fbEndpoint}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finishBody),
      }
    );

    const finishData = await finishResponse.json();
    if (!finishResponse.ok) {
        console.error('FB Finish Error:', finishData);
        const res = NextResponse.json({ error: 'FB Finalization failed', details: finishData }, { status: 500 });
        res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
        return res;
    }

    const res = NextResponse.json({ 
      success: true, 
      postId: video_id, 
      type: isStory ? 'story' : 'reel',
      data: finishData 
    });
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;

  } catch (error: any) {
    console.error('Server error in Facebook publish:', error);
    const res = NextResponse.json({ error: error.message }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
    return res;
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}
