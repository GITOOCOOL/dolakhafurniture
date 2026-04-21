export const productsForHomeQuery = `*[_type == "product" && isActive == true]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, stock
}`

export const productsForCategoryQuery = `*[_type == "product" && category->slug.current == $category && isActive == true]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, stock
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug && isActive == true][0]{
    _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock, isFeatured, material, length, breadth, height
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
    "category": category->{title, "slug": slug.current},
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
    "vouchers": vouchers[]->{code, details}
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
    "vouchers": vouchers[]->{code, details},
    "products": promotedProducts[@->isActive == true]-> {
        _id, title, price, mainImage, stock, "slug": slug.current, "category": category->{title, "slug": slug.current}
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
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock
}`

export const activeCampaignHomeQuery = `*[_type == "campaign" && status == "active"] | order(startDate desc)[0] {
    title,
    "slug": slug.current,
    endDate,
    "vouchers": vouchers[]->code,
    "products": promotedProducts[@->isActive == true]-> {
      _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock
    }
}`

export const welcomeVoucherQuery = `*[_type == "discountVoucher" && isWelcomeVoucher == true && isActive == true][0] {
    code,
    discountValue,
    discountType,
    details
}`

export const activeVouchersQuery = `*[_type == "discountVoucher" && isActive == true] | order(code asc) {
    _id, code, discountValue, discountType, details
}`

export const searchProductsQuery = `*[_type == "product" && isActive == true && (title match $searchTerm || description match $searchTerm || material match $searchTerm || category->title match $searchTerm)] | order(_createdAt desc)[0...12]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, stock
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
  discountValue,
  voucherCodes,
  items[] {
    "title": coalesce(title, product->title),
    "price": coalesce(price, product->price),
    quantity,
    "imageUrl": coalesce(image.asset->url, product->mainImage.asset->url)
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
