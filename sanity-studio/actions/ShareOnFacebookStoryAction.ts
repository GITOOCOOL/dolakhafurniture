import { useState } from 'react'
import { useDocumentOperation, useValidationStatus } from 'sanity'

export function ShareOnFacebookStoryAction(props: any) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const { validation } = useValidationStatus(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  // Only allow publishing for socialMedia type
  if (props.type !== 'socialMedia') {
    return null
  }

  const hasErrors = validation.length > 0
  const isDraft = !props.published
  const isPublishedOnStory = props.published?.distribution?.facebook?.storyId
  
  return {
    disabled: isDraft || isPublishing || hasErrors,
    label: isPublishing ? 'Pushing to Story...' : isPublishedOnStory ? 'Update FB Story' : 'Broadcast to FB Story',
    icon: () => '🕰️',
    onHandle: async () => {
      setIsPublishing(true)
      
      try {
        const doc = props.published
        
        // Force STORY type for this specific action
        const response = await fetch('http://localhost:3000/api/social/publish/facebook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: doc._id,
            title: doc.title,
            caption: doc.caption,
            type: 'story', // FORCE STORY
            videoUrl: doc.videoFile?.asset?._ref,
            hashtags: doc.hashtags
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to publish story')
        }

        // Update local status with the resulting Story ID
        patch.execute([{ 
          set: { 
            'distribution.facebook.status': 'published', 
            'distribution.facebook.storyId': result.postId, // Track story ID specifically
            'distribution.facebook.publishedAt': new Date().toISOString() 
          } 
        }])
        
        alert(`Successfully published to Facebook Story! ID: ${result.postId}`)
        
      } catch (err: any) {
        console.error('FB Story Error:', err)
        alert(`Error: ${err.message || 'Failed to publish to Facebook Story'}`)
      } finally {
        setIsPublishing(false)
        props.onComplete()
      }
    }
  }
}
