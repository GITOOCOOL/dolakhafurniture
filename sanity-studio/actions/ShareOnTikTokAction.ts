import { useState } from 'react'
import { useDocumentOperation } from 'sanity'

export function ShareOnTikTokAction(props: any) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  if (props.type !== 'socialMedia') {
    return null
  }

  return {
    disabled: !props.published || isPublishing,
    label: isPublishing ? 'Uploading to TikTok...' : 'Push to TikTok Store',
    onHandle: async () => {
      setIsPublishing(true)
      
      try {
        alert('TikTok Integration: This would now use the TikTok Content Posting API to publish your video.')
        
        patch.execute([{ set: { 'distribution.tiktok.status': 'published', 'distribution.tiktok.publishedAt': new Date().toISOString() } }])
        
      } catch (err) {
        alert('Failed to publish to TikTok')
      } finally {
        setIsPublishing(false)
        props.onComplete()
      }
    }
  }
}
