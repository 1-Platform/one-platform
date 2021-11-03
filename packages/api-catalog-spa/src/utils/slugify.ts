/**
 * This function is used to convert a string to slug
 */
export const slugify = (toBeSlugified: string): string => {
  return toBeSlugified.toLowerCase().replace(/ |[^\w-]+/g, '-');
};
