import { DocumentActionProps, DocumentActionDescription, useDocumentOperation } from 'sanity'

/**
 * EDITORIAL WORKFLOW ACTION
 * Wraps the standard 'Publish' button but gives it different names 
 * based on the content type and distribution target.
 */
export const EditorialWorkflowAction = (props: DocumentActionProps): DocumentActionDescription => {
  const { id, type, draft, published } = props
  const { publish } = useDocumentOperation(id, type)
  
  // Get the document data
  const doc = draft || published
  const docType = (doc?.type as string) || 'Content'
  const typeDisplay = docType.charAt(0).toUpperCase() + docType.slice(1)

  // Logic for the label
  let actionLabel = 'Publish'
  if (type === 'socialMedia') {
    if (docType === 'blog') {
       actionLabel = `Push Blog to live website (no logging) 🟢`
    } else {
       actionLabel = `Save ${typeDisplay} to sanity (if bot is configured, will get launched by that) 🟢`
    }
  }

  return {
    label: actionLabel,
    disabled: !!publish.disabled || !draft, // standard behavior
    onHandle: () => {
      publish.execute()
      props.onComplete()
    },
    shortcut: 'ctrl+alt+p'
  }
}
