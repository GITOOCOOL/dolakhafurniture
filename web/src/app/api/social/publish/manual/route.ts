import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';

/**
 * UNIFIED MANUAL BROADCAST ENGINE (V2.6 - FULL CREDENTIAL INJECTION)
 * Correctly fetches Page IDs and Tokens from Sanity to bypass ENV conflicts.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3333',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentId, targets } = body;
    console.log('🚀 [MANUAL ROUTER] STARTING CREDENTIAL SYNC MISSION...');

    if (!documentId || !targets) {
      return NextResponse.json({ error: 'Missing documentId or targets' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': 'http://localhost:3333' }
      });
    }

    // 1. Fetch Source Content
    const content = await writeClient.fetch(
      `*[_id == $id || _id == "drafts." + $id] | order(_updatedAt desc)[0] {
        ...,
        "masterMediaUrl": masterMedia.asset->url,
        "imageMediaUrl": imageMedia.asset->url,
        "thumbnailUrl": thumbnail.asset->url
      }`, 
      { id: documentId }
    );

    if (!content) return NextResponse.json({ error: 'Payload not found.' }, { status: 404 });

    const publicUrl = content.masterMediaUrl || content.imageMediaUrl || content.thumbnailUrl;
    console.log('✅ Payload URL Resolved.');

    // 2. Dispatch to Engines with INJECTED CREDENTIALS
    const results = await Promise.all(targets.map(async (target: string) => {
      let [platform, placement, channelSanityId] = target.split('||');
      
      // FETCH THE REAL CHANNEL CONFIG FROM SANITY
      const channel = await writeClient.fetch(`*[_id == $id][0]`, { id: channelSanityId });
      
      if (!channel) return { platform, status: 'failed', error: 'Channel config missing in Sanity' };

      let enginePath = platform.toLowerCase();
      if (enginePath.includes('facebook') || enginePath === 'fb') enginePath = 'facebook';
      else if (['website', 'web', 'site'].includes(enginePath)) enginePath = 'stories';
      else enginePath = 'instagram';
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      try {
        console.log(`📡 [MANUAL ROUTER] Injecting credentials for ${channel.name}...`);
        const res = await fetch(`${baseUrl}/api/social/publish/${enginePath}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            documentId, 
            targetId: channel.platformId, // THE REAL PAGE ID
            targetToken: channel.accessToken, // THE REAL PAGE TOKEN
            videoUrl: publicUrl, 
            caption: content.caption,
            hashtags: content.hashtags,
            type: placement 
          })
        });

        const data = await res.json();
        return { platform, status: res.ok ? 'success' : 'failed', data };
      } catch (subErr: any) {
        return { platform, status: 'failed', error: subErr.message };
      }
    }));

    return NextResponse.json({ message: 'Fleet sync complete', results }, {
      headers: { 'Access-Control-Allow-Origin': 'http://localhost:3333' }
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Critical Failure', details: err.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': 'http://localhost:3333' }
    });
  }
}
