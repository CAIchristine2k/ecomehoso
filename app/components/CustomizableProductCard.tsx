import React from 'react';
import {Link} from 'react-router';
import {Image as ImageIcon, Pencil, Sparkles} from 'lucide-react';
import {Image as ShopifyImage} from '@shopify/hydrogen';
import {FormattedMoney} from '~/components/FormattedMoney';
import {useConfig} from '~/utils/themeContext';

// Internal components
function Image({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
}) {
  if (!src) return null;

  // Check if the src is a GID
  if (src.startsWith('gid://shopify/MediaImage/')) {
    // For GIDs, we need to use ShopifyImage
    return (
      <ShopifyImage
        data={{
          url: '', // This will be resolved by ShopifyImage
          id: src, // The GID will be used to resolve the image
          altText: alt || 'Product image',
        }}
        className={className || 'w-full h-full object-cover'}
        sizes={sizes}
      />
    );
  }

  // For regular URLs, use standard img tag
  return (
    <img
      src={src}
      alt={alt || 'Product image'}
      className={className || 'w-full h-full object-cover'}
      sizes={sizes}
    />
  );
}

function PriceRange({priceRange}: {priceRange: any}) {
  if (!priceRange?.minVariantPrice) return null;

  const {minVariantPrice, maxVariantPrice} = priceRange;
  const minPrice = minVariantPrice.amount;
  const maxPrice = maxVariantPrice?.amount;

  // Different prices in the range
  if (maxPrice && parseFloat(minPrice) < parseFloat(maxPrice)) {
    return (
      <div className="flex items-center gap-1">
        <FormattedMoney data={minVariantPrice} className="text-primary font-bold" />
        <span className="text-gray-400">-</span>
        <FormattedMoney data={maxVariantPrice} className="text-primary font-bold" />
      </div>
    );
  }

  // Same price or no max price
  return <FormattedMoney data={minVariantPrice} className="text-primary font-bold" />;
}

interface CustomizableProductCardProps {
  product: any;
}

export function CustomizableProductCard({
  product,
}: CustomizableProductCardProps) {
  const config = useConfig();

  if (!product) return null;

  const {handle, title, images, priceRange} = product;
  const firstImage = images?.nodes?.[0];

  // Check if this product has a custom variant
  const customVariant = product.variants?.nodes?.find(
    (variant: any) => variant?.title?.toLowerCase?.() === 'custom',
  );

  // Check if custom variant is out of stock
  const isCustomVariantOutOfStock =
    customVariant && !customVariant.availableForSale;

  return (
    <div className="group relative flex flex-col bg-black/40 backdrop-blur-sm border border-primary/30 p-4 rounded-sm overflow-hidden h-full shadow-md hover:shadow-lg transition-all duration-300">
      {isCustomVariantOutOfStock && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-sm">
          Out of Stock
        </div>
      )}

      <Link
        to={`/customize-product/${handle}`}
        className="block relative overflow-hidden rounded-sm mb-4 aspect-[4/5]"
      >
        {firstImage ? (
          <div className="relative w-full h-full overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <Image
              src={firstImage.url}
              alt={firstImage.altText || title}
              className={`w-full h-full object-cover ${isCustomVariantOutOfStock ? 'opacity-70' : ''}`}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center bg-primary text-black px-3 py-1 rounded-sm text-sm font-medium shadow-md">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Design Your Own
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </Link>

      <div className="flex-grow">
        <h3 className="text-white font-medium mb-1 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {priceRange && (
          <div className="text-gray-300 text-sm mb-3">
            <PriceRange priceRange={priceRange} />
          </div>
        )}

        <p className="text-gray-400 text-sm mb-4">
          Create your own custom design
        </p>
      </div>

      <Link
        to={`/customize-product/${handle}`}
        className={`w-full inline-flex items-center justify-center ${
          isCustomVariantOutOfStock
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-600'
        } text-black font-bold py-2 px-4 rounded-sm transition duration-300 ease-in-out`}
      >
        <Pencil className="w-4 h-4 mr-2" />
        {isCustomVariantOutOfStock ? 'Currently Unavailable' : 'Customize Now'}
      </Link>
    </div>
  );
}
