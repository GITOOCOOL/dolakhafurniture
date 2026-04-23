import { useState } from 'react'
import { useDocumentOperation, useValidationStatus } from 'sanity'

export function ShareOnInstagramAction(props: any) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const { validation } = useValidationStatus(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  // Only allow publishing for socialMedia type
  if (props.type !== 'socialMedia') {
    return null
  }

  const hasErrors = validation.length > 0
  const isDraft = !props.published
  const isPublishedOnIG = props.published?.distribution?.instagram?.status === 'published'

  return {
    disabled: isDraft || isPublishing || hasErrors,
    label: isPublishing ? 'Broadcasting to IG...' : isPublishedOnIG ? 'Post Again to Instagram' : 'Broadcast to Instagram',
    icon: () => '📸',
    onHandle: async () => {
      setIsPublishing(true)
      
      try {
        const doc = props.published
        
        // Call our internal Instagram API
        const response = await fetch('http://localhost:3000/api/social/publish/instagram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: doc._id,
            title: doc.title,
            caption: doc.caption,
            videoUrl: doc.videoFile?.asset?._ref,
            hashtags: doc.hashtags
          }),
        })

        const result = await response.json()
        
        // Handle 202 Accepted (Still processing) separately
        if (response.status === 202) {
           alert(`Instagram is still processing your video. It should appear live in a few minutes! ID: ${result.creation_id}`);
           return;
        }
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to publish to Instagram')
        }

        // Update local status with the resulting IG Media ID
        patch.execute([{ 
          set: { 
            'distribution.instagram.status': 'published', 
            'distribution.instagram.postId': result.postId,
            'distribution.instagram.publishedAt': new Date().toISOString() 
          } 
        }])
        
        alert(`Successfully published to Instagram! Media ID: ${result.postId}`)
        
      } catch (err: any) {
        console.error('IG Publish Error:', err)
        alert(`Error: ${err.message || 'Failed to publish to Instagram'}`)
        
        patch.execute([{ set: { 'distribution.instagram.status': 'failed' } }])
      } finally {
        setIsPublishing(false)
        props.onComplete()
      }
    }
  }
}
