import { useState } from 'react'
import { useDocumentOperation, useValidationStatus } from 'sanity'

export function ShareOnFacebookAction(props: any) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const { validation } = useValidationStatus(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  // Only allow publishing for socialMedia type
  if (props.type !== 'socialMedia') {
    return null
  }

  const hasErrors = validation.length > 0
  const isDraft = !props.published
  const isPublishedOnFB = props.published?.distribution?.facebook?.status === 'published'

  return {
    disabled: isDraft || isPublishing || hasErrors,
    label: isPublishing ? 'Broadcasting...' : isPublishedOnFB ? 'Post Again to Facebook' : 'Broadcast to Facebook Page',
    icon: () => '🚀',
    onHandle: async () => {
      setIsPublishing(true)
      
      try {
        const doc = props.published
        
        // Call our internal API (pointing to the Next.js port)
        const response = await fetch('http://localhost:3000/api/social/publish/facebook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: doc._id,
            title: doc.title,
            caption: doc.caption,
            type: doc.type, // 'reel' or 'story'
            videoUrl: doc.videoFile?.asset?._ref, // We will resolve this on the server
            hashtags: doc.hashtags
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to publish')
        }

        // Update local status with the resulting Post ID
        patch.execute([{ 
          set: { 
            'distribution.facebook.status': 'published', 
            'distribution.facebook.postId': result.postId,
            'distribution.facebook.publishedAt': new Date().toISOString() 
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
