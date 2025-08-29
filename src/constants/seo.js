// SEO Constants for Creative Ghar
export const SITE_CONFIG = {
  name: 'Creative Ghar',
  description: 'Discover unique and creative products at Creative Ghar. Shop for home decor, fashion, accessories, and more with fast delivery across Pakistan.',
  url: 'https://creativeghar.com',
  ogImage: '/creative-logo.png',
  twitterHandle: '@creativeghar',
  keywords: [
    'creative products',
    'home decor',
    'fashion accessories',
    'online shopping Pakistan',
    'unique gifts',
    'handmade crafts',
    'home essentials',
    'creative ghar',
    'pakistan ecommerce'
  ]
};

export const DEFAULT_SEO = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords.join(', '),
  image: SITE_CONFIG.ogImage,
  url: SITE_CONFIG.url,
  type: 'website',
  siteName: SITE_CONFIG.name,
  locale: 'en_US',
  twitterCard: 'summary_large_image'
};

export const PRODUCT_SEO_TEMPLATE = {
  title: '{productName} - {category} | Creative Ghar',
  description: 'Buy {productName} from Creative Ghar. {description} Available in Pakistan with cash on delivery. Shop now!',
  keywords: '{productName}, {category}, buy online, Pakistan, creative ghar',
  type: 'product'
};

export const CATEGORY_SEO_TEMPLATE = {
  title: '{category} Products | Creative Ghar',
  description: 'Explore our collection of {category} products at Creative Ghar. Quality items with fast delivery across Pakistan.',
  keywords: '{category}, products, online shopping, Pakistan, creative ghar'
};

export const PAGE_SEO = {
  home: {
    title: 'Creative Ghar - Unique Products & Creative Shopping',
    description: 'Discover amazing creative products at Creative Ghar. From home decor to fashion accessories, find unique items with fast delivery in Pakistan.',
    keywords: 'creative products, online shopping, Pakistan, home decor, fashion, accessories, unique gifts'
  },
  products: {
    title: 'All Products | Creative Ghar',
    description: 'Browse our complete collection of creative products. Quality items, competitive prices, and fast delivery across Pakistan.',
    keywords: 'products, online shopping, creative items, Pakistan, buy online'
  },
  checkout: {
    title: 'Checkout | Creative Ghar',
    description: 'Complete your purchase securely at Creative Ghar. Safe checkout with multiple payment options.',
    keywords: 'checkout, payment, secure shopping, creative ghar'
  },
  login: {
    title: 'Login | Creative Ghar',
    description: 'Login to your Creative Ghar account to manage orders and preferences.',
    keywords: 'login, account, creative ghar'
  },
  register: {
    title: 'Register | Creative Ghar',
    description: 'Create your Creative Ghar account for a better shopping experience.',
    keywords: 'register, account, creative ghar'
  },
  'privacy-policy': {
    title: 'Privacy Policy | Creative Ghar',
    description: 'Read our privacy policy to understand how Creative Ghar protects your data and privacy.',
    keywords: 'privacy policy, data protection, creative ghar'
  },
  'refund-policy': {
    title: 'Refund Policy | Creative Ghar',
    description: 'Learn about our refund and return policy at Creative Ghar.',
    keywords: 'refund policy, returns, creative ghar'
  },
  'shipping-policy': {
    title: 'Shipping Policy | Creative Ghar',
    description: 'Check our shipping and delivery information for orders from Creative Ghar.',
    keywords: 'shipping policy, delivery, creative ghar'
  },
  'terms': {
    title: 'Terms & Conditions | Creative Ghar',
    description: 'Read the terms and conditions for shopping at Creative Ghar.',
    keywords: 'terms conditions, creative ghar'
  }
};