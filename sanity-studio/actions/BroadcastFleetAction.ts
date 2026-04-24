import { RocketIcon } from '@sanity/icons'
import { DocumentActionProps, DocumentActionDescription, useClient, useDocumentOperation } from 'sanity'
import { useState } from 'react'

/**
 * FLEET LAUNCH ACTION
 * A high-fidelity document action that broadcasts the current content 
 * to all selected channels in the Omni-Channel fleet.
 */
export const BroadcastFleetAction = (props: DocumentActionProps): DocumentActionDescription => {
  const { id, type, draft, published } = props
  const [isPushing, setIsPushing] = useState(false)
  const { publish } = useDocumentOperation(id, type)
  const client = useClient({ apiVersion: '2024-04-24' })

  // The active document data (Cast as any to allow dynamic property access)
  const doc = (draft || published) as any
  const targets = (doc?.distribution?.plannedTargets as string[]) || []
  const docType = (doc?.type as string) || 'Fleet'
  
  // Format the display name (e.g. 'reel' -> 'Reel')
  const typeDisplay = docType.charAt(0).toUpperCase() + docType.slice(1)

  return {
    label: isPushing ? 'Transmitting...' : `Launch ${typeDisplay} instantly (bots get turned off) 🚀`,
    icon: RocketIcon,
    disabled: isPushing || !doc?.distribution?.plannedTargets?.length,
    onHandle: async () => {
      setIsPushing(true)

      try {
        // 1. AUTO-PUBLISH (Optional but recommended for consistency)
        // This ensures the external APIs see the EXACT same data as the Studio
        if (draft) {
          publish.execute()
        }

        // SILENCE THE BOT: If we are launching manually NOW, we should disable 
        // any future automated schedules for this specific post to prevent duplicates.
        await client.patch(id).set({ 'automation.enabled': false }).commit()

        // 2. TRIGGER THE BROADCAST ENGINE
        // In local/production, this calls the Next.js API
        const baseUrl = typeof window !== 'undefined' ? window.location.origin.replace('3333', '3000') : ''
        
        const response = await fetch(`${baseUrl}/api/social/publish/manual`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: id,
            targets: doc?.distribution?.plannedTargets || [],
            payload: {
              _id: id,
              title: doc?.title,
              caption: doc?.caption,
              hashtags: doc?.hashtags,
              videoUrl: doc?.masterMedia?.asset?.url,
              type: doc?.type
            }
          })
        })

        if (response.ok) {
          console.log('✅ FLEET LAUNCH SUCCESSFUL')
          // Close the action menu
          props.onComplete()
        } else {
          const err = await response.json()
          alert(`❌ Launch Failed: ${err.message || 'Unknown error'}`)
        }
      } catch (err: any) {
        alert(`❌ Critical System Failure: ${err.message}`)
      } finally {
        setIsPushing(false)
      }
    }
  }
}
