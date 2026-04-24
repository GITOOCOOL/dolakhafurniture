import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
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

  plugins: [structureTool(), visionTool(), webhooksTrigger(), table()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      return prev
    }
  }
})
