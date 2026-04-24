import { RocketIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { BroadcastControlDeck } from '../components/BroadcastControlDeck'
import { TacticalTimeInput } from '../components/TacticalTimeInput'

/**
 * CONTENT BROADCAST HUB
 * This is the 'Mission Control' schema. It decouples the creative writing
 * from the multi-channel distribution logic.
 */
export const broadcastType = defineType({
  name: 'broadcast',
  title: 'Content Broadcast Hub 🚀',
  type: 'document',
  icon: RocketIcon,
  // ADD THE MISSION CONTROL UI
  components: {
    input: BroadcastControlDeck,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Mission Title',
      type: 'string',
      description: 'Internal reference for this broadcast (e.g. "Summer Collection Launch")',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Source Content 📜',
      type: 'reference',
      to: [{ type: 'socialMedia' }],
      description: 'Select the published blog or reel you want to distribute.',
      options: {
        // RADICAL FILTER: Only show published documents
        filter: '!(_id in path("drafts.**"))',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'targets',
      title: 'Mission Loadout (Specific Placements) 🎯',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'broadcastTarget',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Video Platforms (TikTok/YT)', value: 'video' },
                  { title: 'Website Stories', value: 'website' },
                ]
              }
            },
            {
              name: 'placement',
              title: 'Placement / Format',
              type: 'string',
              options: {
                list: [
                  { title: 'Feed Post (Permanent)', value: 'feed' },
                  { title: 'Story (24 Hours)', value: 'story' },
                  { title: 'Reel (Vertical Video)', value: 'reel' }
                ]
              }
            }
          ],
          preview: {
            select: {
              p: 'platform',
              f: 'placement'
            },
            prepare({ p, f }) {
              const icons: any = { instagram: '📸', facebook: '👥', video: '🎥', website: '🌐' };
              return {
                title: `${icons[p] || '🎯'} ${p?.toUpperCase()}`,
                subtitle: `Format: ${f?.toUpperCase()}`
              }
            }
          }
        }
      ],
      description: 'Add specific targets for this broadcast mission.'
    }),
    defineField({
      name: 'status',
      title: 'Mission Status 🛰️',
      type: 'string',
      options: {
        list: [
          { title: 'Awaiting Launch', value: 'pending' },
          { title: 'In-Flight / Broadcasting', value: 'streaming' },
          { title: 'Mission Success', value: 'success' },
          { title: 'Failed / Aborted', value: 'failed' },
        ],
      },
      initialValue: 'pending',
      readOnly: true,
    }),
    defineField({
      name: 'results',
      title: 'Mission Results 🏁',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'postId', type: 'string' },
            { name: 'timestamp', type: 'datetime' },
            { name: 'error', type: 'text' },
          ],
        },
      ],
      readOnly: true,
    }),

    // --- MISSION AUTOMATION (BOT BRAIN) ---
    defineField({
      name: 'automation',
      title: '🤖 Mission Autopilot (Bot Settings)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      description: 'Configure the AI Bot to launch this mission on a recurring schedule.',
      fields: [
        { 
          name: 'isEnabled', 
          title: 'Activate Autopilot', 
          type: 'boolean', 
          initialValue: false,
          description: 'If TRUE, the omni-channel bot will handle this mission automatically.'
        },
        {
          name: 'isFastTrack',
          title: '⚡️ Fast-Track Mode (EVERY MINUTE)',
          type: 'boolean',
          initialValue: false,
          description: 'TESTING ONLY: The bot fires this mission every 60 seconds.'
        },
        {
          name: 'timezone',
          title: 'Mission Timezone 🌍',
          type: 'string',
          options: {
            list: [
              { title: 'Australia (Sydney/Melbourne)', value: 'Australia/Sydney' },
              { title: 'Nepal (Kathmandu)', value: 'Asia/Kathmandu' },
              { title: 'USA (New York/EDT)', value: 'America/New_York' },
              { title: 'Europe (London/BST)', value: 'Europe/London' },
              { title: 'UTC (Universal Clock)', value: 'UTC' }
            ]
          },
          initialValue: 'Australia/Sydney',
          description: 'The bot will obey the clock of this specific location.'
        },
        { 
          name: 'scheduledTime', 
          title: 'Launch Time (HH:mm:ss)', 
          type: 'string', 
          components: {
            input: TacticalTimeInput
          },
          description: 'Set the precise time for the mission launch using the tactical controls.' 
        },
        {
          name: 'startDate',
          title: 'Mission Start Date',
          type: 'date',
          description: 'The bot will not start this mission before this date.'
        },
        {
          name: 'endDate',
          title: 'Mission Expiration Date',
          type: 'date',
          description: 'The bot will stop this mission after this date.'
        },
        {
          name: 'frequency',
          title: 'Mission Frequency',
          type: 'string',
          options: {
            list: [
              { title: 'Every Day ☀️', value: 'daily' },
              { title: 'Weekly (Custom Days) 📅', value: 'weekly' },
              { title: 'Monthly (Special Date) 🌙', value: 'monthly' }
            ]
          },
          initialValue: 'daily'
        },
        { 
          name: 'recurringDays', 
          title: 'Mission Days', 
          type: 'array', 
          of: [{ type: 'string' }], 
          hidden: ({ parent }: any) => parent?.frequency !== 'weekly',
          options: {
            list: [
              { title: 'Monday', value: 'monday' },
              { title: 'Tuesday', value: 'tuesday' },
              { title: 'Wednesday', value: 'wednesday' },
              { title: 'Thursday', value: 'thursday' },
              { title: 'Friday', value: 'friday' },
              { title: 'Saturday', value: 'saturday' },
              { title: 'Sunday', value: 'sunday' },
            ]
          }
        },
        {
          name: 'dayOfMonth',
          title: 'Day of Month (1-31)',
          type: 'number',
          hidden: ({ parent }: any) => parent?.frequency !== 'monthly',
          validation: Rule => Rule.min(1).max(31)
        },
        { 
          name: 'lastRun', 
          title: 'Last Bot Execution', 
          type: 'datetime', 
          readOnly: true 
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
    },
    prepare({ title, status }) {
      const statusIcons: any = {
        pending: '🟡',
        streaming: '📡',
        success: '✅',
        failed: '❌',
      }
      return {
        title: title || 'Untitled Mission',
        subtitle: `${statusIcons[status] || '🛰️'} Status: ${status}`,
      }
    },
  },
})
