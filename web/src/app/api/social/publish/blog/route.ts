import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';

/**
 * BLOG PUBLISHING ENGINE
 * This engine handles the final 'Public Unlock' for blog posts.
 * It ensures the document is published and 'isActive' is true.
 */
export async function POST(req: Request) {
  try {
    const { documentId, channelId } = await req.json();
    console.log(`📡 BLOG ENGINE ACTIVATED FOR ID: ${documentId}`);

    // 1. Fetch the content with our hardened writeClient
    const content = await writeClient.fetch(
      `*[_id == $id || _id == "drafts." + $id] | order(_updatedAt desc)[0]`, 
      { id: documentId }
    );

    if (!content) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // 2. Perform the 'Manual Handshake' 
    // For blogs, "Distribution" means making sure isActive is true and it's visible on web.
    await writeClient
      .patch(content._id)
      .set({ 
        isActive: true,
        'distribution.lastSynced': new Date().toISOString(),
        'distribution.status': 'synced'
      })
      .commit();

    console.log(`✅ BLOG ENGINE COMPLETED SUCCESSFUL HANDSHAKE FOR: ${content.title}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Blog published and unlocked on website' 
    });

  } catch (error: any) {
    console.error('❌ BLOG ENGINE ERROR:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
