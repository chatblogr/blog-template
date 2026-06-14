import { getBlog } from '@/lib/utils';

export async function GET() {
  const blog = await getBlog();

  console.log('Full blog object:', JSON.stringify(blog, null, 2));
  console.log('adsenseId:', blog.adsenseId);
  console.log('Has adsenseId property?', 'adsenseId' in blog);
  console.log('blog keys:', Object.keys(blog));
  
  if (!blog.adsenseId) {
    // Return empty ads.txt if AdSense is not configured
    return new Response('', {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  }

  // Generate ads.txt with the AdSense publisher ID
  // Format: google.com, pub-xxxxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0
  const adsTxtContent = `google.com, ${blog.adsenseId}, DIRECT, f08c47fec0942fa0`;

  return new Response(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    },
  });
}