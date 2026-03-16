export const productsForHomeQuery = `*[_type == "product"]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current
}`

export const productsForCategoryQuery = `*[_type == "product" && category->slug.current == $category]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock, isFeatured
}`

export const categoriesQuery = `*[_type == "category"]{
    _id, title, "slug": slug.current
}`
export const bulletinQuery = `[
  ...*[_type == "bulletin" && bulletinType == "news"] | order(_createdAt desc)[0...3],
  ...*[_type == "bulletin" && (bulletinType == "promotion" || bulletinType == "event")] | order(_createdAt desc)
]{
    _id, title, content, bulletinType, "slug": slug.current, mainImage, createdAt
}`
export const heroImageQuery = `*[_type == "heroImage"]{
    _id, title, "slug": slug.current, mainImage, createdAt
}`

export const allProductsQuery = `*[_type == "product"] | order(category->title asc, title asc) {
    _id,
    title,
    price,
    mainImage,
    "category": category->{title, "slug": slug.current},
    description,
    "slug": slug.current
}`
