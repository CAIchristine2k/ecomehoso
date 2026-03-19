import {
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from 'react-router';
import {getPaginationVariables, Analytics, CacheShort} from '@shopify/hydrogen';
import React, {useState, useEffect} from 'react';
import {Link} from 'react-router';

// Import configuration and theme system from utils (consistent directory)
import config, {defaultConfig} from '~/utils/config';
import {useTheme, useConfig, useUpdateConfig} from '~/utils/themeContext';

// Import components that match Vue template structure
import {Hero} from '~/components/Hero';
import {ProductShowcase} from '~/components/ProductShowcase';
import LimitedEdition from '~/components/LimitedEdition';
import CareerHighlights from '~/components/CareerHighlights';
import {SocialFeed} from '~/components/SocialFeed';
import {AIMediaGeneration} from '~/components/AIMediaGeneration';
import {CustomizableProductGrid} from '~/components/CustomizableProductGrid';
import Testimonials from '~/components/Testimonials';
import NewsletterSignup from '~/components/NewsletterSignup';
import FeaturedProducts from '~/components/FeaturedProducts';
import {HomeProductShowcase} from '~/components/HomeProductShowcase';

export const meta: MetaFunction = () => {
  return [
    {title: `${config.brandName} | Matcha Premium depuis Uji, Kyoto`},
    {
      name: 'description',
      content: "Hoso Matcha - Matcha d'exception sélectionné à Uji, Kyoto. Découvrez nos matchas cérémoniaux et culinaires, accessoires traditionnels et coffrets.",
    },
    {
      name: 'keywords',
      content: 'matcha, matcha cérémonial, matcha culinaire, thé vert japonais, Uji, Kyoto, matcha premium, chasen, chawan',
    },
    {property: 'og:title', content: `${config.brandName} | Matcha Premium`},
    {property: 'og:description', content: config.heroSubtitle},
    {property: 'og:image', content: config.brandLogo},
    {property: 'og:type', content: 'website'},
  ];
};

// Define loader function to fetch all products
export async function loader({request, context}: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const variables = getPaginationVariables(request, {pageBy: 20});

  // Get all products with more variants (CacheShort = refresh every request, stale-while-revalidate)
  const {products} = await context.storefront.query(PRODUCTS_QUERY, {
    variables,
    cache: CacheShort(),
  });

  // Get collections
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    cache: CacheShort(),
  });

  // Get featured collection
  const featuredCollection = collections?.nodes.find(
    (collection: any) => collection.handle === 'frontpage',
  );

  return {
    products: products.nodes,
    featuredCollection,
    collections: collections.nodes,
  };
}

