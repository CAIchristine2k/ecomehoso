import {type LoaderFunctionArgs} from 'react-router';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ArrowLeft, BookOpen, Calendar} from 'lucide-react';
import {getConfig} from '~/utils/config';

export const meta: MetaFunction = () => {
  const config = getConfig();
  return [
    {title: `Blog Matcha | ${config.brandName} - Guides, Recettes & Conseils Matcha`},
    {name: 'description', content: "Blog HOSO MATCHA : guides de préparation du matcha, recettes au matcha, bienfaits du thé vert japonais, conseils d'utilisation et culture du matcha."},
    {name: 'keywords', content: 'blog matcha, guide matcha, recette matcha, préparation matcha, bienfaits matcha, thé vert japonais, conseils matcha, matcha latte recette'},
    {property: 'og:title', content: `Blog | ${config.brandName}`},
    {property: 'og:description', content: "Guides, recettes et conseils autour du matcha. Découvrez l'univers HOSO MATCHA."},
    {property: 'og:type', content: 'blog'},
    {property: 'og:locale', content: 'fr_FR'},
    {property: 'og:site_name', content: 'HOSO MATCHA'},
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {blogs};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Blogs() {
  const {blogs, config} = useLoaderData<typeof loader>();

  return (
    <div data-theme={config.theme} className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold tracking-wider uppercase mb-4 rounded-sm">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">CHAMPIONSHIP</span> INSIGHTS
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover training tips, boxing insights, and stories from{' '}
            {config.influencerName}'s legendary career and the world of
            professional boxing.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="mb-16">
          <PaginatedResourceSection
            connection={blogs}
            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {({node: blog}) => {
              // Add proper type assertion
              const typedBlog = blog as {
                handle: string;
                title: string;
                seo?: {
                  description?: string;
                };
              };

              return (
                <Link
                  key={typedBlog.handle}
                  prefetch="intent"
                  to={`/blogs/${typedBlog.handle}`}
                  className="group block bg-gray-900/80 backdrop-blur-sm border border-gray-800 hover:border-primary/50 rounded-sm overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-3px]"
                >
                  {/* Blog Header */}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <BookOpen className="w-5 h-5 text-primary mr-2" />
                      <span className="text-sm text-primary font-bold uppercase tracking-wider">
                        Blog
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-4">
                      {typedBlog.title}
                    </h2>

                    {typedBlog.seo?.description && (
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {typedBlog.seo.description}
                      </p>
                    )}

                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Latest Articles</span>
                    </div>
                  </div>
                </Link>
              );
            }}
          </PaginatedResourceSection>
        </div>

        {/* Championship Banner */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/30 rounded-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Train Your Mind Like a Champion
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Mental preparation is just as important as physical training. Learn
            from {config.influencerName}'s experience and develop the champion
            mindset.
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-sm transition-all duration-300 uppercase tracking-wider"
          >
            Explore {config.influencerName}'s Story
          </Link>
        </div>
      </div>
    </div>
  );
}

const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;
