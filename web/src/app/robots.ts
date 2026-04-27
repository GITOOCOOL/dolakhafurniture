import { client } from '@/lib/sanity'
import { MetadataRoute } from 'next'
export default async function robots(): Promise<MetadataRoute.Robots> {
  const businessMetaData = await client.fetch(`*[_type == "businessMetaData"][0]{ businessUrl }`);
  const domain = businessMetaData?.businessUrl || 'https://undefined_setmetadata_in_studio.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/api/', '/checkout/'],
    },
    sitemap: `${domain}/sitemap.xml`,
  }
}
