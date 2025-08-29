import { SITE_CONFIG } from '@/constants/seo';

export default async function sitemap() {
  const baseUrl = SITE_CONFIG.url;

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/home/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/home/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/home/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/home/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/home/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic product pages
  let productPages = [];
  try {
    // Fetch products from API
    const response = await fetch(`${baseUrl}/api/product`, {
      cache: 'no-store' // Ensure fresh data
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        productPages = result.data
          .filter(product => product.slug) // Only include products with slugs
          .map(product => ({
            url: `${baseUrl}/home/products/${product.slug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt.seconds * 1000) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          }));
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Dynamic category pages
  let categoryPages = [];
  try {
    // Fetch categories from API
    const response = await fetch(`${baseUrl}/api/category`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        categoryPages = result.data.map(category => ({
          url: `${baseUrl}/home/products/category/${encodeURIComponent(category.name)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}