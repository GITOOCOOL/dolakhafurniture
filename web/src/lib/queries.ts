export const productsForHomeQuery = `*[_type == "product" && isActive == true]{
    _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current, description}, "slug": slug.current, description, material, length, breadth, height, stock
}`

export const productsForCategoryQuery = `*[_type == "product" && category->slug.current == $category && isActive == true]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current, description}, "slug": slug.current, description, material, length, breadth, height, stock
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug && isActive == true][0]{
    _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current, description}, "slug": slug.current, description, stock, isFeatured, material, length, breadth, height
}`

export const categoriesQuery = `*[_type == "category" && count(*[_type == "product" && references(^._id) && isActive == true]) > 0] | order(title asc) {
    _id, title, "slug": slug.current, description
} `

export const bulletinQuery = `[
  ...*[_type == "bulletin" && bulletinType == "news"] | order(_createdAt desc)[0...3],
  ...*[_type == "bulletin" && (bulletinType == "promotion" || bulletinType == "event")] | order(_createdAt desc)
]{
    _id, title, content, bulletinType, "slug": slug.current, mainImage, createdAt
} `

export const heroImageQuery = `*[_type == "heroImage"]{
    _id, title, "slug": slug.current, mainImage, createdAt
} `

export const allProductsQuery = `*[_type == "product" && isActive == true] | order(category->title asc, title asc) {
    _id,
    title,
    price,
    mainImage,
    images,
    material,
    length,
    breadth,
    height,
    "category": category->{title, "slug": slug.current, description},
    description,
    "slug": slug.current,
    stock,
    syncToFacebook
}`

export const paymentAccountsQuery = `*[_type == "paymentAccount" && isActive == true]{
    _id, accountName, accountNumber, bankNameOrWalletName, accountType, qrCodeImage, isActive
}`

export const activeCampaignsQuery = `*[_type == "campaign" && status == "active"] | order(isFeatured desc, startDate desc) {
    _id,
    title,
    "slug": slug.current,
    isFeatured,
    themeColor,
    tagline,
    description,
    banner,
    buttonText,
    buttonLink,
    startDate,
    endDate,
    "vouchers": vouchers[]->{code, details, discountValue, discountType, isFirstOrderVoucher, isOneTimePerCustomer, startsImmediately, neverExpires}
}`

export const campaignBySlugQuery = `*[_type == "campaign" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    themeColor,
    tagline,
    buttonText,
    buttonLink,
    description,
    banner,
    startDate,
    endDate,
    "vouchers": vouchers[]->{code, details, discountValue, discountType, isFirstOrderVoucher, isOneTimePerCustomer, startsImmediately, neverExpires},
    "products": promotedProducts[@->isActive == true]-> {
        _id, title, price, mainImage, description, material, length, breadth, height, stock, "slug": slug.current, "category": category->{title, "slug": slug.current, description}
    }
} `

export const facebookMelaProductsQuery = `*[_type == "campaign" && slug.current == "new-year-maha-mela-2083"][0] {
    "products": promotedProducts[@->isActive == true && @->syncToFacebook == true]-> {
        _id,
        title,
        price,
        mainImage,
        description,
        material,
        stock,
        "slug": slug.current,
        "category": category->{title},
        syncToFacebook,
        isActive
    }
}.products`

export const featuredProductsQuery = `*[_type == "product" && isFeatured == true && isActive == true] | order(_createdAt desc){
    _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current, description}, "slug": slug.current, description, stock
}`

export const activeCampaignHomeQuery = `*[_type == "campaign" && status == "active"] | order(startDate desc)[0] {
    title,
    "slug": slug.current,
    endDate,
    description,
    "vouchers": vouchers[]-> { code, discountValue, discountType },
    "products": promotedProducts[@->isActive == true]-> {
      _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current, description}, "slug": slug.current, description, material, length, breadth, height, stock
    }
}`

export const firstOrderVoucherQuery = `*[_type == "discountVoucher" && isFirstOrderVoucher == true && isActive == true][0] {
    code,
    discountValue,
    discountType,
    details,
    isOneTimePerCustomer,
    startsImmediately,
    neverExpires
}`

