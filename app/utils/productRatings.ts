/**
 * Product ratings - fixed per product handle.
 */
const PRODUCT_RATINGS: Record<string, {rating: number; reviewCount: number}> = {
  'matcha-02-foret': {rating: 4.5, reviewCount: 791},
  'matcha-02-foret-copie': {rating: 5, reviewCount: 890},
  'kit-decouvert-prelude-et-foret': {rating: 4.8, reviewCount: 651},
  'matcha-01-prelude-copie': {rating: 4.5, reviewCount: 469},
  'cuillere-a-the-artisanale-hoso-copie': {rating: 5, reviewCount: 562},
  'gres-artisanal-wabi-sabi-copie': {rating: 4.5, reviewCount: 665},
  'kaolin-artisanal-copie': {rating: 4.5, reviewCount: 579},
  'fouet': {rating: 4.9, reviewCount: 723},
  'echantillon-decouvert': {rating: 4.8, reviewCount: 834},
  'echantillon-decouvert-1-piece-foret': {rating: 4.7, reviewCount: 612},
  'kit-voyage': {rating: 4.9, reviewCount: 743},
  'matcha-prelude-15-sachets-individuels-2-g-copie': {rating: 4.8, reviewCount: 856},
};

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
  // Use fixed rating if defined
  if (PRODUCT_RATINGS[handle]) {
    return PRODUCT_RATINGS[handle];
  }
  // Fallback for unknown products
  const hash = hashCode(handle);
  const ratingSteps = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  const rating = ratingSteps[hash % ratingSteps.length];
  const reviewCount = 400 + (hash % 601);
  return {rating, reviewCount};
}
