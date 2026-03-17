import {redirect, type LoaderFunctionArgs} from 'react-router';
import {useLoaderData, type MetaFunction, Link} from 'react-router';
import {getPaginationVariables, Analytics, CacheShort} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {CollectionHeader} from '~/components/CollectionHeader';
import {ArrowLeft} from 'lucide-react';
import {getConfig} from '~/utils/config';
import {useConfig} from '~/utils/themeContext';
import {ProductCard} from '~/components/ProductCard';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const config = getConfig();
  return [
    {
      title: `${config.brandName} | ${data?.collection?.title || ''} Collection`,
    },
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Response('Collection handle is required', {status: 400});
  }

  return await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: handle,
    },
    cache: CacheShort(),
  });
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const config = useConfig();

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-6">Collection not found</h1>
        <p className="mb-8">
          The collection you're looking for does not exist.
        </p>
        <Link
          to="/collections"
          className="bg-primary text-background px-6 py-3 rounded-sm"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div style={{backgroundColor: 'var(--color-cream)', color: 'var(--color-charcoal)', paddingTop: 'calc(var(--header-height-desktop) + 3rem)', paddingBottom: '4rem'}}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Collection Hero */}
        <div className="mb-16 text-center">
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
            {collection.title}
          </h1>
          {collection.description && (
            <p
              className="max-w-3xl mx-auto"
              style={{
                color: 'var(--color-stone)',
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: 1.8,
              }}
            >
              {collection.description}
            </p>
          )}
        </div>

        {/* Product Grid */}
        {collection.products.nodes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-6" style={{color: 'var(--color-stone)'}}>
              Aucun produit dans cette collection.
            </p>
            <Link
              to="/collections/all"
              className="inline-block py-3 px-8 rounded-sm transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-matcha-mid)',
                color: 'white',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
              }}
            >
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.products.nodes.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Collection Banner */}
        <div
          className="mt-16 rounded-lg p-10 text-center"
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
            Qualité & Tradition
          </h3>
          <p
            className="max-w-2xl mx-auto"
            style={{
              color: 'var(--color-stone)',
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            Chaque produit de cette collection est sélectionné avec soin pour vous offrir le meilleur du matcha japonais, fidèle aux traditions séculaires d'Uji.
          </p>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 24) {
        nodes {
          id
          title
          description
          handle
          featuredImage {
            id
            url
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
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
` as const;
