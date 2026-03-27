import {type LoaderFunctionArgs} from 'react-router';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, CacheShort} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {Link} from 'react-router';
import {ArrowLeft} from 'lucide-react';
import {useEffect, useRef} from 'react';
import {getConfig} from '~/utils/config';

export const meta: MetaFunction<typeof loader> = () => {
  const config = getConfig();
  return [
    {title: `Tous nos Produits Matcha | ${config.brandName} - Matcha Premium Uji, Kyoto`},
    {name: 'description', content: "Découvrez tous les produits HOSO MATCHA : matcha cérémonial, matcha culinaire, chasen, chawan, coffrets découverte. Matcha d'exception depuis Uji, Kyoto. Livraison France."},
    {name: 'keywords', content: 'tous produits matcha, acheter matcha, matcha cérémonial, matcha culinaire, chasen, chawan, coffret matcha, accessoires matcha, HOSO MATCHA, matcha Uji, matcha Kyoto'},
    {rel: 'canonical', href: '/collections/all'},
    {property: 'og:title', content: `Tous nos Produits | ${config.brandName}`},
    {property: 'og:description', content: "Tous les produits HOSO MATCHA : matcha cérémonial, culinaire, accessoires traditionnels et coffrets depuis Uji, Kyoto."},
    {property: 'og:type', content: 'website'},
    {property: 'og:locale', content: 'fr_FR'},
    {property: 'og:site_name', content: 'HOSO MATCHA'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: `Tous nos Produits Matcha | ${config.brandName}`},
    {name: 'twitter:description', content: "Matcha cérémonial, culinaire, accessoires et coffrets. Matcha premium depuis Uji, Kyoto."},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Get configuration
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

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 50,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
      cache: CacheShort(),
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {products, config} = useLoaderData<typeof loader>();

  return (
    <div data-theme={config.theme} className="min-h-screen" style={{backgroundColor: 'var(--color-cream)', color: 'var(--color-charcoal)'}}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center transition-colors duration-300"
            style={{color: 'var(--color-matcha-mid)', fontSize: '13px'}}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block mb-4"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-mid)',
            }}
          >
            Collection
          </span>
          <h1
            className="mb-6"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--color-charcoal)',
            }}
          >
            Tous nos produits
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{
              color: 'var(--color-stone)',
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            Découvrez notre sélection de matchas d'exception, accessoires traditionnels et coffrets soigneusement composés.
          </p>
        </div>

        {/* Video Banner */}
        <VideoLoop src="/videos/17687.MOV" />

        {/* Products Grid */}
        <div className="mb-16">
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {({node: product, index}) => {
              const typedProduct =
                product as import('storefrontapi.generated').CollectionItemFragment;

              return (
                <ProductItem
                  key={typedProduct.id}
                  product={typedProduct}
                  loading={index < 8 ? 'eager' : 'lazy'}
                />
              );
            }}
          </PaginatedResourceSection>
        </div>

        {/* Bottom Banner */}
        <div
          className="rounded-lg p-10 text-center"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(220, 215, 205, 0.4)',
          }}
        >
          <h3
            className="mb-4"
            style={{
              fontSize: '1.25rem',
              fontWeight: 400,
              color: 'var(--color-charcoal)',
            }}
          >
            L'excellence du matcha japonais
          </h3>
          <p
            className="max-w-2xl mx-auto mb-6"
            style={{
              color: 'var(--color-stone)',
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            Chaque produit est sélectionné avec soin pour vous offrir une expérience authentique du matcha, fidèle aux traditions séculaires d'Uji, Kyoto.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-mid)',
            }}
          >
            Notre histoire &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

function VideoLoop({src}: {src: string}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      {threshold: 0.25},
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full mb-16 rounded-lg overflow-hidden"
      style={{height: '50vh'}}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    description
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        title
        availableForSale
        price {
          ...MoneyCollectionItem
        }
        compareAtPrice {
          ...MoneyCollectionItem
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
