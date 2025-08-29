/**
 * Generate SEO-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - SEO-friendly slug
 */
export function generateSlug(text) {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Limit length to 100 characters
    .substring(0, 100);
}

/**
 * Generate unique slug by checking against existing slugs
 * @param {string} baseSlug - Base slug to make unique
 * @param {string[]} existingSlugs - Array of existing slugs to check against
 * @returns {string} - Unique slug
 */
export function generateUniqueSlug(baseSlug, existingSlugs = []) {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} - Whether slug is valid
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;

  // Slug should only contain lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  // Should not start or end with hyphen
  // Should not have consecutive hyphens
  // Should be between 1-100 characters
  return (
    slugRegex.test(slug) &&
    !slug.startsWith('-') &&
    !slug.endsWith('-') &&
    !slug.includes('--') &&
    slug.length >= 1 &&
    slug.length <= 100
  );
}

/**
 * Clean and normalize slug
 * @param {string} slug - Slug to clean
 * @returns {string} - Cleaned slug
 */
export function cleanSlug(slug) {
  if (!slug) return '';

  return generateSlug(slug);
}