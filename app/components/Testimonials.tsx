import React, {useRef, useCallback} from 'react';
import {Star} from 'lucide-react';

const reviews = [
  {
    name: 'Sophie M.',
    initials: 'SM',
    text: 'La différence avec les autres matchas est flagrante dès la première gorgée. Une douceur umami incroyable.',
  },
  {
    name: 'Thomas L.',
    initials: 'TL',
    text: 'Enfin un matcha cérémonial digne de ce nom en France. La couleur, la texture, tout est parfait.',
  },
  {
    name: 'Camille R.',
    initials: 'CR',
    text: 'Je commande depuis 6 mois et la qualité est toujours au rendez-vous. Mon rituel matinal préféré.',
  },
  {
    name: 'Antoine D.',
    initials: 'AD',
    text: 'Offert à ma mère pour Noël, elle a adoré. L\'emballage est très soigné, idéal pour un cadeau.',
  },
  {
    name: 'Julie P.',
    initials: 'JP',
    text: 'Le meilleur matcha que j\'ai goûté en dehors du Japon. On sent vraiment la qualité Uji.',
  },
  {
    name: 'Marc B.',
    initials: 'MB',
    text: 'Mousse parfaite au chasen, saveur douce sans amertume. Je ne peux plus m\'en passer.',
  },
  {
    name: 'Emma V.',
    initials: 'EV',
    text: 'Livraison rapide, packaging élégant et matcha exceptionnel. Tout est impeccable chez HOSO.',
  },
  {
    name: 'Lucas G.',
    initials: 'LG',
    text: 'J\'ai comparé avec 5 marques premium, HOSO est clairement au-dessus. Vert intense, goût pur.',
  },
];

const CARD_WIDTH = 320; // 300px card + 20px gap

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'right' ? CARD_WIDTH : -CARD_WIDTH;
    scrollRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'});
  }, []);

  return (
    <section
      id="testimonials"
      style={{
        padding: 'var(--section-spacing) 0',
        backgroundColor: 'var(--color-cream-warm)',
        overflow: 'hidden',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-12">
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
            Témoignages
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--color-charcoal)',
            }}
          >
            Ce que disent nos clients
          </h2>
          <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.85rem', color: 'var(--color-matcha-mid)', letterSpacing: '0.3em', marginTop: '8px'}}>
            お客様の声
          </p>
        </div>
      </div>

      {/* Reviews with arrows */}
      <div style={{position: 'relative'}} className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Arrow Left */}
        <button
          onClick={() => scroll('left')}
          aria-label="Avis précédents"
          className="testimonial-arrow testimonial-arrow-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Arrow Right */}
        <button
          onClick={() => scroll('right')}
          aria-label="Avis suivants"
          className="testimonial-arrow testimonial-arrow-right"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="testimonials-container"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: '300px',
                padding: '24px',
                background: 'white',
                border: '1px solid var(--color-cream-dark)',
                borderRadius: '12px',
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    className="h-3 w-3"
                    style={{
                      color: 'var(--color-matcha-mid)',
                      fill: 'var(--color-matcha-mid)',
                    }}
                  />
                ))}
              </div>

              {/* Review text */}
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'var(--color-charcoal-light)',
                  fontStyle: 'italic',
                  marginBottom: '16px',
                }}
              >
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-cream)',
                    color: 'var(--color-matcha-deep)',
                    fontSize: '11px',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {review.initials}
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-charcoal)',
                    letterSpacing: '0.03em',
                  }}
                >
                  {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
            .testimonials-container {
              display: flex;
              gap: 20px;
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              padding: 4px 0;
            }
            .testimonials-container::-webkit-scrollbar {
              display: none;
            }
            .testimonials-container > div {
              scroll-snap-align: start;
            }
            .testimonial-arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 3;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 1px solid var(--color-cream-dark);
              background: rgba(255, 255, 255, 0.9);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              color: var(--color-charcoal);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .testimonial-arrow:hover {
              background: var(--color-matcha-mid);
              border-color: var(--color-matcha-mid);
              color: white;
              transform: translateY(-50%) scale(1.08);
              box-shadow: 0 4px 16px rgba(61, 107, 79, 0.25);
            }
            .testimonial-arrow-left {
              left: 0px;
            }
            .testimonial-arrow-right {
              right: 0px;
            }
            @media (max-width: 640px) {
              .testimonial-arrow {
                width: 34px;
                height: 34px;
              }
              .testimonial-arrow-left {
                left: 4px;
              }
              .testimonial-arrow-right {
                right: 4px;
              }
            }
          `,
          }}
        />
      </div>
    </section>
  );
}
