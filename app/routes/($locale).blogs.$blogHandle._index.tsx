import {type LoaderFunctionArgs} from 'react-router';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getConfig} from '~/utils/config';
import {ArrowLeft, Calendar, User} from 'lucide-react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const config = getConfig();
  const blogTitle = data?.blog?.title || 'Blog';
  return [
    {title: `${blogTitle} | ${config.brandName} - Blog Matcha`},
    {name: 'description', content: `${blogTitle} - Articles, guides et conseils sur le matcha par HOSO MATCHA. Préparation, recettes, bienfaits du thé vert japonais.`},
    {property: 'og:title', content: `${blogTitle} | ${config.brandName}`},
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

  return {...deferredData, ...criticalData};
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  // Get configuration
  const config = getConfig();

  return {
    config: {
      ...config,
      theme: config.influencerName.toLowerCase().replace(/\s+/g, '-'),
    },
  };
}

export default function Blog() {
  const {blog, config} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div data-theme={config.theme} className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center text-gold-500 hover:text-gold-400 transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </div>

        {/* Blog Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-gold-500/20 text-gold-500 text-sm font-bold tracking-wider uppercase mb-4 rounded-sm">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Latest insights, training tips, and stories from the{' '}
            {config.influencerName} community.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="max-w-6xl mx-auto">
          <PaginatedResourceSection
            connection={articles}
            resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {({node: article, index}) => {
              const typedArticle = article as ArticleItemFragment;
              return (
                <ArticleItem
                  article={typedArticle}
                  key={typedArticle.id}
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              );
            }}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));

  return (
    <div className="group bg-gray-900/80 backdrop-blur-sm border border-gray-800 hover:border-gold-500 rounded-sm overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-3px]">
      <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
        {article.image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>

          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{publishedAt}</span>
            {article.author && (
              <>
                <span className="mx-2">•</span>
                <User className="w-4 h-4 mr-1" />
                <span>{article.author.name}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
