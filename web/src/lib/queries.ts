export const productsForHomeQuery = `*[_type == "product"]{
    _id, title, price, mainImage, category, "slug": slug.current
}`

export const productsForCategoryQuery = `*[_type == "product" && category == $category]{
    _id, title, price, mainImage, category, "slug": slug.current
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0]{
    _id, title, price, mainImage, category, "slug": slug.current
}`
