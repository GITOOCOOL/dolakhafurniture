import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

const BASE_URL = 'https://dolakhafurniture.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all product slugs
  const products = await client.fetch(`*[_type == "product" && isActive == true]{ "slug": slug.current, _updatedAt }`)
  
  // 2. Fetch all category slugs
  const categories = await client.fetch(`*[_type == "category"]{ "slug": slug.current }`)

  // 3. Static Pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/our-story`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
       url: `${BASE_URL}/new-arrivals`,
       lastModified: new Date(),
       changeFrequency: 'weekly' as const,
    }
  ]

  // 4. Product Pages
  const productPages = products.map((product: any) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 5. Category Pages
  const categoryPages = categories.map((category: any) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
