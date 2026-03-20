import {useConfig} from '~/utils/themeContext';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    price?: string;
    currency?: string;
    availability?: string;
    brand?: string;
    category?: string;
  };
  noindex?: boolean;
}

export function Seo({
  title,
  description,
  image,
  url,
  type = 'website',
  product,
  noindex = false,
}: SeoProps) {
  const config = useConfig();

  const seoTitle =
    title || `${config.brandName} - ${config.influencerTitle} | Official Store`;
  const seoDescription = description || config.heroSubtitle;
  const seoImage = image || config.brandLogo;
  const seoUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');

  // Generate structured data for products
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : 'WebSite',
      name: seoTitle,
      description: seoDescription,
      url: seoUrl,
      image: seoImage,
    };

    if (type === 'product' && product) {
      return {
        ...baseData,
        '@type': 'Product',
        brand: {
          '@type': 'Brand',
          name: product.brand || config.brandName,
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'USD',
          availability:
            product.availability === 'in_stock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: config.brandName,
          },
        },
        category: product.category,
      };
    }

    if (type === 'website') {
      return {
        ...baseData,
        '@type': 'WebSite',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${seoUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };
    }

    return baseData;
  };

  return (
    <>
      {/* Basic Meta Tags */}
      <meta name="description" content={seoDescription} />
      <meta
        name="keywords"
        content={`${config.brandName}, matcha, matcha cérémonial, matcha culinaire, thé vert japonais, Uji, Kyoto, matcha premium, chasen, chawan, poudre de matcha, matcha latte, accessoires matcha`}
      />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={config.brandName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      {config.socialLinks.twitter && (
        <meta
          name="twitter:site"
          content={`@${config.socialLinks.twitter.split('/').pop()}`}
        />
      )}

      {/* Additional Meta Tags */}
      <meta name="author" content={config.influencerName} />
      <meta
        name="copyright"
        content={`© ${new Date().getFullYear()} ${config.brandName}`}
      />
      <meta name="language" content="fr" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData()),
        }}
      />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://cdn.shopify.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//cdn.shopify.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </>
  );
}
