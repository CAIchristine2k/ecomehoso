import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {getProductRating} from '~/utils/productRatings';

interface ShelfProduct {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface HomeProductShowcaseProps {
  products: ShelfProduct[];
}

export function HomeProductShowcase({products}: HomeProductShowcaseProps) {
  if (!products || products.length === 0) return null;

  // Filter out unwanted product and reorder
  const filtered = products.filter(
    (p) =>
      !p.featuredImage?.url?.includes('0933e6e21ca5'),
  );
  // Move kit-decouvert-prelude-et-foret to 3rd position (index 2)
  const kitIdx = filtered.findIndex(
    (p) => p.handle === 'kit-decouvert-prelude-et-foret' || p.featuredImage?.url?.includes('KITDOUBLEVOAYGE.png'),
  );
  const reordered = [...filtered];
  if (kitIdx !== -1 && kitIdx !== 2) {
    const [kit] = reordered.splice(kitIdx, 1);
    reordered.splice(2, 0, kit);
  }

  // Move fouet to 4th position (index 3)
  const fouetIdx = reordered.findIndex((p) => p.handle === 'fouet');
  if (fouetIdx !== -1 && fouetIdx !== 3) {
    const [fouet] = reordered.splice(fouetIdx, 1);
    reordered.splice(3, 0, fouet);
  }

  // Move kit-voyage to 5th position (index 4), replacing cuillère
  const kitVoyageIdx = reordered.findIndex((p) => p.handle === 'kit-voyage');
  if (kitVoyageIdx !== -1 && kitVoyageIdx !== 4) {
    const [kitVoyage] = reordered.splice(kitVoyageIdx, 1);
    reordered.splice(4, 0, kitVoyage);
  }

  // Replace cuillère (matcha-01-prelude-copie) with Kit Matcha Forêt
  const cuillereIdx = reordered.findIndex((p) => p.handle === 'matcha-01-prelude-copie');
  const kitForetIdx = reordered.findIndex((p) => p.handle === 'kit-matcha-foret-hoso-matcha-hoso-chasen-cuillere-support');
  if (kitForetIdx !== -1 && cuillereIdx !== -1) {
    const [kitForet] = reordered.splice(kitForetIdx, 1);
    const updatedCuillereIdx = reordered.findIndex((p) => p.handle === 'matcha-01-prelude-copie');
    reordered[updatedCuillereIdx] = kitForet;
  } else if (cuillereIdx !== -1) {
    reordered.splice(cuillereIdx, 1);
  }

  // Replace bol kaolin (gres-artisanal-wabi-sabi-copie) with Kit Voyage Forêt
  const bolKaolinIdx = reordered.findIndex((p) => p.handle === 'gres-artisanal-wabi-sabi-copie');
  const kitVoyageForetIdx = reordered.findIndex((p) => p.handle === 'matcha-prelude-15-sachets-individuels-2-g-copie');
  if (kitVoyageForetIdx !== -1 && bolKaolinIdx !== -1) {
    const [kitVoyageForet] = reordered.splice(kitVoyageForetIdx, 1);
    const updatedBolIdx = reordered.findIndex((p) => p.handle === 'gres-artisanal-wabi-sabi-copie');
    reordered[updatedBolIdx] = kitVoyageForet;
  } else if (bolKaolinIdx !== -1) {
    reordered.splice(bolKaolinIdx, 1);
  }

  // Distribute products across shelves (3 per shelf on desktop, 2 per shelf on mobile handled via CSS)
  const shelf1 = reordered.slice(0, 3);
  const shelf2 = reordered.slice(3, 6);
  const shelf3 = reordered.slice(6, 9);

  const shelves = [shelf1, shelf2, shelf3].filter((s) => s.length > 0);

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        padding: 'clamp(60px, 8vw, 100px) 0 clamp(40px, 6vw, 80px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-3 md:px-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-mid)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Selection
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 600,
              color: 'var(--color-charcoal)',
              letterSpacing: '0.02em',
              fontStyle: 'italic',
              lineHeight: 1.2,
            }}
          >
            Nos essentiels
          </h2>
          <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.85rem', color: 'var(--color-matcha-mid)', letterSpacing: '0.3em', marginTop: '8px'}}>
            ひつじゅひん
          </p>
        </div>

        {/* Swipe hint - mobile only */}
        <div className="md:hidden flex items-center justify-end gap-1.5 mb-3 pr-3 swipe-hint-container">
          <span style={{fontSize: '10px', color: 'var(--color-stone)', letterSpacing: '0.05em'}}>Swiper</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-matcha-mid)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="swipe-hint-arrow">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        {/* Shelves */}
        <div>
          {shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex} className="relative">
              {/* Products row - aligned to bottom of shelf */}
              <div
                className="shelf-products-grid items-end px-2 md:px-8"
                style={{
                  paddingBottom: '0',
                }}
              >
                {shelf.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.handle}`}
                    className="group flex flex-col items-center text-center relative"
                  >
                    {/* Product image */}
                    <div
                      className="relative transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-3 shelf-product-image"
                      style={{
                        width: '100%',
                        height: shelfIndex === 1 ? 'clamp(260px, 35vw, 420px)' : 'clamp(180px, 23vw, 280px)',
                      }}
                    >
                      {product.featuredImage ? (
                        <Image
                          data={product.featuredImage}
                          className="w-full h-full object-contain"
                          style={{
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15)) drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                          }}
                          sizes="(min-width: 1024px) 280px, (min-width: 768px) 200px, 150px"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-lg flex items-center justify-center"
                          style={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                        >
                          <span style={{color: 'var(--color-stone)', fontSize: '12px'}}>
                            Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product info - mobile: static below image, desktop: hover tooltip */}
                    {/* Mobile version - always visible, in flow */}
                    <div className="shelf-product-info-mobile md:hidden w-full mt-2 text-center">
                      <p style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase' as const,
                        color: 'var(--color-charcoal)',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        wordBreak: 'break-word' as const,
                      }}>
                        {product.title}
                      </p>
                      <ShelfRating handle={product.handle} />
                      {product.priceRange && (
                        <p className="mt-0.5 price-no-hover" style={{
                          fontSize: '11px',
                          color: 'var(--color-matcha-mid)',
                          fontWeight: 500,
                        }}>
                          <Money data={product.priceRange.minVariantPrice} />
                        </p>
                      )}
                    </div>

                    {/* Desktop version - hover tooltip */}
                    <div
                      className="hidden md:block absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                      style={{
                        bottom: '-48px',
                        width: 'max(100%, 160px)',
                        maxWidth: '220px',
                        zIndex: 10,
                      }}
                    >
                      <div
                        className="px-3 py-2 rounded-md text-center"
                        style={{
                          backgroundColor: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        <p style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase' as const,
                          color: 'var(--color-charcoal)',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                        }}>
                          {product.title}
                        </p>
                        <ShelfRating handle={product.handle} />
                        {product.priceRange && (
                          <p className="mt-0.5 price-no-hover" style={{
                            fontSize: '10px',
                            color: 'var(--color-matcha-mid)',
                            fontWeight: 500,
                          }}>
                            <Money data={product.priceRange.minVariantPrice} />
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Shelf - thick matcha-tinted line with realistic shadow */}
              <div style={{position: 'relative', zIndex: 5}}>
                {/* Shelf surface */}
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, transparent 0%, rgba(26,47,35,0.08) 20%, rgba(26,47,35,0.12) 50%, rgba(26,47,35,0.08) 80%, transparent 100%)',
                    width: '100%',
                  }}
                />
                {/* Soft shadow below */}
                <div
                  style={{
                    height: '20px',
                    background: 'radial-gradient(ellipse at center, rgba(26,47,35,0.07) 0%, transparent 70%)',
                    width: '80%',
                    margin: '0 auto',
                  }}
                />
              </div>

              {/* Spacer between shelves */}
              {shelfIndex < shelves.length - 1 && (
                <div style={{height: '20px'}} />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-3 group transition-all duration-300 hover:scale-[1.02]"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: 'white',
              padding: '14px 36px',
              backgroundColor: 'var(--color-matcha-deep)',
              borderRadius: '4px',
            }}
          >
            Voir toute la collection
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .shelf-products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 16px;
          justify-items: center;
        }
        @media (min-width: 768px) {
          .shelf-products-grid {
            display: flex;
            justify-content: space-around;
            gap: 0;
          }
          .shelf-products-grid > a {
            width: 30%;
            max-width: 350px;
          }
        }
        @media (max-width: 767px) {
          .shelf-products-grid {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 12px;
            padding-left: 12px !important;
            padding-right: 12px !important;
            margin-bottom: 16px;
          }
          .shelf-products-grid::-webkit-scrollbar {
            display: none;
          }
          .shelf-products-grid > a {
            flex: 0 0 calc(50% - 6px);
            min-width: 0;
            scroll-snap-align: start;
          }
          .shelf-products-grid .shelf-product-image {
            height: clamp(130px, 34vw, 200px) !important;
          }
        }
        @keyframes swipeHint {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(6px); opacity: 1; }
        }
        .swipe-hint-arrow {
          animation: swipeHint 1.5s ease-in-out infinite;
        }
      `}} />
    </section>
  );
}

function ShelfRating({handle}: {handle: string}) {
  const {rating, reviewCount} = getProductRating(handle);
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center justify-center gap-1 mt-1">
      <div className="flex gap-px">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill={i < fullStars ? 'var(--color-matcha-mid)' : (i === fullStars && hasHalf ? 'url(#halfShelf)' : 'none')}
            stroke="var(--color-matcha-mid)"
            strokeWidth="1.5"
          >
            {i === fullStars && hasHalf && (
              <defs>
                <linearGradient id="halfShelf">
                  <stop offset="50%" stopColor="var(--color-matcha-mid)" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span style={{fontSize: '9px', color: 'var(--color-stone)'}}>({reviewCount})</span>
    </div>
  );
}
