import {type LoaderFunctionArgs} from 'react-router';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {Link} from 'react-router';
import {ArrowLeft} from 'lucide-react';
import {getConfig} from '~/utils/config';

export const meta: MetaFunction<typeof loader> = () => {
  const config = getConfig();
  return [{title: `${config.brandName} | All Products`}];
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
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
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
            Decouvrez notre selection de matchas d'exception, accessoires traditionnels et coffrets soigneusement composes.
          </p>
        </div>

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
            backgroundColor: 'var(--color-cream-warm)',
            border: '1px solid var(--color-cream-dark)',
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
            Chaque produit est selectionne avec soin pour vous offrir une experience authentique du matcha, fidele aux traditions seculaires d'Uji, Kyoto.
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

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
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
