import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { webhooksTrigger } from 'sanity-plugin-webhooks-trigger'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'sanity-studio',

  projectId: 'b6iov2to',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), webhooksTrigger()],

  schema: {
    types: schemaTypes,
  },
})
