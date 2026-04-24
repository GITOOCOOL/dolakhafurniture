import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

/**
 * API Route to publish content to Instagram Business Reels
 * Expected Body: { videoUrl: string, caption: string, hashtags: string[] }
 */
export async function POST(request: Request) {
  try {
    const { videoUrl: videoAssetRef, caption, hashtags, type, targetId, targetToken } = await request.json();
    const isStory = type === 'story';

    const IG_ID = targetId || process.env.FACEBOOK_INSTAGRAM_ID;
    const PAGE_ACCESS_TOKEN = targetToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!IG_ID || !PAGE_ACCESS_TOKEN) {
      const res = NextResponse.json(
        { error: 'Instagram configuration missing (INSTAGRAM_ID or ACCESS_TOKEN)' },
        { status: 500 }
      );
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    // 1. Resolve Media URL and Detect Type
    let mediaUrl = '';
    let isVideo = false;

    if (videoAssetRef) {
      const asset = await client.fetch(`*[_id == $id][0]`, { id: videoAssetRef });
      if (asset?.url) {
        mediaUrl = asset.url;
        // Simple detection: if mimeType contains video or extension is mp4/mov
        const mimeType = asset.mimeType || '';
        isVideo = mimeType.includes('video') || mediaUrl.match(/\.(mp4|mov|m4v)$/i) !== null;
      } else if (videoAssetRef.startsWith('http')) {
        mediaUrl = videoAssetRef;
        isVideo = mediaUrl.match(/\.(mp4|mov|m4v)$/i) !== null;
      }
    }

    if (!mediaUrl) {
      const res = NextResponse.json({ error: 'Could not resolve media asset URL' }, { status: 400 });
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    const fullCaption = `${caption || ''}\n\n${(hashtags || []).map((t: string) => `#${t}`).join(' ')}`.trim();

    console.log(`Starting Instagram ${isStory ? 'Story' : 'Reel'} publish (${isVideo ? 'VIDEO' : 'IMAGE'}) for Account ${IG_ID}...`);

    // --- INSTAGRAM PUBLISHING FLOW ---
    
    // Step 1: Create Media Container
    const containerParams: any = {
      access_token: PAGE_ACCESS_TOKEN,
    };

    if (isStory) {
      containerParams.media_type = 'STORIES';
      if (isVideo) {
        containerParams.video_url = mediaUrl;
      } else {
        containerParams.image_url = mediaUrl;
      }
    } else {
      containerParams.media_type = 'REELS';
      containerParams.video_url = mediaUrl;
      containerParams.caption = fullCaption;
    }

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${IG_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerParams),
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

    // Step 2: Poll for Processing Status (Only needed for Videos)
    if (isVideo) {
      let status = 'IN_PROGRESS';
      let attempts = 0;
      const maxAttempts = 40; 

      while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
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
        }, { status: 202 });
        res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
        return res;
      }
    } else {
      console.log('Static image container ready immediately.');
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

export async function DELETE(request: Request) {
  try {
    const { postId, targetToken } = await request.json();
    const PAGE_ACCESS_TOKEN = targetToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!postId || !PAGE_ACCESS_TOKEN) {
      const res = NextResponse.json({ error: 'Missing postId or Meta configuration' }, { status: 400 });
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    console.log(`🗑 Requesting deletion for Instagram Media: ${postId}...`);

    const deleteResponse = await fetch(`https://graph.facebook.com/v21.0/${postId}?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: 'DELETE',
    });

    const deleteData = await deleteResponse.json();

    if (!deleteResponse.ok) {
      console.error('IG Delete Error:', deleteData);
      const res = NextResponse.json({ error: 'Instagram Deletion failed', details: deleteData }, { status: 500 });
      res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
      return res;
    }

    const res = NextResponse.json({ success: true, data: deleteData });
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;

  } catch (error: any) {
    console.error('Server error in Instagram delete:', error);
    const res = NextResponse.json({ error: error.message }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
    return res;
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}
