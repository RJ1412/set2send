import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://set2send.com';
  
  const routes = [
    '',
    '/pricing',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/solutions',
    '/product',
    '/use-cases',
    '/security-hub'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
