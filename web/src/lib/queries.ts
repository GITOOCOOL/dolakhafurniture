export const productsForHomeQuery = `*[_type == "product" && isActive == true]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, stock
}`

export const productsForCategoryQuery = `*[_type == "product" && category->slug.current == $category && isActive == true]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, stock
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug && isActive == true][0]{
    _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock, isFeatured, material, length, breadth, height
}`

export const categoriesQuery = `*[_type == "category"]{
    _id, title, "slug": slug.current
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

export const activeCampaignsQuery = `*[_type == "campaign" && status == "active"] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    themeColor,
    tagline,
    description,
    banner,
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
    description,
    banner,
    startDate,
    endDate,
    "vouchers": vouchers[]->{code, details},
    "products": promotedProducts[]-> {
        _id, title, price, mainImage, stock, "slug": slug.current, "category": category->{title, "slug": slug.current}
    }
} `

export const facebookMelaProductsQuery = `*[_type == "campaign" && slug.current == "new-year-maha-mela-2083"][0] {
    "products": promotedProducts[]->[isActive == true && syncToFacebook == true] {
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
    "products": promotedProducts[]->[isActive == true] {
      _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock
    }
}`
