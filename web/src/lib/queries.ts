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
