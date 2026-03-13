import React from 'react';
import {ShoppingCart} from 'lucide-react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {useConfig} from '~/utils/themeContext';
import {AddToCartButton} from '~/components/AddToCartButton';

interface ProductWithTags extends ProductItemFragment {
  tags?: string[];
  variants?: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
    }>;
  };
}

export function ProductItem({
  product,
  loading,
}: {
  product: CollectionItemFragment | ProductWithTags;
  loading?: 'eager' | 'lazy';
}) {
  const config = useConfig();
  const variantUrl = useVariantUrl(product.handle);

  if (!product) return null;

  const productWithTags = product as ProductWithTags;
  const {title, handle, featuredImage} = product;

  const price = product.priceRange?.minVariantPrice;
  const comparePrice =
    product.priceRange?.maxVariantPrice &&
    product.priceRange.maxVariantPrice.amount !==
      product.priceRange.minVariantPrice.amount
      ? product.priceRange.maxVariantPrice
      : null;

  const isOnSale =
    comparePrice &&
    price &&
    parseFloat(price.amount) < parseFloat(comparePrice.amount);

  const variants = productWithTags.variants?.nodes || [];
  const firstVariant = variants[0];
  const variantId = firstVariant?.id;
  const isAvailable = firstVariant?.availableForSale ?? true;

  const formatVariantId = (id: string) => {
    if (!id) return '';
    if (id.startsWith('gid://shopify/ProductVariant/')) return id;
    const numericId = id.includes('/') ? id.split('/').pop() || id : id;
    return `gid://shopify/ProductVariant/${numericId}`;
  };

  return (
    <div className="group relative">
      <Link
        to={variantUrl}
        prefetch="intent"
        className="block overflow-hidden transition-all duration-400"
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
        <div className="relative overflow-hidden" style={{aspectRatio: '1'}}>
          {featuredImage ? (
            <Image
              data={featuredImage}
              alt={title}
              className="w-full h-full object-contain object-center transform group-hover:scale-[1.08] transition-transform duration-700 p-4"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              loading={loading}
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center"
              style={{background: 'linear-gradient(135deg, #f5f3ef 0%, #e8e4dc 100%)'}}
            >
              <span style={{fontSize: '3rem', color: '#c4b5a0'}}>{title.charAt(0)}</span>
            </div>
          )}

          {/* Labels */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOnSale && (
              <span
                className="text-white text-[11px] font-medium px-3 py-1"
                style={{backgroundColor: '#c97a5c', borderRadius: '20px'}}
              >
                Promo
              </span>
            )}
            {!isAvailable && (
              <span
                className="text-white text-[11px] font-medium px-3 py-1"
                style={{backgroundColor: 'var(--color-stone)', borderRadius: '20px'}}
              >
                Epuise
              </span>
            )}
          </div>

          {/* Quick View overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{background: 'rgba(26, 47, 35, 0.3)'}}>
            <div
              className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
              style={{
                backgroundColor: 'white',
                color: 'var(--color-charcoal)',
                padding: '10px 24px',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 500,
                borderRadius: '4px',
              }}
            >
              Voir le produit
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3
            className="mb-2 transition-colors duration-300 group-hover:text-[#3d6b4f]"
            style={{
              color: 'var(--color-charcoal)',
              fontWeight: 500,
              fontSize: '15px',
              lineHeight: 1.4,
            }}
          >
            {title}
          </h3>

          <div className="flex items-center gap-3">
            {price && (
              <span
                className="price-no-hover"
                style={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--color-matcha-light)',
                }}
              >
                <Money data={price} />
              </span>
            )}

            {isOnSale && comparePrice && (
              <span
                className="line-through price-no-hover"
                style={{fontSize: '0.85rem', color: 'var(--color-mist)'}}
              >
                <Money data={comparePrice} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
