import { useState } from 'react'
import { useDocumentOperation, useValidationStatus } from 'sanity'

export function ShareOnFacebookStoryAction(props: any) {
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
  const facebook = doc?.distribution?.facebook
  const isPublishedOnStory = !!facebook?.storyId

  // Smart Sync Detection: Stories expire, but we track the most recent push
  const currentAsset = doc?.videoFile?.asset?._ref
  const isOutOfSync = isPublishedOnStory && currentAsset !== facebook?.lastSyncedAsset
  const isSynced = isPublishedOnStory && !isOutOfSync

  return {
    disabled: isDraft || isPublishing || hasErrors || isSynced,
    label: isPublishing 
      ? 'Pushing to Story...' 
      : isSynced 
        ? 'Story Active & In Sync' 
        : isOutOfSync 
          ? 'Sync Changes to FB Story' 
          : 'Broadcast to FB Story',
    icon: () => isSynced ? '✓' : '🕰️',
    onHandle: async () => {
      setIsPublishing(true)
      
      try {
        // Force STORY type for this specific action
        const response = await fetch('http://localhost:3000/api/social/publish/facebook', {
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
        if (!response.ok) throw new Error(result.error || 'Failed to publish story')

        // Update local status with the Resulting Story ID AND the Sync Checkpoint
        patch.execute([{ 
          set: { 
            'distribution.facebook.status': 'published', 
            'distribution.facebook.storyId': result.postId,
            'distribution.facebook.publishedAt': new Date().toISOString(),
            'distribution.facebook.lastSyncedAsset': currentAsset
          } 
        }])
        
        alert(`Successfully published to Facebook Story! ID: ${result.postId}`)
        
      } catch (err: any) {
        console.error('FB Story Error:', err)
        alert(`Error: ${err.message || 'Failed to publish'}`)
      } finally {
        setIsPublishing(false)
        props.onComplete()
      }
    }
  }
}