export default function Home() {
  const {products, featuredCollection} = useLoaderData<typeof loader>();
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const appConfig = useConfig();

  useEffect(() => {
    // Debug logging for products
    console.log('Index: Total products loaded:', products?.length || 0);

    // Count customizable and non-customizable products
    const customizableProducts =
      products?.filter((product: any) =>
        product.variants?.nodes?.some(
          (variant: any) => variant?.title?.toLowerCase() === 'custom',
        ),
      ) || [];

    const nonCustomizableProducts =
      products?.filter(
        (product: any) =>
          !product.variants?.nodes?.some(
            (variant: any) => variant?.title?.toLowerCase() === 'custom',
          ),
      ) || [];

    console.log('Products with custom variants:', customizableProducts.length);
    console.log(
      'Products without custom variants:',
      nonCustomizableProducts.length,
    );

    // Update debug info
    setDebugLog([
      `Total products: ${products?.length || 0}`,
      `Exclusive products: ${nonCustomizableProducts.length}`,
      `Customizable products: ${customizableProducts.length}`,
    ]);

    // Log the titles of customizable products
    console.log('Customizable product titles:');
    customizableProducts.forEach((product: any) => {
      console.log(`- ${product.title}`);
    });
  }, [products]);

  return (
    <main>
      <Hero />

      {/* Reassurance Bar - Marquee */}
      <section
        className="reassurance-marquee-wrapper"
        style={{
          borderTop: '1px solid var(--color-cream-dark)',
          borderBottom: '1px solid var(--color-cream-dark)',
          backgroundColor: 'var(--color-cream-warm)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fade edges */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(to right, var(--color-cream-warm), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          background: 'linear-gradient(to left, var(--color-cream-warm), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        <div className="reassurance-marquee" style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'marqueeScroll 12s linear infinite',
          padding: '20px 0',
        }}>
          {[...Array(3)].map((_, setIndex) => (
            <React.Fragment key={setIndex}>
              {[
                {title: 'Origine Uji', desc: 'Kyoto, Japon'},
                {title: 'Artisanal', desc: 'Mouture sur meule de pierre'},
                {title: 'Grade Cérémonial', desc: 'Qualité premium'},
                {title: 'Livraison offerte', desc: 'Dès 50 EUR d\'achat'},
                {title: 'Culture ombragée', desc: 'Tradition séculaire'},
                {title: 'Direct du Japon', desc: 'Sans intermédiaire'},
              ].map((item, i) => (
                <span
                  key={`${setIndex}-${i}`}
                  className="inline-flex items-center gap-3 mx-8"
                  style={{flexShrink: 0}}
                >
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--color-charcoal)',
                  }}>
                    {item.title}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--color-stone)',
                    fontWeight: 300,
                  }}>
                    {item.desc}
                  </span>
                  <span style={{
                    color: 'var(--color-matcha-mid)',
                    opacity: 0.3,
                    margin: '0 8px',
                    fontSize: '8px',
                  }}>
                    ●
                  </span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .reassurance-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
      </section>

      {/* Full width product image */}
      <div style={{width: '100%', backgroundColor: 'var(--color-matcha-deep)', overflow: 'hidden'}}>
        <img
          src="/images/hoso-matcha-glass-4k.jpg"
          alt="HOSO Matcha"
          className="w-full block object-cover"
          style={{
            height: 'clamp(250px, 40vw, 500px)',
          }}
        />
      </div>

      {/* Luxury Shelf Showcase */}
      <HomeProductShowcase
        products={products.filter(
          (product: any) =>
            !product.variants?.nodes?.some(
              (variant: any) => variant?.title?.toLowerCase() === 'custom',
            ),
        )}
      />

      {/* Intro / Story Section */}
      <section
        className="story-section"
        style={{
          padding: '0',
          backgroundColor: 'var(--color-cream-warm)',
          overflow: 'hidden',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2" style={{minHeight: '700px'}}>
          {/* Video side - full bleed */}
          <div
            className="relative overflow-hidden order-2 md:order-1"
            style={{minHeight: '400px'}}
          >
            <video
              src="/videos/201.mov"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(26,47,35,0.4) 0%, rgba(26,47,35,0.15) 100%)',
              }}
            />
            {/* Mobile text overlay */}
            <div
              className="absolute inset-0 flex items-center md:hidden"
              style={{
                padding: 'clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)',
                zIndex: 5,
              }}
            >
              <div style={{maxWidth: '520px'}}>
                <div className="flex items-center gap-4 mb-6">
                  <div style={{width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.5)'}} />
                  <span style={{fontSize: '10px', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.8)'}}>Notre philosophie</span>
                </div>
                <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', letterSpacing: '0.3em'}}>細 · HOSO</p>
                <h2 className="mb-6" style={{fontFamily: "var(--font-display)", fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 300, lineHeight: 1.35, color: 'white', letterSpacing: '-0.01em'}}>
                  Extrêmement simple,<br />
                  <span style={{color: 'rgba(255,255,255,0.85)', fontStyle: 'italic'}}>extrêmement pur.</span>
                </h2>
                <Link
                  to="/notre-histoire"
                  className="group inline-flex items-center gap-3 transition-all duration-400"
                  style={{padding: '12px 24px', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'white', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', borderRadius: '4px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)'}}
                >
                  Découvrir notre histoire
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Text side - desktop only */}
          <div
            className="hidden md:flex items-center order-1 md:order-2"
            style={{
              padding: 'clamp(48px, 8vw, 100px) clamp(24px, 5vw, 80px)',
              backgroundColor: 'rgba(245, 240, 230, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{maxWidth: '520px'}}>
              {/* Decorative line + label */}
              <div className="flex items-center gap-4 mb-8">
                <div style={{width: '40px', height: '1px', backgroundColor: 'var(--color-matcha-mid)', opacity: 0.4}} />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--color-matcha-mid)',
                  }}
                >
                  Notre philosophie
                </span>
              </div>

              {/* Japanese accent */}
              <p
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: '0.85rem',
                  color: 'var(--color-matcha-mid)',
                  opacity: 0.4,
                  marginBottom: '20px',
                  letterSpacing: '0.3em',
                }}
              >
                細 · HOSO
              </p>

              {/* Title */}
              <h2
                className="mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  fontWeight: 300,
                  lineHeight: 1.35,
                  color: 'var(--color-charcoal)',
                  letterSpacing: '-0.01em',
                }}
              >
                Extrêmement simple,
                <br />
                <span style={{
                  color: 'var(--color-matcha-mid)',
                  fontStyle: 'italic',
                }}>
                  extrêmement pur.
                </span>
              </h2>
              <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.85rem', color: 'var(--color-matcha-mid)', letterSpacing: '0.3em', marginBottom: '24px'}}>
                極めてシンプル、極めて純粋
              </p>

              {/* Highlight quote bar */}
              <div
                className="mb-8"
                style={{
                  borderLeft: '2px solid var(--color-matcha-mid)',
                  paddingLeft: '20px',
                }}
              >
                <p
                  style={{
                    color: 'var(--color-charcoal-light)',
                    fontSize: '15px',
                    fontWeight: 300,
                    lineHeight: 1.9,
                  }}
                >
                  Dans un monde qui va toujours plus vite, nous avons fait le choix radical de la simplicité. Un seul lieu : Uji, le cœur sacré du thé au Japon.
                </p>
              </div>

              {/* Italic quote */}
              <p
                className="mb-10"
                style={{
                  color: 'var(--color-stone)',
                  fontSize: '14px',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  fontStyle: 'italic',
                }}
              >
                "Lorsque tout le superflu disparaît, il ne reste que l'essentiel."
              </p>

              {/* CTA button style */}
              <Link
                to="/notre-histoire"
                className="group inline-flex items-center gap-3 transition-all duration-400"
                style={{
                  padding: '14px 28px',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  color: 'white',
                  backgroundColor: 'var(--color-matcha-deep)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                Découvrir notre histoire
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Matcha powder banner */}
      <div style={{width: '100%', backgroundColor: 'var(--color-cream)', textAlign: 'center', paddingTop: '15px'}}>
        <img
          src="/images/matcha-powder-brush.png"
          alt="Poudre de matcha"
          style={{
            width: 'clamp(250px, 50vw, 600px)',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>

      {/* Product showcase section */}
      <ProductShowcase
        products={products.filter(
          (product: any) =>
            !product.variants?.nodes?.some(
              (variant: any) => variant?.title?.toLowerCase() === 'custom',
            ),
        )}
        title="Nos produits"
      />

      {/* Testimonials section */}
      <Testimonials />

      {/* Histoire de la marque */}
      <section
        style={{
          padding: 'var(--section-spacing) 0',
          backgroundColor: 'var(--color-cream-warm)',
        }}
      >
        <div className="max-w-[900px] mx-auto px-6 md:px-10">
          {/* Label */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{width: '40px', height: '1px', backgroundColor: 'var(--color-matcha-mid)', opacity: 0.4}} />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-matcha-mid)',
                }}
              >
                Notre histoire
              </span>
              <div style={{width: '40px', height: '1px', backgroundColor: 'var(--color-matcha-mid)', opacity: 0.4}} />
            </div>
            <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.85rem', color: 'var(--color-matcha-mid)', letterSpacing: '0.3em', marginBottom: '16px'}}>
              物語
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 300,
                lineHeight: 1.3,
                color: 'var(--color-charcoal)',
                letterSpacing: '-0.01em',
              }}
            >
              Hoso Matcha – Histoire de la marque
            </h2>
          </div>

          {/* Story content */}
          <div
            style={{
              borderLeft: '2px solid var(--color-matcha-mid)',
              paddingLeft: 'clamp(20px, 4vw, 40px)',
            }}
          >
            <p
              className="mb-6"
              style={{
                color: 'var(--color-charcoal-light)',
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: 2,
              }}
            >
              Dans le Paris romantique, il y a beaucoup de matcha.
              <br />
              Mais il n'est pas facile de trouver un bon matcha, sain, propre et parfumé.
            </p>

            <p
              className="mb-6"
              style={{
                color: 'var(--color-charcoal-light)',
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: 2,
              }}
            >
              Je possède un bar à Paris, spécialisé dans les gâteaux basque au matcha et les boissons au matcha.
              J'ai cherché pendant longtemps, goûté toutes sortes de matcha, sans jamais trouver celui qui me correspondait.
            </p>

            <p
              className="mb-6"
              style={{
                color: 'var(--color-charcoal-light)',
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: 2,
              }}
            >
              J'ai entendu dire que le matcha d'Uji à Tokyo, au Japon, est très réputé.
              J'ai donc fait le voyage jusqu'à Uji, à la recherche de cette couleur verte et de ce parfum que j'avais en cœur.
            </p>

            <p
              className="mb-6"
              style={{
                color: 'var(--color-charcoal-light)',
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: 2,
              }}
            >
              Je l'ai ramené à Paris.
              <br />
              Dans mon établissement, j'ai créé ma propre marque : <strong style={{fontWeight: 500, color: 'var(--color-charcoal)'}}>Hoso Matcha</strong>.
            </p>
          </div>

          {/* Closing quote */}
          <div className="text-center mt-10">
            <p
              style={{
                fontStyle: 'italic',
                color: 'var(--color-matcha-mid)',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              "Une touche de thé vert de Tokyo,
              <br />
              envoyée jusqu'au Paris romantique."
            </p>
            <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.8rem', color: 'var(--color-matcha-mid)', opacity: 0.4, marginTop: '16px', letterSpacing: '0.3em'}}>
              東京の緑茶をパリへ
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter signup section */}
      <NewsletterSignup />

      {/* Suivez-nous Section */}
      <section
        style={{
          padding: 'var(--section-spacing) 0',
          backgroundColor: 'var(--color-cream)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
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
            Communauté
          </span>
          <h2
            className="mb-4"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--color-charcoal)',
            }}
          >
            Suivez-nous sur nos réseaux
          </h2>
          <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.85rem', color: 'var(--color-matcha-mid)', letterSpacing: '0.3em', marginTop: '8px'}}>
            フォローしてください
          </p>
          <p
            className="mb-10 max-w-md mx-auto"
            style={{
              color: 'var(--color-stone)',
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            Rejoignez notre communauté et partagez vos moments matcha avec #hosomatcha
          </p>

          <div className="flex items-center justify-center gap-6 mb-12">
            {[
              {
                name: 'Instagram',
                url: 'https://www.instagram.com/hosobasqueparis_/',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                ),
              },
              {
                name: 'TikTok',
                url: 'https://www.tiktok.com/@hosobasque_',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.82a8.16 8.16 0 0 0 4.76 1.52V6.89a4.84 4.84 0 0 1-1-.2z"/>
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all duration-300"
                style={{color: 'var(--color-charcoal)'}}
              >
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{
                    width: '56px',
                    height: '56px',
                    border: '1px solid var(--color-cream-dark)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-matcha-deep)';
                    e.currentTarget.style.borderColor = 'var(--color-matcha-deep)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--color-cream-dark)';
                    e.currentTarget.style.color = 'var(--color-charcoal)';
                  }}
                >
                  {social.icon}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase' as const,
                    fontWeight: 400,
                    color: 'var(--color-stone)',
                  }}
                >
                  {social.name}
                </span>
              </a>
            ))}
          </div>

          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '0.9rem',
              color: 'var(--color-matcha-mid)',
              opacity: 0.4,
            }}
          >
            @hosomatcha
          </p>
        </div>
      </section>

    </main>
  );
}

// GraphQL query to fetch all products
const PRODUCTS_QUERY = `#graphql
  query products($first: Int, $last: Int, $startCursor: String, $endCursor: String) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
        tags
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
        variants(first: 25) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
        images(first: 1) {
          nodes {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch all collections
const COLLECTIONS_QUERY = `#graphql
  query collections {
    collections(first: 10) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;