export const activeVouchersQuery = `*[_type == "discountVoucher" && isActive == true] | order(code asc) {
    _id, code, discountValue, discountType, details
}`

export const searchProductsQuery = `*[_type == "product" && isActive == true && (title match $searchTerm || description match $searchTerm || material match $searchTerm || category->title match $searchTerm)] | order(_createdAt desc)[0...12]{
    _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, material, length, breadth, height, stock
}`

export const allMaterialsQuery = `*[_type == "material"] | order(title asc) {
  _id, title, type, brand, colorCode, "swatchUrl": swatch.asset->url
}`

export const adminOrdersQuery = `*[_type == "order"] | order(_createdAt desc) {
  _id,
  _createdAt,
  orderNumber,
  status,
  orderSource,
  isPhoneOrder,
  internalNotes,
  customerName,
  customerEmail,
  customerPhone,
  totalPrice,
  advanceDeposit,
  discountValue,
  voucherCodes,
  items[] {
    "title": coalesce(title, product->title),
    "price": coalesce(price, product->price),
    quantity,
    "imageUrl": coalesce(image.asset->url, product->mainImage.asset->url),
    isCustom,
    "spec": product-> {
       material,
       color,
       length,
       breadth,
       height,
       description,
       "formica": formica-> { title, brand, colorCode, "swatchUrl": swatch.asset->url },
       "fabric": fabric-> { title, brand, colorCode, "swatchUrl": swatch.asset->url }
    }
  },
  shippingAddress
}`

export const adminInquiriesQuery = `*[_type == "inquiry"] | order(_createdAt desc) {
  _id,
  _createdAt,
  name,
  email,
  phone,
  message,
  inquiryType,
  status,
  productReference-> {
    title,
    "slug": slug.current
  }
}`

export const adminLeadsQuery = `*[_type == "lead"] | order(_createdAt desc) {
  _id,
  _createdAt,
  customerName,
  email,
  phone,
  status,
  priority,
  internalNotes,
  source,
  productReference-> {
    title,
    "slug": slug.current
  },
  originalInquiry-> {
    _id,
    _createdAt,
    message
  }
}`

export const socialMediaQuery = `*[_type == "socialMedia" && isActive == true] | order(isFeatured desc, _createdAt desc) {
    _id,
    title,
    type,
    articleTheme,
    tagline,
    body,
    "videoUrl": videoFile.asset->url,
    "thumbnailUrl": thumbnail.asset->url,
    caption,
    logDate,
    externalUrl,
    isFeatured,
    "linkedProducts": linkedProducts[]-> {
        _id, title, price, "slug": slug.current, mainImage
    }
}`

export const adminLogsQuery = `*[_type == "adminLog"] | order(timestamp desc) {
  _id,
  title,
  timestamp,
  type,
  nature,
  status,
  content,
  metadata
}`
export const checkoutSettingsQuery = `*[_type == "checkoutSettings" && _id == "checkoutSettings"][0] {
  method,
  autoApplyVouchers
}`

export const businessMetaDataQuery = `*[_type == "businessMetaData"][0] {
  businessName,
  tagline,
  phone,
  whatsapp,
  email,
  address,
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  googleMapsUrl,
  businessUrl,
  messengerUrl,
  facebookPixelId
}
`

export const adminContentIdeasQuery = `*[_type == "contentIdea"] | order(createdAt desc) {
  _id,
  title,
  contentType,
  description,
  platform,
  priority,
  status,
  mediaType,
  "imageUrl": referenceImage.asset->url,
  "videoUrl": referenceVideo.asset->url,
  script,
  inspirations,
  "linkedProducts": linkedProducts[]-> {
    title,
    "slug": slug.current
  },
  notes,
  createdAt
}`

export const adminPulseQuery = `*[_type == "trafficPulse"] | order(timestamp desc) [0...100] {
  _id,
  timestamp,
  path,
  sessionID,
  referrer,
  location,
  product-> {
    _id,
    title,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url
  }
}`
