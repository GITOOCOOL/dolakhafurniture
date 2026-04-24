import { useState } from 'react'
import { useDocumentOperation, useValidationStatus } from 'sanity'

export function ShareOnInstagramAction(props: any) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const { validation } = useValidationStatus(props.id, props.type, false)
  const [isPublishing, setIsPublishing] = useState(false)

  // Only allow publishing for socialMedia type
  if (props.type !== 'socialMedia') {
    return null
  }

  const hasErrors = validation.length > 0
  const isDraft = !props.published
  const doc = props.published
  const instagram = doc?.distribution?.instagram
  const isPublishedOnIG = instagram?.status === 'published'

  // Smart Sync Detection: Compare current state with last broadcasted state
  const currentAsset = doc?.videoFile?.asset?._ref
  const currentCaption = doc?.caption
  const isOutOfSync = isPublishedOnIG && (
    currentAsset !== instagram?.lastSyncedAsset || 
    currentCaption !== instagram?.lastSyncedCaption
  )
  const isSynced = isPublishedOnIG && !isOutOfSync

  return {
    disabled: isDraft || isPublishing || hasErrors || isSynced,
    label: isPublishing 
      ? 'Broadcasting to IG...' 
      : isSynced 
        ? 'Already Live & In Sync (IG)' 
        : isOutOfSync 
          ? 'Sync Changes to Instagram (New Post)' 
          : 'Broadcast to Instagram',
    icon: () => isSynced ? '✓' : isOutOfSync ? '🔄' : '📸',
    onHandle: async () => {
      setIsPublishing(true)
      
      try {
        // Call our internal Instagram API
        const response = await fetch('http://localhost:3000/api/social/publish/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: doc._id,
            title: doc.title,
            caption: doc.caption,
            videoUrl: currentAsset,
            hashtags: doc.hashtags
          }),
        })

        const result = await response.json()
        
        // Handle 202 Accepted (Still processing) separately
        if (response.status === 202) {
           alert(`Instagram is still processing your video. It should appear live in a few minutes! ID: ${result.creation_id}`);
           patch.execute([{ 
            set: { 
              'distribution.instagram.status': 'published', 
              'distribution.instagram.postId': result.creation_id,
              'distribution.instagram.publishedAt': new Date().toISOString(),
              'distribution.instagram.lastSyncedAsset': currentAsset,
              'distribution.instagram.lastSyncedCaption': currentCaption
            } 
          }])
           return;
        }
        
        if (!response.ok) throw new Error(result.error || 'Failed to publish to Instagram')

        // Update local status with the Resulting IG Media ID AND the Sync Checkpoints
        patch.execute([{ 
          set: { 
            'distribution.instagram.status': 'published', 
            'distribution.instagram.postId': result.postId,
            'distribution.instagram.publishedAt': new Date().toISOString(),
            'distribution.instagram.lastSyncedAsset': currentAsset,
            'distribution.instagram.lastSyncedCaption': currentCaption
          } 
        }])
        
        alert(`Successfully published to Instagram! Media ID: ${result.postId}`)
        
      } catch (err: any) {
        console.error('IG Publish Error:', err)
        alert(`Error: ${err.message || 'Failed to publish'}`)
        patch.execute([{ set: { 'distribution.instagram.status': 'failed' } }])
      } finally {
        setIsPublishing(false)
        props.onComplete()
      }
    }
  }
}
