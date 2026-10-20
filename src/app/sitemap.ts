import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/analyze', '/privacy'].map(path => ({ url: `https://resumescore-phi.vercel.app${path}` }));
}
