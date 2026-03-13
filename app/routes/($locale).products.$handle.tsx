import {redirect, type LoaderFunctionArgs} from 'react-router';
import {useLoaderData, type MetaFunction, Link} from 'react-router';
import {useState, useCallback, useEffect, useMemo} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
  parseGid,
} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getConfig} from '~/utils/config';
import {useConfig} from '~/utils/themeContext';
import {ProductForm} from '~/components/ProductForm';
import {Suspense} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const config = getConfig();
  return [
    {title: `${config.brandName} | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const config = getConfig();

  return {
    ...deferredData,
    ...criticalData,
    config: {
      ...config,
      theme: config.influencerName.toLowerCase().replace(/\s+/g, '-'),
    },
  };
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const selectedOptions = getSelectedProductOptions(request);

  const data = await storefront.query(PRODUCT_QUERY, {
    variables: {handle},
  });

  if (!data.product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: data.product});

  return {
    product: data.product,
    recommendedProducts: data.recommendedProducts?.nodes || [],
    storeDomain: storefront.getShopifyDomain(),
  };
}

function loadDeferredData({context, params}: LoaderFunctionArgs) {
  return {};
}

export default function Product() {
  const {product, recommendedProducts, storeDomain} =
    useLoaderData<typeof loader>();
  const config = useConfig();

  const [currentVariant, setCurrentVariant] = useState(
    product?.selectedVariant ?? product?.variants?.nodes[0],
  );

  useEffect(() => {
    setCurrentVariant(product?.selectedVariant ?? product?.variants?.nodes[0]);
  }, [product?.selectedVariant, product?.variants?.nodes]);

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 text-center" style={{backgroundColor: 'var(--color-cream)'}}>
        <h1 className="mb-6" style={{fontSize: '1.5rem', fontWeight: 400, color: 'var(--color-charcoal)'}}>Produit introuvable</h1>
        <p className="mb-8" style={{color: 'var(--color-stone)'}}>Le produit que vous recherchez n'existe pas.</p>
        <Link
          to="/collections/all"
          className="inline-block py-3 px-8 rounded-sm"
          style={{backgroundColor: 'var(--color-matcha-mid)', color: 'white', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' as const}}
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  const analytics = {
    products: [
      {
        productGid: product.id,
        variantGid: currentVariant?.id || product.variants.nodes[0]?.id,
        name: product.title,
        variantName: currentVariant?.title || product.variants.nodes[0]?.title,
        brand: product.vendor,
        price:
          currentVariant?.price?.amount ||
          product.variants.nodes[0]?.price?.amount,
      },
    ],
    pageType: 'product',
  };

  const featuredImage = product.featuredImage;

  // Get variant-specific images
  const getVariantImages = useCallback(
    (variant: any) => {
      if (!variant) return [];
      const mediaNodes = product.media?.nodes || [];
      const allImages = product.images?.nodes || [];

      const variantImgsMetafield = variant.metafields?.find(
        (metafield: any) =>
          metafield?.namespace === 'custom' &&
          metafield?.key === 'variant_imgs',
      );

      if (variantImgsMetafield?.value) {
        try {
          const imageIdentifiers = JSON.parse(variantImgsMetafield.value) as string[];
          return imageIdentifiers
            .map((identifier: string, index: number) => {
              if (!identifier.startsWith('gid://')) {
                return {
                  id: `variant-img-${variant.id}-${index}`,
                  url: identifier,
                  altText: `${variant.title} - Image ${index + 1}`,
                  width: 800,
                  height: 800,
                };
              }
              const mediaId = identifier.split('/').pop() || '';
              const matchedMedia = mediaNodes.find(
                (node: any) =>
                  node.id === identifier ||
                  (node.id?.includes(mediaId) && node.__typename === 'MediaImage'),
              );
              if (matchedMedia?.image?.url) {
                return {
                  id: matchedMedia.id || `variant-img-${variant.id}-${index}`,
                  url: matchedMedia.image.url,
                  altText: matchedMedia.image.altText || `${variant.title} - Image ${index + 1}`,
                  width: matchedMedia.image.width || 800,
                  height: matchedMedia.image.height || 800,
                };
              }
              const matchingImage = allImages.find(
                (img: any) => img.id === identifier || img.id?.includes(mediaId),
              );
              if (matchingImage?.url) {
                return {
                  id: matchingImage.id || `variant-img-${variant.id}-${index}`,
                  url: matchingImage.url,
                  altText: matchingImage.altText || `${variant.title} - Image ${index + 1}`,
                  width: matchingImage.width || 800,
                  height: matchingImage.height || 800,
                };
              }
              return null;
            })
            .filter(Boolean);
        } catch (e) {
          return [];
        }
      }
      return [];
    },
    [product.media?.nodes, product.images?.nodes],
  );

  const [activeImage, setActiveImage] = useState<any>(null);
  const [customVariantImages, setCustomVariantImages] = useState<any[]>([]);

  useEffect(() => {
    if (currentVariant) {
      const newVariantImages = getVariantImages(currentVariant);
      setCustomVariantImages(newVariantImages);
      if (currentVariant.image?.url) {
        setActiveImage(currentVariant.image);
      } else if (newVariantImages.length > 0) {
        setActiveImage(newVariantImages[0]);
      } else if (featuredImage?.url) {
        setActiveImage(featuredImage);
      }
    }
  }, [currentVariant, getVariantImages, featuredImage]);

  const displayImages = useMemo(() => {
    if (!currentVariant) {
      return [{
        id: 'placeholder-image',
        url: 'https://placehold.co/800x800?text=No+Image+Available',
        altText: 'No image available',
        width: 800,
        height: 800,
      }];
    }
    const variantImages = [
      ...(currentVariant.image?.url ? [currentVariant.image] : []),
      ...customVariantImages,
    ];
    if (variantImages.length === 0) {
      return [{
        id: 'placeholder-image',
        url: 'https://placehold.co/800x800?text=No+Image+Available',
        altText: 'No image available',
        width: 800,
        height: 800,
      }];
    }
    return variantImages;
  }, [currentVariant, customVariantImages]);

  useEffect(() => {
    if (
      displayImages.length > 0 &&
      (!activeImage || !displayImages.some((img) => img.id === activeImage.id))
    ) {
      setActiveImage(displayImages[0]);
    }
  }, [displayImages, activeImage]);

  // Description truncation
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionText = product.description || '';
  const shouldTruncate = descriptionText.length > 200;
  const truncatedDescription = shouldTruncate
    ? descriptionText.substring(0, 200) + '...'
    : descriptionText;

  // Benefits list
  const benefits = [
    'Donne de l\'energie',
    'Favorise la concentration',
    'Boost peau & cheveux',
    'Renforce l\'immunite',
    'Antioxydant',
    'Effet apaisant',
  ];

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <div style={{backgroundColor: 'var(--color-cream)', minHeight: '100vh'}}>
      <div className="max-w-[1400px] mx-auto" style={{paddingTop: 'calc(var(--header-height-desktop) + 1rem)'}}>

        {/* Product Grid - Image left, Info right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* LEFT: Image Gallery with vertical thumbnails */}
          <div className="relative flex">
            {/* Vertical Thumbnails */}
            {displayImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 pr-4 py-4 pl-4">
                {displayImages.map((image: any) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(image)}
                    className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200"
                    style={{
                      border: activeImage?.id === image.id
                        ? '2px solid var(--color-charcoal)'
                        : '2px solid var(--color-cream-dark)',
                      opacity: activeImage?.id === image.id ? 1 : 0.7,
                    }}
                  >
                    <Image
                      data={image}
                      className="w-full h-full object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div
              className="flex-1 flex items-center justify-center p-8 lg:p-12"
              style={{
                backgroundColor: 'var(--color-cream-warm)',
                minHeight: '500px',
              }}
            >
              {activeImage ? (
                <div className="relative w-full max-w-[500px] aspect-square">
                  <Image
                    data={activeImage}
                    className="w-full h-full object-contain"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  {currentVariant && !currentVariant.availableForSale && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="px-6 py-2 uppercase tracking-wider transform -rotate-12 text-lg shadow-lg"
                        style={{
                          backgroundColor: 'var(--color-stone)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      >
                        Epuise
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{color: 'var(--color-stone)'}}>Pas d'image</span>
                </div>
              )}
            </div>

            {/* Mobile thumbnails - horizontal */}
            {displayImages.length > 1 && (
              <div className="flex md:hidden gap-2 px-4 py-3 overflow-x-auto absolute bottom-0 left-0 right-0"
                style={{backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)'}}
              >
                {displayImages.map((image: any) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(image)}
                    className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200"
                    style={{
                      border: activeImage?.id === image.id
                        ? '2px solid var(--color-charcoal)'
                        : '2px solid var(--color-cream-dark)',
                    }}
                  >
                    <Image
                      data={image}
                      className="w-full h-full object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="px-6 lg:px-12 py-8 lg:py-10 overflow-y-auto" style={{maxHeight: 'calc(100vh - var(--header-height-desktop))'}}>
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 flex-wrap" style={{fontSize: '12px', color: 'var(--color-stone)'}}>
                <li><Link to="/" className="hover:underline">Accueil</Link></li>
                <li>/</li>
                <li><Link to="/collections/all" className="hover:underline">Home page</Link></li>
                <li>/</li>
                <li style={{color: 'var(--color-charcoal)'}}>{product.title}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1
              className="mb-5"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              {product.title}
            </h1>

            {/* Description with "Voir plus" */}
            <div className="mb-6" style={{fontSize: '14px', color: 'var(--color-stone)', lineHeight: 1.8}}>
              <p>
                {showFullDescription ? descriptionText : truncatedDescription}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="underline mt-1"
                  style={{color: 'var(--color-charcoal)', fontWeight: 500}}
                >
                  {showFullDescription ? 'Voir moins' : 'Voir plus'}
                </button>
              )}
            </div>

            {/* Benefits Grid - Only for matcha products (not accessories) */}
            {!product.productType?.toLowerCase().includes('accessoire') &&
              !product.tags?.some((t: string) => t.toLowerCase().includes('accessoire')) &&
              (product.title.toLowerCase().includes('matcha') ||
              product.handle.toLowerCase().includes('matcha') ||
              product.handle.toLowerCase().includes('prelude') ||
              product.handle.toLowerCase().includes('foret')) && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{backgroundColor: '#f5c6c2'}}
                    />
                    <span style={{fontSize: '13px', fontWeight: 500, color: 'var(--color-charcoal)'}}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Product Form (Variant Selector + Add to Cart) */}
            <Suspense fallback={<div>Chargement...</div>}>
              <ProductForm
                product={product}
                storeDomain={storeDomain}
                onVariantChange={useCallback(
                  (variant: any) => {
                    setCurrentVariant(variant);
                  },
                  [setCurrentVariant],
                )}
              />
            </Suspense>

            {/* Accordion Sections */}
            <div style={{borderTop: '1px solid var(--color-cream-dark)'}}>
              {/* LIVRAISON */}
              <button
                onClick={() => setOpenAccordion(openAccordion === 'livraison' ? null : 'livraison')}
                className="w-full flex items-center justify-between py-4"
                style={{borderBottom: '1px solid var(--color-cream-dark)'}}
              >
                <span style={{fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--color-charcoal)'}}>
                  Livraison
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${openAccordion === 'livraison' ? 'rotate-180' : ''}`}
                  style={{color: 'var(--color-stone)'}}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordion === 'livraison' && (
                <div className="py-4" style={{fontSize: '13px', color: 'var(--color-stone)', lineHeight: 1.8}}>
                  <p>Livraison GRATUITE a partir de 49€ d'achat.</p>
                  <p>Colissimo : 2-4 jours ouvrables.</p>
                  <p>Chronopost : livraison express en 24h.</p>
                </div>
              )}

              {/* INGREDIENTS */}
              <button
                onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? null : 'ingredients')}
                className="w-full flex items-center justify-between py-4"
                style={{borderBottom: '1px solid var(--color-cream-dark)'}}
              >
                <span style={{fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--color-charcoal)'}}>
                  Ingredients
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${openAccordion === 'ingredients' ? 'rotate-180' : ''}`}
                  style={{color: 'var(--color-stone)'}}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordion === 'ingredients' && (
                <div className="py-4" style={{fontSize: '13px', color: 'var(--color-stone)', lineHeight: 1.8}}>
                  <p>100% the vert matcha (Camellia sinensis) d'origine Uji, Kyoto, Japon.</p>
                  <p>Sans additifs, sans conservateurs, sans colorants.</p>
                </div>
              )}

              {/* PREPARATION */}
              <button
                onClick={() => setOpenAccordion(openAccordion === 'preparation' ? null : 'preparation')}
                className="w-full flex items-center justify-between py-4"
                style={{borderBottom: '1px solid var(--color-cream-dark)'}}
              >
                <span style={{fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--color-charcoal)'}}>
                  Preparation
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${openAccordion === 'preparation' ? 'rotate-180' : ''}`}
                  style={{color: 'var(--color-stone)'}}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordion === 'preparation' && (
                <div className="py-4" style={{fontSize: '13px', color: 'var(--color-stone)', lineHeight: 1.8}}>
                  <p>1. Tamiser 1 a 2g de matcha dans un bol.</p>
                  <p>2. Verser 70ml d'eau chaude (70-80°C).</p>
                  <p>3. Fouetter energiquement avec un chasen en formant un "M".</p>
                  <p>4. Deguster immediatement.</p>
                </div>
              )}
            </div>

            {/* Cross-sell: Complétez votre achat */}
            {recommendedProducts.length > 0 && (
              <div className="mt-8">
                <h3
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--color-charcoal)',
                    marginBottom: '12px',
                  }}
                >
                  Completez votre achat
                </h3>
                <div className="flex flex-col gap-3">
                  {recommendedProducts.slice(0, 2).map((crossProduct: any) => (
                    <div
                      key={crossProduct.id}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        border: '1px solid var(--color-cream-dark)',
                        backgroundColor: 'var(--color-cream)',
                      }}
                    >
                      {crossProduct.featuredImage && (
                        <Link to={`/products/${crossProduct.handle}`} className="flex-shrink-0">
                          <Image
                            data={crossProduct.featuredImage}
                            className="w-16 h-16 object-contain rounded-lg"
                            sizes="64px"
                          />
                        </Link>
                      )}
                      <div className="flex-1 min-w-0">
                        <p style={{fontSize: '14px', fontWeight: 600, color: 'var(--color-charcoal)', lineHeight: 1.3}}>
                          {crossProduct.title}
                        </p>
                        <p style={{fontSize: '14px', color: 'var(--color-stone)', marginTop: '2px'}}>
                          {crossProduct.priceRange?.minVariantPrice && (
                            <Money data={crossProduct.priceRange.minVariantPrice} />
                          )}
                        </p>
                      </div>
                      <Link
                        to={`/products/${crossProduct.handle}`}
                        className="flex-shrink-0 transition-all duration-300 hover:scale-105"
                        style={{
                          padding: '8px 20px',
                          border: '1.5px solid var(--color-charcoal)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase' as const,
                          color: 'var(--color-charcoal)',
                          textDecoration: 'none',
                        }}
                      >
                        Voir
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {recommendedProducts.length > 0 && (
          <div className="px-6 md:px-10 py-16" style={{borderTop: '1px solid var(--color-cream-dark)'}}>
            <h2
              className="mb-8 text-center"
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: 400,
                color: 'var(--color-charcoal)',
              }}
            >
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
              {recommendedProducts.map((relatedProduct: any) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.handle}`}
                  className="group flex flex-col"
                >
                  <div
                    className="rounded-lg overflow-hidden mb-3 relative flex-shrink-0"
                    style={{
                      border: '1px solid var(--color-cream-dark)',
                      backgroundColor: 'var(--color-cream-warm)',
                      aspectRatio: '1 / 1',
                    }}
                  >
                    {relatedProduct.featuredImage && (
                      <Image
                        data={relatedProduct.featuredImage}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(min-width: 768px) 25vw, 50vw"
                      />
                    )}
                    {relatedProduct.variants?.nodes[0] &&
                      !relatedProduct.variants.nodes[0].availableForSale && (
                        <div
                          className="absolute top-2 right-2 text-white text-[11px] font-medium px-3 py-1"
                          style={{
                            backgroundColor: 'var(--color-stone)',
                            borderRadius: '20px',
                          }}
                        >
                          Epuise
                        </div>
                      )}
                  </div>
                  <h3
                    className="transition-colors duration-300 group-hover:text-[#3d6b4f]"
                    style={{
                      fontWeight: 500,
                      fontSize: '14px',
                      color: 'var(--color-charcoal)',
                    }}
                  >
                    {relatedProduct.title}
                  </h3>
                  {relatedProduct.variants?.nodes[0] && (
                    <div
                      className="mt-1 price-no-hover"
                      style={{
                        color: 'var(--color-matcha-light)',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      <Money data={relatedProduct.variants.nodes[0].price} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              vendor: product.vendor,
              variantId: currentVariant?.id || '',
              variantTitle: currentVariant?.title || '',
              price: currentVariant?.price?.amount || '0',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query ProductDetails($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      vendor
      tags
      productType
      featuredImage {
        id
        url(transform: {maxWidth: 800, maxHeight: 800, crop: CENTER})
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          id
          url(transform: {maxWidth: 800, maxHeight: 800, crop: CENTER})
          altText
          width
          height
        }
      }
      media(first: 20) {
        nodes {
          id
          ... on MediaImage {
            image {
              id
              url(transform: {maxWidth: 800, maxHeight: 800, crop: CENTER})
              altText
              width
              height
            }
          }
        }
      }
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: []) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url(transform: {maxWidth: 800, maxHeight: 800, crop: CENTER})
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          image {
            id
            url(transform: {maxWidth: 800, maxHeight: 800, crop: CENTER})
            altText
            width
            height
          }
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          sku
          metafields(identifiers: [{namespace: "custom", key: "variant_imgs"}]) {
            key
            value
            namespace
          }
        }
      }
      seo {
        title
        description
      }
      metafields(identifiers: [{namespace: "custom", key: "related_products"}]) {
        key
        value
      }
    }

    recommendedProducts: products(first: 4, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        vendor
        featuredImage {
          id
          url(transform: {maxWidth: 800, maxHeight: 800, crop: CENTER})
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
