import { NextResponse } from 'next/server';

/**
 * Native Website Blog Publisher
 * This endpoint acts as the "Receiver" for internal blog broadcasts.
 */
export async function POST(request: Request) {
  try {
    const { documentId, title, channelName } = await request.json();

    console.log(`📡 INTERNAL BROADCAST RECEIVED:`);
    console.log(`- Channel: ${channelName}`);
    console.log(`- Document: ${title} (${documentId})`);
    console.log(`- Status: LIVE ON HUB`);

    const res = NextResponse.json({ 
      success: true, 
      postId: `web-${Date.now()}`, 
      message: 'Broadcast successfully received by the Heritage Hub.' 
    });

    // Handle CORS for Sanity Studio
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
    res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3333');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
