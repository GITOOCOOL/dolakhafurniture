import { ListItemBuilder, StructureBuilder } from 'sanity/structure'

const singletonTypes = new Set(['checkoutSettings'])

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Dolakha Furniture Base')
    .items([
      // Our Singleton Settings
      S.listItem()
        .title('Checkout Settings')
        .id('checkoutSettings')
        .child(
          S.document()
            .schemaType('checkoutSettings')
            .documentId('checkoutSettings')
        ),
      
      S.divider(),

      // Filter out singleton types from the global list
      ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) => !singletonTypes.has(listItem.getId() || '')
      ),
    ])
