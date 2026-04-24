import { useState } from 'react'
import { useDocumentOperation } from 'sanity'

export function DeleteSocialContentAction(props: any) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [isDeleting, setIsDeleting] = useState(false)

  const doc = props.published
  const facebook = doc?.distribution?.facebook
  const instagram = doc?.distribution?.instagram
  
  const hasFB = !!(facebook?.postId || facebook?.storyId)
  const hasIG = !!(instagram?.postId || instagram?.storyId)

  if (!hasFB && !hasIG) return null

  return {
    label: isDeleting ? 'Wiping Socials...' : 'Wipe from Social Media',
    icon: () => '🧨',
    tone: 'critical',
    disabled: isDeleting,
    onHandle: async () => {
      const confirmDelete = window.confirm(
        "CAUTION: This will permanently delete this post from Facebook and Instagram. You cannot undo this action. Proceed?"
      )
      
      if (!confirmDelete) {
        props.onComplete()
        return
      }

      setIsDeleting(true)

      try {
        // 1. DELETE FROM FACEBOOK
        if (facebook?.postId) {
          await fetch('http://localhost:3000/api/social/publish/facebook', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: facebook.postId, type: 'reel' })
          })
        }
        if (facebook?.storyId) {
          await fetch('http://localhost:3000/api/social/publish/facebook', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: facebook.storyId, type: 'story' })
          })
        }

        // 2. DELETE FROM INSTAGRAM
        if (instagram?.postId) {
          await fetch('http://localhost:3000/api/social/publish/instagram', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: instagram.postId })
          })
        }
        if (instagram?.storyId) {
          await fetch('http://localhost:3000/api/social/publish/instagram', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: instagram.storyId })
          })
        }

        // 3. CLEAR SANITY STATUS
        patch.execute([{ 
          set: { 
            'distribution.facebook.status': 'draft',
            'distribution.facebook.postId': null,
            'distribution.facebook.storyId': null,
            'distribution.facebook.lastSyncedAsset': null,
            'distribution.instagram.status': 'draft',
            'distribution.instagram.postId': null,
            'distribution.instagram.storyId': null,
            'distribution.instagram.lastSyncedAsset': null,
          } 
        }])

        alert("Successfully wiped from social media! Content is now back in 'Draft' status for socials.")

      } catch (err: any) {
        console.error('Wipe Error:', err)
        alert("Partial failure during wipe. Please check your social accounts manually.")
      } finally {
        setIsDeleting(false)
        props.onComplete()
      }
    }
  }
}
