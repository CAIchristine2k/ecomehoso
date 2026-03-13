import {Link} from 'react-router';
import type {MetaFunction} from 'react-router';
import {getConfig} from '~/utils/config';

export const meta: MetaFunction = () => {
  const config = getConfig();
  return [
    {title: `${config.brandName} | Notre Histoire`},
    {
      name: 'description',
      content:
        "HOSO MATCHA - La quete du matcha parfait. Decouvrez notre philosophie et notre engagement pour un matcha pur, depuis Uji, Kyoto.",
    },
  ];
};

export default function NotreHistoire() {
  return (
    <div style={{backgroundColor: 'var(--color-cream)'}}>
      {/* Hero - Full screen cinematic */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--color-matcha-deep)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/preset/bghero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(26,47,35,0.4) 0%, rgba(26,47,35,0.2) 40%, rgba(26,47,35,0.6) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 24px',
            maxWidth: '800px',
          }}
        >
          <div
            className="mx-auto overflow-hidden"
            style={{
              height: 'clamp(120px, 25vw, 300px)',
              width: 'clamp(200px, 45vw, 500px)',
              marginBottom: '32px',
            }}
          >
            <img
              src="/images/hoso-logo-brush.png"
              alt="HOSO"
              className="w-full h-full"
              style={{
                filter: 'brightness(0) invert(1)',
                objectFit: 'cover',
                transform: 'scale(0.9)',
              }}
            />
          </div>
          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              margin: '0 auto 32px',
            }}
          />
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
              fontWeight: 300,
              color: 'white',
              opacity: 0.85,
              letterSpacing: '0.15em',
              lineHeight: 1.6,
            }}
          >
            Notre histoire
          </p>
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 300,
              color: 'white',
              opacity: 0.7,
              letterSpacing: '0.5em',
              marginBottom: '24px',
            }}
          >
            品牌故事
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 300,
              color: 'white',
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              opacity: 0.6,
            }}
          >
            Decouvrir
          </span>
          <svg
            width="1"
            height="40"
            viewBox="0 0 1 40"
            style={{opacity: 0.4}}
          >
            <line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="40"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
        </div>
      </section>

      {/* Section 1 - Introduction & Essence */}
      <section style={{padding: '100px 24px', textAlign: 'center', backgroundColor: '#e8f0e8'}}>
        <div style={{maxWidth: '700px', margin: '0 auto'}}>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'var(--color-charcoal)',
              marginBottom: '24px',
            }}
          >
            <span style={{fontWeight: 500}}>HOSO</span>
            <br />
            <span style={{fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', opacity: 0.6, letterSpacing: '0.15em'}}>
              fin · pur · delicat
            </span>
          </p>
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-matcha-mid)',
              margin: '0 auto 24px',
              opacity: 0.3,
            }}
          />
          <p
            style={{
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 2,
              color: 'var(--color-stone)',
              marginBottom: '40px',
            }}
          >
            Dans un monde qui va toujours plus vite, le sens de l'essentiel se perd souvent.
            Chez HOSO MATCHA, nous croyons que la vraie force reside dans la simplicite.
          </p>
        </div>
      </section>

      {/* Section 3 - Origine Uji */}
      <section style={{padding: '100px 24px', backgroundColor: '#336234'}}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '16px',
                }}
              >
                Une origine unique
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: '24px',
                  lineHeight: 1.3,
                  fontStyle: 'italic',
                }}
              >
                Uji, Japon
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 2,
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '20px',
                }}
              >
                Uji, berceau historique du matcha au Japon. Depuis des siecles, les maitres de the y cultivent les feuilles a l'ombre et les broient lentement a la pierre pour obtenir une poudre d'une finesse exceptionnelle.
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  lineHeight: 2,
                  color: 'rgba(255,255,255,0.9)',
                  fontStyle: 'italic',
                }}
              >
                L'origine est tout.
              </p>
            </div>
            <div
              className="aspect-[4/5] rounded-lg overflow-hidden"
              style={{backgroundColor: 'var(--color-matcha-deep)'}}
            >
              <img
                src="/images/uji-harvest.jpg"
                alt="Recolte du the a Uji, Japon"
                className="w-full h-full object-cover"
                style={{opacity: 0.85}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Les 3 piliers */}
      <section
        style={{
          padding: '120px 24px',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/matcha-bg-piliers.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.88)',
          }}
        />
        <div style={{maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1}}>
          <div style={{textAlign: 'center', marginBottom: '80px'}}>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1.5rem',
                color: 'var(--color-matcha-light)',
                opacity: 0.4,
                marginBottom: '20px',
              }}
            >
              純粋さの選択
            </p>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 300,
                color: 'var(--color-charcoal)',
                marginBottom: '20px',
                lineHeight: 1.4,
              }}
            >
              Pour respecter l'esprit de HOSO
              <br />
              nous avons simplifie chaque chose.
            </h2>
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(to right, transparent, var(--color-matcha-light), transparent)',
                margin: '0 auto',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '60px',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {[
              {
                kanji: '地',
                title: "Simplifier l'origine",
                desc: 'Nous avons concentre notre recherche sur un seul lieu : Uji, le coeur sacre du the japonais.',
              },
              {
                kanji: '純',
                title: 'Simplifier la gamme',
                desc: "Nous avons volontairement renonce aux melanges, aux aromes et aux recettes artificielles. Chez HOSO MATCHA, vous ne trouverez qu'une seule chose : du matcha pur.",
              },
              {
                kanji: '道',
                title: 'Simplifier le chemin',
                desc: "De la plantation ombragee d'Uji jusqu'a votre bol, chaque etape est rigoureusement controlee afin de preserver toute l'authenticite du matcha.",
              },
            ].map((pilier, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: '2.5rem',
                    color: 'var(--color-matcha-mid)',
                    marginBottom: '20px',
                    lineHeight: 1,
                    opacity: 0.35,
                  }}
                >
                  {pilier.kanji}
                </p>
                <h3
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--color-charcoal)',
                    marginBottom: '16px',
                  }}
                >
                  {pilier.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: 'var(--color-stone)',
                    maxWidth: '280px',
                    margin: '0 auto',
                  }}
                >
                  {pilier.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 - Notre promesse */}
      <section
        style={{
          padding: '100px 24px',
          backgroundColor: 'var(--color-cream-warm)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="promesse-bg-move"
          style={{
            position: 'absolute',
            inset: '-10%',
            backgroundImage: 'url(/images/matcha-bg-promesse.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(26, 47, 35, 0.5)',
            zIndex: 2,
          }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes promessePan {
            0% { transform: scale(1.05) translate(0, 0); }
            25% { transform: scale(1.1) translate(-1%, -1%); }
            50% { transform: scale(1.05) translate(1%, 0%); }
            75% { transform: scale(1.1) translate(0%, 1%); }
            100% { transform: scale(1.05) translate(0, 0); }
          }
          .promesse-bg-move {
            animation: promessePan 20s ease-in-out infinite;
          }
        `}} />
        <div
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <p
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '32px',
            }}
          >
            Notre promesse
          </p>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              fontWeight: 400,
              lineHeight: 1.8,
              color: 'white',
              marginBottom: '24px',
            }}
          >
            Chez HOSO MATCHA, nous ne faisons qu'une seule chose.
          </p>
          <p
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 500,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '32px',
            }}
          >
            Mais nous voulons la faire parfaitement.
          </p>
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              margin: '0 auto 32px',
              opacity: 0.3,
            }}
          />
        </div>
      </section>

    </div>
  );
}
