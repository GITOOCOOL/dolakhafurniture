import { client } from '@/lib/sanity'
import { MetadataRoute } from 'next'
export default async function robots(): Promise<MetadataRoute.Robots> {
  const domain = 'https://dolakhafurniture.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/api/', '/checkout/'],
    },
    sitemap: `${domain}/sitemap.xml`,
  }
}
