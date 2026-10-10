import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://housing-roommate-platform-project-frontend.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/landlord/', '/dashboard/', '/payment/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
