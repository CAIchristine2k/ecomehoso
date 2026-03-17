/**
 * Generate consistent product ratings based on product handle.
 * Each product always gets the same rating & review count.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getProductRating(handle: string): {rating: number; reviewCount: number} {
  const hash = hashCode(handle);
  // Rating between 4.5 and 5.0 (steps of 0.1)
  const ratingSteps = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  const rating = ratingSteps[hash % ratingSteps.length];
  // Review count between 500 and 1000
  const reviewCount = 500 + (hash % 501);
  return {rating, reviewCount};
}
