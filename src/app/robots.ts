import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/history'] },
    sitemap: 'https://resumescore-phi.vercel.app/sitemap.xml' };
}
