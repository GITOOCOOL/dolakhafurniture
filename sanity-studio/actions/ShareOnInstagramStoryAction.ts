import { useState } from 'react'
import { useDocumentOperation, useValidationStatus } from 'sanity'

export function ShareOnInstagramStoryAction(props: any) {
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
  const isPublishedOnStory = !!instagram?.storyId

  // Smart Sync Detection: Compare current state with last broadcasted story state
  const currentAsset = doc?.videoFile?.asset?._ref
  const isOutOfSync = isPublishedOnStory && currentAsset !== instagram?.lastSyncedAsset
  const isSynced = isPublishedOnStory && !isOutOfSync

  return {
    disabled: isDraft || isPublishing || hasErrors || isSynced,
    label: isPublishing 
      ? 'Pushing to IG Story...' 
      : isSynced 
        ? 'IG Story In Sync' 
        : isOutOfSync 
          ? 'Sync Changes to IG Story' 
          : 'Broadcast to IG Story',
    icon: () => isSynced ? '✓' : '🤳',
    onHandle: async () => {
      setIsPublishing(true)
      
      try {
        // Call our internal Instagram API with type: 'story'
        const response = await fetch('http://localhost:3000/api/social/publish/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: doc._id,
            title: doc.title,
            caption: doc.caption,
            type: 'story', // FORCE STORY
            videoUrl: currentAsset,
            hashtags: doc.hashtags
          }),
        })

        const result = await response.json()

        // Handle 202 Accepted (Still processing) separately
        if (response.status === 202) {
           alert(`Instagram is still processing your Story. It should appear live in a few minutes! ID: ${result.creation_id}`);
           patch.execute([{ 
            set: { 
              'distribution.instagram.status': 'published', 
              'distribution.instagram.storyId': result.creation_id,
              'distribution.instagram.publishedAt': new Date().toISOString(),
              'distribution.instagram.lastSyncedAsset': currentAsset
            } 
          }])
           return;
        }

        if (!response.ok) throw new Error(result.error || 'Failed to publish IG Story')

        // Update local status with the Resulting IG Story ID AND the Sync Checkpoint
        patch.execute([{ 
          set: { 
            'distribution.instagram.status': 'published', 
            'distribution.instagram.storyId': result.postId,
            'distribution.instagram.publishedAt': new Date().toISOString(),
            'distribution.instagram.lastSyncedAsset': currentAsset
          } 
        }])
        
        alert(`Successfully published to Instagram Story! ID: ${result.postId}`)
        
      } catch (err: any) {
        console.error('IG Story Error:', err)
        alert(`Error: ${err.message || 'Failed to publish'}`)
      } finally {
        setIsPublishing(false)
        props.onComplete()
      }
    }
  }
}
