import { DEFAULT_SEO, PRODUCT_SEO_TEMPLATE, CATEGORY_SEO_TEMPLATE, SITE_CONFIG } from '@/constants/seo';

/**
 * Generate SEO metadata for a product page
 */
export function generateProductSEO(product, baseUrl = SITE_CONFIG.url) {
  if (!product) return DEFAULT_SEO;

  // Use slug if available, otherwise fallback to ID for backward compatibility
  const productIdentifier = product.slug || product._id || product.id;
  const productUrl = `${baseUrl}/home/products/${productIdentifier}`;

  return {
    title: PRODUCT_SEO_TEMPLATE.title
      .replace('{productName}', product.title)
      .replace('{category}', product.category || 'Product'),
    description: PRODUCT_SEO_TEMPLATE.description
      .replace('{productName}', product.title)
      .replace('{description}', product.description || 'High-quality product available at Creative Ghar'),
    keywords: PRODUCT_SEO_TEMPLATE.keywords
      .replace('{productName}', product.title)
      .replace('{category}', product.category || 'product'),
    image: product.images?.[0] || SITE_CONFIG.ogImage,
    url: productUrl,
    type: 'product',
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    twitterCard: 'summary_large_image',
    price: product.discounted_price || product.orignal_price,
    currency: 'PKR',
    availability: product.stock > 0 ? 'in_stock' : 'out_of_stock'
  };
}

/**
 * Generate SEO metadata for a category page
 */
export function generateCategorySEO(category, baseUrl = SITE_CONFIG.url) {
  const categoryUrl = `${baseUrl}/home/products/category/${encodeURIComponent(category)}`;

  return {
    title: CATEGORY_SEO_TEMPLATE.title.replace('{category}', category),
    description: CATEGORY_SEO_TEMPLATE.description.replace('{category}', category),
    keywords: CATEGORY_SEO_TEMPLATE.keywords.replace('{category}', category),
    image: SITE_CONFIG.ogImage,
    url: categoryUrl,
    type: 'website',
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    twitterCard: 'summary_large_image'
  };
}

/**
 * Generate structured data for products (JSON-LD)
 */
export function generateProductStructuredData(product, baseUrl = SITE_CONFIG.url) {
  if (!product) return null;

  const productUrl = `${baseUrl}/home/products/${product._id || product.id}`;
  const imageUrl = product.images?.[0] ? `${baseUrl}${product.images[0]}` : `${baseUrl}${SITE_CONFIG.ogImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": imageUrl,
    "sku": product._id || product.id,
    "brand": {
      "@type": "Brand",
      "name": "Creative Ghar"
    },
    "offers": {
      "@type": "Offer",
      "price": product.discounted_price || product.orignal_price,
      "priceCurrency": "PKR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Creative Ghar"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 0
    } : undefined
  };
}

/**
 * Generate structured data for organization (JSON-LD)
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "logo": `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    "description": SITE_CONFIG.description,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92-XXX-XXXXXXX", // Replace with actual phone
      "contactType": "customer service"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK"
    },
    "sameAs": [
      // Add social media URLs here
    ]
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${SITE_CONFIG.url}${crumb.url}`
    }))
  };
}