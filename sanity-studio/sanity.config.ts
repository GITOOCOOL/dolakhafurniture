import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { structure } from './deskStructure'
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
  },

  document: {
    actions: (prev, context) => {
      const singletonTypes = new Set(['checkoutSettings'])
      
      // If it's a singleton, only allow Publish and discard changes
      if (singletonTypes.has(context.schemaType)) {
        return prev.filter(({ action }) => action === 'publish' || action === 'discardChanges' || action === 'restore')
      }

      return prev
    }
  }
})
