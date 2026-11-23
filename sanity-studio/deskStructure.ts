import { ListItemBuilder, StructureBuilder } from 'sanity/structure'

// The one Business Meta Data document (Dolakha Furniture). Pinned to its existing id so no
// data has to move; the site reads the first businessMetaData doc, so there must only be one.
export const BUSINESS_META_DATA_ID = 'f3e81b60-cd37-4a04-9eb4-ec5cbba6ebca'

export const singletonTypes = new Set(['checkoutSettings', 'businessMetaData'])

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
      S.listItem()
        .title('Business Meta Data')
        .id('businessMetaData')
        .child(
          S.document()
            .schemaType('businessMetaData')
            .documentId(BUSINESS_META_DATA_ID)
        ),
      
      S.divider(),

      // Filter out singleton types from the global list
      ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) => !singletonTypes.has(listItem.getId() || '')
      ),
    ])
