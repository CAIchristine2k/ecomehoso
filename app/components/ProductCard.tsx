import React, {useState} from 'react';
import {ShoppingCart, Eye} from 'lucide-react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {WishlistButton} from '~/components/WishlistButton';
import {LoadingSpinner} from '~/components/LoadingSpinner';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useConfig} from '~/utils/themeContext';
import {getProductRating} from '~/utils/productRatings';

interface VariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price?: any;
  compareAtPrice?: any;
}

interface ProductItemExtendedFragment extends ProductItemFragment {
  description?: string;
  tags?: string[];
  variants?: {
    nodes: Array<VariantNode>;
  };
}

interface ProductCardProps {
  product: ProductItemExtendedFragment;
  loading?: 'eager' | 'lazy';
  label?: string;
  showQuickView?: boolean;
  showWishlist?: boolean;
  customizable?: boolean;
}

export function ProductCard({
  product,
  loading = 'lazy',
  showQuickView = true,
  showWishlist = false,
  customizable = false,
}: ProductCardProps) {
  const config = useConfig();
  const [imageLoading, setImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) return null;

  const {title, handle, featuredImage, tags = []} = product;
  const variants = product.variants?.nodes || [];
  const firstVariant =
    (variants[0] as VariantNode | undefined) || ({} as VariantNode);

  const price = firstVariant?.price;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const isAvailable = Boolean(firstVariant?.availableForSale);
  const variantId = firstVariant?.id;

  const isOnSale =
    compareAtPrice &&
    price &&
    parseFloat(price.amount) < parseFloat(compareAtPrice.amount);

  const hasCustomVariant = product?.variants?.nodes?.some(
    (variant) => variant?.title?.toLowerCase?.() === 'custom',
  );

  const customVariant = product?.variants?.nodes?.find(
    (variant) => variant?.title?.toLowerCase?.() === 'custom',
  );

  const isCustomVariantOutOfStock =
    customVariant && !customVariant.availableForSale;

  if (customizable && !hasCustomVariant) {
    return null;
  }

  const formatVariantId = (id: string) => {
    if (!id) return '';
    if (id.startsWith('gid://shopify/ProductVariant/')) return id;
    const numericId = id.includes('/') ? id.split('/').pop() || id : id;
    return `gid://shopify/ProductVariant/${numericId}`;
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 2000);
  };

  return (
    <div
      className="group relative overflow-hidden transition-all duration-400 flex flex-col h-full"
      style={{
        background: 'white',
        border: '1px solid var(--color-cream-dark)',
        borderRadius: '8px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-matcha-mid)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-cream-dark)';
      }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" style={{aspectRatio: '4/5'}}>
        <Link
          to={`/products/${handle}`}
          prefetch="intent"
          className="block w-full h-full"
          aria-label={`Voir ${title}`}
        >
          {featuredImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-3 md:p-5">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center" style={{background: 'transparent'}}>
                  <LoadingSpinner size="lg" color="primary" />
                </div>
              )}
              <Image
                data={featuredImage}
                className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.08]"
                style={{
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1)) drop-shadow(0 2px 6px rgba(0,0,0,0.06))',
                }}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                loading={loading}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
          ) : (
            <div
              className="h-full w-full flex items-center justify-center"
              style={{background: 'linear-gradient(135deg, #f5f3ef 0%, #e8e4dc 100%)'}}
            >
              <span style={{fontSize: '3rem', color: '#c4b5a0'}}>{title.charAt(0)}</span>
            </div>
          )}
        </Link>

        {/* Product Labels */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnSale && (
            <span
              className="text-white text-[11px] font-medium px-3 py-1"
              style={{
                backgroundColor: '#c97a5c',
                borderRadius: '20px',
              }}
            >
              Promo
            </span>
          )}
          {hasCustomVariant && !isCustomVariantOutOfStock && (
            <span
              className="text-white text-[11px] font-medium px-3 py-1"
              style={{
                backgroundColor: 'var(--color-matcha-mid)',
                borderRadius: '20px',
              }}
            >
              Personnalisable
            </span>
          )}
          {!isAvailable && (
            <span
              className="text-white text-[11px] font-medium px-3 py-1"
              style={{
                backgroundColor: 'var(--color-stone)',
                borderRadius: '20px',
              }}
            >
              Épuisé
            </span>
          )}
        </div>

        {/* Action buttons - visible on hover */}
        <div className="absolute bottom-3 right-3 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0">
          <div className="flex gap-2">
            {showQuickView && (
              <Link
                to={`/products/${handle}`}
                className="bg-white/95 hover:bg-white p-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                style={{color: 'var(--color-charcoal)'}}
                aria-label={`Voir ${title}`}
              >
                <Eye className="w-4 h-4" />
              </Link>
            )}

            {isAvailable && variantId && (
              <div onClick={(e) => e.stopPropagation()}>
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: formatVariantId(variantId),
                      quantity: 1,
                    },
                  ]}
                  selectedVariant={firstVariant}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="text-white p-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center bg-[var(--color-matcha-mid)]"
                >
                  {isAddingToCart ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                </AddToCartButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-5 flex flex-col flex-1">
        <Link
          to={`/products/${handle}`}
          prefetch="intent"
          className="block"
        >
          <h3
            className="mb-1 md:mb-2 transition-colors duration-300 group-hover:text-[#3d6b4f] line-clamp-2"
            style={{
              color: 'var(--color-charcoal)',
              fontWeight: 500,
              fontSize: 'clamp(12px, 3vw, 15px)',
              lineHeight: 1.4,
            }}
          >
            {title}
          </h3>
        </Link>

        {/* Description snippet - hidden on mobile */}
        {product.description && (
          <div className="mb-3 hidden md:block">
            <p
              className="line-clamp-3"
              style={{
                fontSize: '13px',
                color: 'var(--color-stone)',
                lineHeight: 1.6,
              }}
            >
              {product.description}
            </p>
            <Link
              to={`/products/${handle}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block mt-1"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-matcha-mid)',
                letterSpacing: '0.05em',
              }}
            >
              Voir le produit &rarr;
            </Link>
          </div>
        )}

        {/* Rating + Price pushed to bottom */}
        <div className="mt-auto">
        <ProductRatingStars handle={handle} />

        {/* Price Section */}
        <div className="flex items-center gap-3 mt-1">
          {price && (
            <span
              className="price-no-hover"
              style={{
                fontWeight: 600,
                fontSize: 'clamp(0.8rem, 3vw, 1rem)',
                color: 'var(--color-matcha-light)',
              }}
            >
              <Money data={price} />
            </span>
          )}

          {isOnSale && compareAtPrice && (
            <span
              className="line-through price-no-hover"
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-mist)',
              }}
            >
              <Money data={compareAtPrice} />
            </span>
          )}
        </div>

        {/* Mobile Add to Cart */}
        {isAvailable && variantId && (
          <div className="md:hidden pt-2">
            <AddToCartButton
              lines={[
                {
                  merchandiseId: formatVariantId(variantId),
                  quantity: 1,
                },
              ]}
              selectedVariant={firstVariant}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full text-white py-2 px-3 rounded-md transition-all duration-300 font-medium text-[10px] uppercase tracking-[0.1em] bg-[var(--color-matcha-mid)]"
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-1">
                  <LoadingSpinner size="sm" color="white" />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Ajouter
                </div>
              )}
            </AddToCartButton>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function ProductRatingStars({handle}: {handle: string}) {
  const {rating, reviewCount} = getProductRating(handle);
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={i < fullStars ? 'var(--color-matcha-mid)' : (i === fullStars && hasHalf ? 'url(#halfStar)' : 'none')}
            stroke="var(--color-matcha-mid)"
            strokeWidth="1.5"
          >
            {i === fullStars && hasHalf && (
              <defs>
                <linearGradient id="halfStar">
                  <stop offset="50%" stopColor="var(--color-matcha-mid)" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span style={{fontSize: '11px', color: 'var(--color-stone)', fontWeight: 400}}>
        {rating} ({reviewCount})
      </span>
    </div>
  );
}
