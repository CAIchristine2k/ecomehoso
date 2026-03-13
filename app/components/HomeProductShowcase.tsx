import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

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

  // Distribute products across 3 shelves
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
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
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
              fontFamily: "'Playfair Display', 'Georgia', serif",
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

        {/* Shelves */}
        <div>
          {shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex} className="relative">
              {/* Products row - aligned to bottom of shelf */}
              <div
                className="flex items-end justify-around px-2 md:px-8"
                style={{
                  minHeight: shelfIndex === 1 ? 'clamp(300px, 40vw, 480px)' : 'clamp(220px, 28vw, 340px)',
                  paddingBottom: '0',
                }}
              >
                {shelf.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.handle}`}
                    className="group flex flex-col items-center text-center relative"
                    style={{
                      width: `${Math.floor(90 / shelf.length)}%`,
                      maxWidth: '350px',
                    }}
                  >
                    {/* Product image */}
                    <div
                      className="relative transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-3"
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

                    {/* Product name - appears on hover */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                      style={{
                        bottom: '-48px',
                        width: '180px',
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
                          letterSpacing: '0.08em',
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
    </section>
  );
}
