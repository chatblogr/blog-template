import { MetadataRoute } from 'next';
import { getBlog } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = await getBlog();
  const baseUrl = blog.customDomain;
  
  // Get all unique URLs (including redirects)
  const posts: MetadataRoute.Sitemap = blog.posts.flatMap((post: { slug: string; redirects?: string[]; lastModified?: string }) => {
    const urls = [];
    
    // Main post URL
    urls.push({
      url: `${baseUrl}/${post.slug}`,
      lastModified: post.lastModified ? new Date(post.lastModified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    
    return urls;
  });
  
  // Add the homepage
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts,
  ];
}