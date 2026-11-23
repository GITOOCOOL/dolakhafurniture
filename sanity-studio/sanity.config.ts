import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { structure, singletonTypes } from './deskStructure'
import { visionTool } from '@sanity/vision'
import { webhooksTrigger } from 'sanity-plugin-webhooks-trigger'
import { schemaTypes } from './schemaTypes'
import { DeleteSocialContentAction } from './actions/DeleteSocialContentAction'
import { BroadcastFleetAction } from './actions/BroadcastFleetAction'
import { EditorialWorkflowAction } from './actions/EditorialWorkflowAction'

import { table } from '@sanity/table'

export default defineConfig({
  name: 'default',
  title: 'sanity-studio',

  projectId: 'b6iov2to',
  dataset: 'production',

  plugins: [
    structureTool({
      structure
    }), 
    visionTool(), 
    webhooksTrigger(), 
    table()
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+ Create" menu
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (prev, context) => {
      // If it's a singleton, only allow Publish, discard changes and restore (no delete/duplicate/unpublish)
      if (singletonTypes.has(context.schemaType)) {
        return prev.filter(({ action }) => action === 'publish' || action === 'discardChanges' || action === 'restore')
      }

      return prev
    }
  }
})
