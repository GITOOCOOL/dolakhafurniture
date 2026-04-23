import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

/**
 * API Route to publish content to Instagram Business Reels
 * Expected Body: { videoUrl: string, caption: string, hashtags: string[] }
 */
export async function POST(request: Request) {
  try {
    const { videoUrl: videoAssetRef, caption, hashtags, type } = await request.json();
    const isStory = type === 'story';

    const IG_ID = process.env.FACEBOOK_INSTAGRAM_ID;
    const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!IG_ID || !PAGE_ACCESS_TOKEN) {
      const res = NextResponse.json(
        { error: 'Instagram configuration missing (INSTAGRAM_ID or ACCESS_TOKEN)' },
        { status: 500 }
      );
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

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

    console.log(`Starting Instagram ${isStory ? 'Story' : 'Reel'} publish for Account ${IG_ID}...`);

    // --- INSTAGRAM PUBLISHING FLOW ---
    
    // Step 1: Create Media Container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${IG_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: isStory ? 'STORIES' : 'REELS',
          video_url: directVideoUrl,
          caption: isStory ? '' : fullCaption, // IG Stories don't use standard captions
          access_token: PAGE_ACCESS_TOKEN,
        }),
      }
    );

    const containerData = await containerResponse.json();
    if (!containerResponse.ok) {
      console.error('IG Container Error:', containerData);
      const res = NextResponse.json({ error: 'IG Media Container creation failed', details: containerData }, { status: 500 });
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    const creation_id = containerData.id;
    console.log(`IG Container created: ${creation_id}. Waiting for processing...`);

    // Step 2: Poll for Processing Status
    // Instagram needs time to process the video before it can be published.
    let status = 'IN_PROGRESS';
    let attempts = 0;
    const maxAttempts = 40; // 40 * 3s = 120 seconds max wait

    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s
      
      const statusResponse = await fetch(
        `https://graph.facebook.com/v21.0/${creation_id}?fields=status_code&access_token=${PAGE_ACCESS_TOKEN}`
      );
      const statusData = await statusResponse.json();
      status = statusData.status_code;
      attempts++;
      console.log(`Poll attempt ${attempts}: ${status}`);
    }

    if (status !== 'FINISHED') {
      const res = NextResponse.json({ 
        error: 'IG Video processing timed out or failed', 
        status,
        creation_id 
      }, { status: 202 }); // 202 = Accepted, but not finished
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    // Step 3: Publish Media
    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${IG_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creation_id,
          access_token: PAGE_ACCESS_TOKEN,
        }),
      }
    );

    const publishData = await publishResponse.json();
    if (!publishResponse.ok) {
        console.error('IG Publish Error:', publishData);
        const res = NextResponse.json({ error: 'IG Media Publish failed', details: publishData }, { status: 500 });
        res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
        return res;
    }

    const res = NextResponse.json({ 
      success: true, 
      postId: publishData.id, 
      data: publishData 
    });
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;

  } catch (error: any) {
    console.error('Server error in Instagram publish:', error);
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
