import React from 'react';
import {Star, Truck, Shield, ArrowLeft} from 'lucide-react';
import {Image, type MappedProductOptions} from '@shopify/hydrogen';
import {FormattedMoney} from '~/components/FormattedMoney';
import {ProductForm} from './ProductForm';
import {Link, useLocation} from 'react-router';
import type {ProductDetailsQuery} from 'storefrontapi.generated';
import type {LandingPageConfig} from '~/utils/config';
import {useConfig} from '~/utils/themeContext';

interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  image: any;
  selectedOptions: Array<{name: string; value: string}>;
  price: {
    amount: string;
    currencyCode: any;
    __typename?: 'MoneyV2';
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: any;
    __typename?: 'MoneyV2';
  } | null;
  sku?: string | null;
}

interface ProductDetailProps {
  product: NonNullable<ProductDetailsQuery['product']>;
  selectedVariant: ProductVariant;
  productOptions: MappedProductOptions[];
  config: LandingPageConfig;
  relatedProducts?: NonNullable<ProductDetailsQuery['product']>[];
}

export function ProductDetail({
  product,
  selectedVariant,
  productOptions,
  config,
  relatedProducts,
}: ProductDetailProps) {
  const location = useLocation();
  const configContext = useConfig();

  // SEO-friendly URL
  const shareUrl = `${location.pathname}${location.search}`;

  const {title, descriptionHtml, vendor} = product;

  // Determine if product has a discount
  const firstVariant = product.variants?.nodes?.[0];
  const isOnSale =
    firstVariant?.compareAtPrice?.amount &&
    firstVariant?.price?.amount &&
    Number(firstVariant.compareAtPrice.amount) >
      Number(firstVariant.price.amount);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/collections/all"
            className="inline-flex items-center text-gold-500 hover:text-gold-400 transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-sm overflow-hidden bg-gray-900/80 backdrop-blur-sm border border-gray-800">
              {selectedVariant?.image && (
                <Image
                  data={selectedVariant.image}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Title & Vendor */}
            <div>
              <div className="inline-block px-4 py-1 bg-gold-500/20 text-gold-500 text-sm font-bold tracking-wider uppercase mb-4 rounded-sm">
                {vendor}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1 text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">(4.9) 247 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <span
                  className={`text-3xl font-bold ${isOnSale ? 'text-red-500' : 'text-gold-500'}`}
                >
                  {selectedVariant?.price && (
                    <FormattedMoney data={selectedVariant.price} />
                  )}
                </span>
                {selectedVariant?.compareAtPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    <FormattedMoney data={selectedVariant.compareAtPrice} />
                  </span>
                )}
              </div>
            </div>

            {/* Product Form */}
            <div className="border-t border-gray-800 pt-6">
              <ProductForm product={product} />
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-800 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-900/80 backdrop-blur-sm rounded-sm border border-gray-800">
                  <Truck className="h-6 w-6 text-gold-500" />
                  <div>
                    <div className="font-bold text-sm text-white">
                      Free Shipping
                    </div>
                    <div className="text-xs text-gray-400">
                      On orders over $100
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-900/80 backdrop-blur-sm rounded-sm border border-gray-800">
                  <Shield className="h-6 w-6 text-gold-500" />
                  <div>
                    <div className="font-bold text-sm text-white">
                      Authentic
                    </div>
                    <div className="text-xs text-gray-400">
                      {config.influencerName} Approved
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-900/80 backdrop-blur-sm rounded-sm border border-gray-800">
                  <Star className="h-6 w-6 text-gold-500" />
                  <div>
                    <div className="font-bold text-sm text-white">
                      Premium Quality
                    </div>
                    <div className="text-xs text-gray-400">
                      Championship Grade
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {descriptionHtml && (
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Product Details
                </h3>
                <div
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </div>
            )}

            {/* Championship Guarantee */}
            <div className="border-t border-gray-800 pt-6">
              <div className="bg-gradient-to-r from-gold-900/20 via-gold-500/10 to-gold-900/20 border border-gold-500/30 rounded-sm p-6">
                <h4 className="text-lg font-bold text-gold-500 mb-2">
                  {config.influencerName}'s Championship Guarantee
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Every product is crafted to championship standards and backed
                  by {config.influencerName}'s legacy of excellence. Train like
                  a champion with gear approved by a{' '}
                  {config.influencerTitle.toLowerCase()}.
                </p>
              </div>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex flex-col md:flex-row justify-between">
                {/* We only display these fields if available in the API response */}
                {/* Comment out these sections to avoid TypeScript errors */}
                {/*
                <div className="flex">
                  <span className="font-medium text-gold-500 w-32">Type:</span>
                  <span className="text-gray-300">{product.productType}</span>
                </div>
                
                <div className="flex">
                  <span className="font-medium text-gold-500 w-32">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <span key={tag} className="bg-gold-500/10 px-2 py-1 rounded-sm text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                */}

                {/* Social Sharing */}
                <div className="flex pt-4 md:pt-0">
                  <span className="font-medium text-gold-500 w-32">Share:</span>
                  <div className="flex gap-4">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-400"
                    >
                      Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-400"
                    >
                      Facebook
                    </a>
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${product.featuredImage?.url}&description=${encodeURIComponent(title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-400"
                    >
                      Pinterest
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="col-span-1 lg:col-span-2 mt-16">
            <h2 className="text-2xl font-bold mb-6 text-gold-500">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.handle}`}
                  className="group"
                >
                  <div className="border border-gold-500/10 rounded-sm overflow-hidden bg-gray-900/80 mb-3">
                    {relatedProduct.featuredImage && (
                      <Image
                        data={relatedProduct.featuredImage}
                        className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                        sizes="(min-width: 768px) 25vw, 50vw"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-gold-500 group-hover:text-gold-400">
                    {relatedProduct.title}
                  </h3>
                  {relatedProduct.variants?.nodes?.[0] && (
                    <div className="mt-1 text-gray-300">
                      <FormattedMoney data={relatedProduct.variants.nodes[0].price} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
