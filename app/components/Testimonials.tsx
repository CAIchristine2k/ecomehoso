import React from 'react';
import {Star} from 'lucide-react';

const reviews = [
  {
    name: 'Sophie M.',
    initials: 'SM',
    text: 'La difference avec les autres matchas est flagrante des la premiere gorgee. Une douceur umami incroyable.',
  },
  {
    name: 'Thomas L.',
    initials: 'TL',
    text: 'Enfin un matcha ceremonial digne de ce nom en France. La couleur, la texture, tout est parfait.',
  },
  {
    name: 'Camille R.',
    initials: 'CR',
    text: 'Je commande depuis 6 mois et la qualite est toujours au rendez-vous. Mon rituel matinal prefere.',
  },
  {
    name: 'Antoine D.',
    initials: 'AD',
    text: 'Offert a ma mere pour Noel, elle a adore. L\'emballage est tres soigne, ideal pour un cadeau.',
  },
  {
    name: 'Julie P.',
    initials: 'JP',
    text: 'Le meilleur matcha que j\'ai goute en dehors du Japon. On sent vraiment la qualite Uji.',
  },
  {
    name: 'Marc B.',
    initials: 'MB',
    text: 'Mousse parfaite au chasen, saveur douce sans amertume. Je ne peux plus m\'en passer.',
  },
  {
    name: 'Emma V.',
    initials: 'EV',
    text: 'Livraison rapide, packaging elegant et matcha exceptionnel. Tout est impeccable chez HOSO.',
  },
  {
    name: 'Lucas G.',
    initials: 'LG',
    text: 'J\'ai compare avec 5 marques premium, HOSO est clairement au-dessus. Vert intense, gout pur.',
  },
];

export default function Testimonials() {
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
            Temoignages
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

      {/* Scrolling reviews */}
      <div style={{position: 'relative'}}>
        {/* Fade edges */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '80px',
            background:
              'linear-gradient(to right, var(--color-cream-warm), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '80px',
            background:
              'linear-gradient(to left, var(--color-cream-warm), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        <div
          className="testimonials-scroll"
          style={{
            display: 'flex',
            gap: '20px',
            animation: 'testimonialsScroll 35s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {[...Array(3)].map((_, setIdx) => (
            <React.Fragment key={setIdx}>
              {reviews.map((review, i) => (
                <div
                  key={`${setIdx}-${i}`}
                  style={{
                    flexShrink: 0,
                    width: '300px',
                    padding: '24px',
                    background: 'white',
                    border: '1px solid var(--color-cream-dark)',
                    borderRadius: '12px',
                    whiteSpace: 'normal',
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
                    "{review.text}"
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
            </React.Fragment>
          ))}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes testimonialsScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            .testimonials-scroll:hover {
              animation-play-state: paused;
            }
          `,
          }}
        />
      </div>
    </section>
  );
}
