import {redirect, type LoaderFunctionArgs} from 'react-router';
import {useLoaderData, type MetaFunction, Link} from 'react-router';
import {useState, useCallback, useEffect, useMemo, useRef} from 'react';
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
  CacheShort,
} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getConfig} from '~/utils/config';
import {useConfig} from '~/utils/themeContext';
import {getProductRating} from '~/utils/productRatings';
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
    cache: CacheShort(),
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
    const placeholder = [{
      id: 'placeholder-image',
      url: 'https://placehold.co/800x800?text=No+Image+Available',
      altText: 'No image available',
      width: 800,
      height: 800,
    }];

    // Use ALL product images as the base
    const allProductImages = product.images?.nodes || [];

    // If we have product images, use them (deduplicated by URL)
    if (allProductImages.length > 0) {
      const seenUrls = new Set<string>();
      const unique = allProductImages.filter((img: any) => {
        if (!img.url || seenUrls.has(img.url)) return false;
        seenUrls.add(img.url);
        return true;
      });

      // Put current variant image first if it exists
      if (currentVariant?.image?.url) {
        const variantUrl = currentVariant.image.url;
        const variantIdx = unique.findIndex((img: any) => img.url === variantUrl);
        if (variantIdx > 0) {
          const [variantImg] = unique.splice(variantIdx, 1);
          unique.unshift(variantImg);
        } else if (variantIdx === -1) {
          unique.unshift(currentVariant.image);
        }
      }

      return unique.length > 0 ? unique : placeholder;
    }

    // Fallback to variant image or featured image
    if (currentVariant?.image?.url) return [currentVariant.image];
    if (product.featuredImage?.url) return [product.featuredImage];
    return placeholder;
  }, [currentVariant, product.images?.nodes, product.featuredImage]);

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

  // Image carousel state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left -> next (loop to first)
        const newIndex = activeImageIndex === displayImages.length - 1 ? 0 : activeImageIndex + 1;
        setActiveImageIndex(newIndex);
        setActiveImage(displayImages[newIndex]);
      } else if (diff < 0) {
        // Swipe right -> prev (loop to last)
        const newIndex = activeImageIndex === 0 ? displayImages.length - 1 : activeImageIndex - 1;
        setActiveImageIndex(newIndex);
        setActiveImage(displayImages[newIndex]);
      }
    }
  };

  const goToImage = (index: number) => {
    setActiveImageIndex(index);
    setActiveImage(displayImages[index]);
  };

  // Sync activeImageIndex when activeImage changes (e.g. from thumbnail click)
  useEffect(() => {
    if (activeImage) {
      const idx = displayImages.findIndex((img: any) => img.id === activeImage.id);
      if (idx >= 0 && idx !== activeImageIndex) {
        setActiveImageIndex(idx);
      }
    }
  }, [activeImage, displayImages]);

  // Benefits list
  const benefits = [
    'Donne de l\'énergie',
    'Favorise la concentration',
    'Boost peau & cheveux',
    'Renforce l\'immunité',
    'Antioxydant',
    'Effet apaisant',
  ];

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <div style={{backgroundColor: 'var(--color-cream)'}}>
      <div className="max-w-[1400px] mx-auto" style={{paddingTop: 'calc(var(--header-height-desktop) + 1rem)'}}>

        {/* Mobile: Breadcrumb + Title above image */}
        <div className="lg:hidden px-6" style={{paddingTop: 'calc((var(--header-height-desktop) + 1rem) / 2)'}}>
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap" style={{fontSize: '12px', color: 'var(--color-stone)'}}>
              <li><Link to="/" className="hover:underline">Accueil</Link></li>
              <li>/</li>
              <li><Link to="/collections/all" className="hover:underline">Boutique</Link></li>
              <li>/</li>
              <li style={{color: 'var(--color-charcoal)'}}>{product.title}</li>
            </ol>
          </nav>
          <h1
            className="mb-2"
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
          <ProductPageRating handle={product.handle} />
        </div>

        {/* Product Grid - Image left, Info right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* LEFT: Image Gallery */}
          <div className="relative lg:flex lg:flex-row">
            {/* Desktop: Vertical Thumbnails */}
            {displayImages.length > 1 && (
              <div className="hidden lg:flex flex-col gap-3 pr-4 py-4 pl-4">
                {displayImages.map((image: any) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(displayImages.indexOf(image))}
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

            {/* Main Image with swipe support */}
            <div
              className="lg:flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 relative"
              style={{
                backgroundColor: 'var(--color-cream-warm)',
              }}
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
              onTouchEnd={handleSwipe}
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
                        Épuisé
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{color: 'var(--color-stone)'}}>Pas d'image</span>
                </div>
              )}

              {/* Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => goToImage(activeImageIndex === 0 ? displayImages.length - 1 : activeImageIndex - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-opacity duration-200"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      color: 'var(--color-charcoal)',
                      opacity: 0.7,
                      backdropFilter: 'blur(4px)',
                    }}
                    aria-label="Image précédente"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => goToImage(activeImageIndex === displayImages.length - 1 ? 0 : activeImageIndex + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-opacity duration-200"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      color: 'var(--color-charcoal)',
                      opacity: 0.7,
                      backdropFilter: 'blur(4px)',
                    }}
                    aria-label="Image suivante"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="px-6 lg:px-12 py-6 lg:py-10">
            {/* Breadcrumb - Desktop only */}
            <nav className="hidden lg:block mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 flex-wrap" style={{fontSize: '12px', color: 'var(--color-stone)'}}>
                <li><Link to="/" className="hover:underline">Accueil</Link></li>
                <li>/</li>
                <li><Link to="/collections/all" className="hover:underline">Boutique</Link></li>
                <li>/</li>
                <li style={{color: 'var(--color-charcoal)'}}>{product.title}</li>
              </ol>
            </nav>

            {/* Title - Desktop only */}
            <h1
              className="hidden lg:block mb-3"
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

            {/* Rating */}
            <ProductPageRating handle={product.handle} />

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

            {/* Benefits Grid - Only for matcha tea products (not accessories) */}
            {product.title.toLowerCase().includes('matcha') &&
              !product.title.toLowerCase().includes('bol') &&
              !product.title.toLowerCase().includes('fouet') &&
              !product.title.toLowerCase().includes('chasen') &&
              !product.title.toLowerCase().includes('cuillère') &&
              !product.title.toLowerCase().includes('support') &&
              !product.productType?.toLowerCase().includes('accessoire') &&
              !product.tags?.some((t: string) => t.toLowerCase().includes('accessoire')) && (
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
                  <p>Livraison GRATUITE à partir de 49€ d'achat.</p>
                  <p>Colissimo : 2-3 jours ouvrables.</p>
                  <p>Mondial Relay : 3-5 jours ouvrables.</p>
                </div>
              )}

              {/* INGREDIENTS */}
              <button
                onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? null : 'ingredients')}
                className="w-full flex items-center justify-between py-4"
                style={{borderBottom: '1px solid var(--color-cream-dark)'}}
              >
                <span style={{fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--color-charcoal)'}}>
                  Ingrédients
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
                  <p>100% thé vert matcha (Camellia sinensis) d'origine Uji, Kyoto, Japon.</p>
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
                  Préparation
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
                  <p>1. Tamiser 1 à 2g de matcha dans un bol.</p>
                  <p>2. Verser 70ml d'eau chaude (70-80°C).</p>
                  <p>3. Fouetter énergiquement avec un chasen en formant un "M".</p>
                  <p>4. Déguster immédiatement.</p>
                </div>
              )}
            </div>

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
                          Épuisé
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

function ProductPageRating({handle}: {handle: string}) {
  const {rating, reviewCount} = getProductRating(handle);
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < fullStars ? 'var(--color-matcha-mid)' : (i === fullStars && hasHalf ? 'url(#halfPDP)' : 'none')}
            stroke="var(--color-matcha-mid)"
            strokeWidth="1.5"
          >
            {i === fullStars && hasHalf && (
              <defs>
                <linearGradient id="halfPDP">
                  <stop offset="50%" stopColor="var(--color-matcha-mid)" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span style={{fontSize: '13px', color: 'var(--color-stone)', fontWeight: 400}}>
        {rating}/5
      </span>
      <span style={{fontSize: '13px', color: 'var(--color-mist)'}}>
        ({reviewCount} avis)
      </span>
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
