import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'adminLog',
  title: 'Admin Brain & Insights',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Log Heading / Insight',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'A short summary of the decision or event.'
    }),
    defineField({
      name: 'type',
      title: 'Log Category',
      type: 'string',
      options: {
        list: [
          { title: '💡 Idea / Future Plan', value: 'idea' },
          { title: '✅ Decision Made', value: 'decision' },
          { title: '⚠️ Warning / Issue', value: 'warning' },
          { title: '🚨 Critical / Alert', value: 'alert' },
          { title: '🧠 Knowledge Base', value: 'knowledge' },
          { title: '🛰️ Technical Manual', value: 'manual' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'decision',
    }),
    defineField({
      name: 'nature',
      title: 'Structural Nature',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Implementation (Live Code)', value: 'implementation' },
          { title: '🔵 Documentation (Manuals)', value: 'documentation' },
          { title: '🔴 Security (Shield/Alert)', value: 'security' },
          { title: '🏺 Design (Atelier Standards)', value: 'design' },
        ],
      },
      initialValue: 'documentation',
    }),
    defineField({
      name: 'content',
      title: 'Detailed Notes',
      type: 'text',
      rows: 10,
      description: 'The core technical or strategic detail.'
    }),
    defineField({
      name: 'status',
      title: 'Operational Status',
      type: 'string',
      options: {
        list: [
          { title: 'Success / Verified', value: 'Success' },
          { title: 'Info / Draft', value: 'Info' },
          { title: 'Warning / Review Needed', value: 'Warning' },
        ],
      },
      initialValue: 'Info',
    }),
    defineField({
      name: 'timestamp',
      title: 'Event Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      nature: 'nature',
      date: 'timestamp',
    },
    prepare({ title, nature, date }) {
      const icons: any = {
        implementation: '🟢',
        documentation: '🔵',
        security: '🔴',
        design: '🏺',
      }
      return {
        title: title,
        subtitle: `${icons[nature] || '📝'} ${nature} | ${new Date(date).toLocaleDateString()}`,
      };
    },
  },
});
