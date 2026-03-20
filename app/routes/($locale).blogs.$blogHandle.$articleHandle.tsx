import {type LoaderFunctionArgs} from 'react-router';
import {useLoaderData, type MetaFunction, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getConfig} from '~/utils/config';
import {ArrowLeft, Calendar, User} from 'lucide-react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const config = getConfig();
  const article = data?.article;
  const title = article?.title || '';
  const description = article?.seo?.description || article?.excerpt || `${title} - Article HOSO MATCHA sur le matcha premium, thé vert japonais et culture du matcha.`;
  const image = article?.image?.url || '';

  return [
    {title: `${title} | ${config.brandName} - Blog Matcha`},
    {name: 'description', content: description.substring(0, 160)},
    {name: 'keywords', content: `${title}, matcha, blog matcha, ${config.brandName}, thé vert japonais`},
    {property: 'og:title', content: `${title} | ${config.brandName}`},
    {property: 'og:description', content: description.substring(0, 160)},
    ...(image ? [{property: 'og:image', content: image}] : []),
    {property: 'og:type', content: 'article'},
    {property: 'og:locale', content: 'fr_FR'},
    {property: 'og:site_name', content: 'HOSO MATCHA'},
    ...(article?.publishedAt ? [{property: 'article:published_time', content: article.publishedAt}] : []),
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: `${title} | ${config.brandName}`},
    {name: 'twitter:description', content: description.substring(0, 160)},
    ...(image ? [{name: 'twitter:image', content: image}] : []),
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
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  // No deferred data needed for this page
  return {};
}

export default function Article() {
  const {article, config} = useLoaderData<typeof loader>();

  // Format date to make it more readable
  const publishDate = new Date(article.publishedAt);
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div data-theme={config.theme} className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to={`/blogs/${article.blog.handle}`}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Article Information */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {formattedDate}
            </div>
            {article.author && (
              <div className="flex items-center text-gray-400 text-sm">
                <User className="w-4 h-4 mr-2" />
                {article.author.name}
              </div>
            )}
          </div>

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {article.title}
          </h1>

          {/* Featured Image */}
          {article.image && (
            <div className="mb-10">
              <Image
                alt={article.image.altText || article.title}
                aspectRatio="16/9"
                data={article.image}
                loading="eager"
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="w-full rounded-sm"
              />
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto mb-16">
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{__html: article.contentHtml}}
          />
        </div>

        {/* Related Content Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/30 rounded-sm p-8 text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Train Like a Champion
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              Explore {config.influencerName}'s championship-quality equipment
              and follow his training methods to elevate your boxing game.
            </p>
            <Link
              to="/collections/all"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-sm transition-all duration-300 uppercase tracking-wider"
            >
              Shop Boxing Gear
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const ARTICLE_QUERY = `#graphql
  query ArticleDetails(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        excerpt
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
        blog {
          handle
        }
      }
    }
  }
` as const;
