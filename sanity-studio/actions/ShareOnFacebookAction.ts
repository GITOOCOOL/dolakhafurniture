import { useState } from 'react'
import { useDocumentOperation, useValidationStatus } from 'sanity'

export function ShareOnFacebookAction(props: any) {
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
  const isPublishedOnFB = facebook?.status === 'published'

  // Smart Sync Detection: Compare current state with last broadcasted state
  const currentAsset = doc?.videoFile?.asset?._ref
  const currentCaption = doc?.caption
  const isOutOfSync = isPublishedOnFB && (
    currentAsset !== facebook?.lastSyncedAsset || 
    currentCaption !== facebook?.lastSyncedCaption
  )
  const isSynced = isPublishedOnFB && !isOutOfSync

  return {
    disabled: isDraft || isPublishing || hasErrors || isSynced,
    label: isPublishing 
      ? 'Broadcasting...' 
      : isSynced 
        ? 'Already Live & In Sync' 
        : isOutOfSync 
          ? 'Sync Changes to Facebook (New Post)' 
          : 'Broadcast to Facebook Page',
    icon: () => isSynced ? '✓' : isOutOfSync ? '🔄' : '🚀',
    onHandle: async () => {
      setIsPublishing(true)

      try {
        // Call our internal API
        const response = await fetch('http://localhost:3000/api/social/publish/facebook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: doc._id,
            title: doc.title,
            caption: doc.caption,
            type: doc.type,
            videoUrl: currentAsset,
            hashtags: doc.hashtags
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to publish')
        }

        // Update local status with the Resulting Post ID AND the Sync Checkpoints
        patch.execute([{ 
          set: { 
            'distribution.facebook.status': 'published', 
            'distribution.facebook.postId': result.postId,
            'distribution.facebook.publishedAt': new Date().toISOString(),
            'distribution.facebook.lastSyncedAsset': currentAsset,
            'distribution.facebook.lastSyncedCaption': currentCaption
          } 
        }])

        alert(`Successfully published to Facebook! Post ID: ${result.postId}`)

      } catch (err: any) {
        console.error('FB Publish Error:', err)
        alert(`Error: ${err.message || 'Failed to publish to Facebook'}`)
        patch.execute([{ set: { 'distribution.facebook.status': 'failed' } }])
      } finally {
        setIsPublishing(false)
        props.onComplete()
      }
    }
  }
}
