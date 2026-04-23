import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { webhooksTrigger } from 'sanity-plugin-webhooks-trigger'
import { schemaTypes } from './schemaTypes'
import { ShareOnFacebookAction } from './actions/ShareOnFacebookAction'
import { ShareOnFacebookStoryAction } from './actions/ShareOnFacebookStoryAction'
import { ShareOnInstagramAction } from './actions/ShareOnInstagramAction'
import { ShareOnInstagramStoryAction } from './actions/ShareOnInstagramStoryAction'
import { ShareOnTikTokAction } from './actions/ShareOnTikTokAction'

export default defineConfig({
  name: 'default',
  title: 'sanity-studio',

  projectId: 'b6iov2to',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), webhooksTrigger()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'socialMedia') {
        return [...prev, ShareOnFacebookAction, ShareOnFacebookStoryAction, ShareOnInstagramAction, ShareOnInstagramStoryAction, ShareOnTikTokAction]
      }
      return prev
    }
  }
})
