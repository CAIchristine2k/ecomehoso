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
          <h1
            style={{
              fontFamily: "'Brusher', 'Poppins', sans-serif",
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              fontWeight: 400,
              color: 'white',
              letterSpacing: '0.4em',
              lineHeight: 1,
              marginBottom: '32px',
              paddingRight: '0.4em',
            }}
          >
            HOSO
          </h1>
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
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
              fontWeight: 300,
              color: 'white',
              opacity: 0.6,
              letterSpacing: '0.1em',
              lineHeight: 1.6,
              marginTop: '8px',
            }}
          >
            La quete du matcha parfait
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

      {/* Section 1 - Introduction */}
      <section style={{padding: '120px 24px', textAlign: 'center'}}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-mid)',
              marginBottom: '32px',
            }}
          >
            Notre histoire
          </p>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'var(--color-charcoal)',
              marginBottom: '32px',
            }}
          >
            Dans un monde qui va toujours plus vite, ou les saveurs se
            multiplient et se complexifient, le sens de l'essentiel se perd
            souvent.
          </p>
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-matcha-mid)',
              margin: '0 auto 32px',
              opacity: 0.4,
            }}
          />
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 2,
              color: 'var(--color-stone)',
            }}
          >
            Chez HOSO MATCHA, nous croyons au contraire que la vraie force
            reside dans la simplicite et la purete.
          </p>
        </div>
      </section>

      {/* Section 2 - La question */}
      <section
        style={{
          padding: '100px 24px',
          backgroundColor: 'var(--color-cream-warm)',
        }}
      >
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* The question */}
            <div style={{textAlign: 'center'}}>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 2,
                  color: 'var(--color-stone)',
                  marginBottom: '40px',
                }}
              >
                Notre histoire est nee d'une question simple :
              </p>
              <blockquote
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--color-charcoal)',
                  lineHeight: 1.7,
                  padding: '40px 0',
                  borderTop: '1px solid var(--color-cream-dark)',
                  borderBottom: '1px solid var(--color-cream-dark)',
                }}
              >
                Si nous ne devions faire qu'une seule chose dans une vie,
                quelle serait-elle ?
              </blockquote>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 300,
                  color: 'var(--color-stone)',
                  marginTop: '40px',
                  lineHeight: 1.8,
                }}
              >
                La reponse s'est imposee naturellement :
              </p>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  color: 'var(--color-matcha-mid)',
                  marginTop: '12px',
                }}
              >
                creer un matcha parfait.
              </p>
            </div>

            {/* HOSO meaning */}
            <div
              style={{
                textAlign: 'center',
                padding: '60px 40px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-matcha-mid)',
                  marginBottom: '32px',
                }}
              >
                L'essence de HOSO
              </p>
              <p
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: '4rem',
                  color: 'var(--color-matcha-mid)',
                  marginBottom: '16px',
                  lineHeight: 1,
                }}
              >
                細
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-charcoal)',
                  marginBottom: '24px',
                }}
              >
                HOSO
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: 'var(--color-stone)',
                  maxWidth: '500px',
                  margin: '0 auto 24px',
                }}
              >
                Le nom HOSO — 細 — signifie en japonais « fin », « pur »,
                « delicat ».
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: 'var(--color-stone)',
                  maxWidth: '500px',
                  margin: '0 auto',
                }}
              >
                Un mot simple, mais qui resume toute notre philosophie.
                <br />
                <br />
                Chez HOSO MATCHA, nous avons fait un choix radical : aller a
                l'essentiel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Origine Uji */}
      <section style={{padding: '100px 24px'}}>
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
                  color: 'var(--color-matcha-mid)',
                  marginBottom: '16px',
                }}
              >
                Une origine unique
              </p>
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 400,
                  color: 'var(--color-charcoal)',
                  marginBottom: '24px',
                  lineHeight: 1.3,
                }}
              >
                Uji, Japon
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 2,
                  color: 'var(--color-stone)',
                  marginBottom: '20px',
                }}
              >
                Notre matcha provient d'un lieu unique : Uji, au Japon, considere
                comme le berceau historique du matcha et l'une des regions les plus
                prestigieuses au monde pour la culture du the.
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 2,
                  color: 'var(--color-stone)',
                  marginBottom: '20px',
                }}
              >
                Depuis des siecles, les maitres de the d'Uji perfectionnent un
                savoir-faire unique : cultiver les feuilles de the a l'ombre, les
                recolter avec precision et les broyer lentement a la pierre pour
                obtenir une poudre d'une finesse exceptionnelle.
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  lineHeight: 2,
                  color: 'var(--color-charcoal)',
                  fontStyle: 'italic',
                }}
              >
                Parce que pour creer un matcha d'exception, l'origine est tout.
              </p>
            </div>
            <div
              className="aspect-[4/5] rounded-lg overflow-hidden"
              style={{backgroundColor: 'var(--color-matcha-deep)'}}
            >
              <img
                src="/images/preset/bghero.png"
                alt="Plantations de the a Uji, Japon"
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
          padding: '100px 24px',
          backgroundColor: 'var(--color-cream-warm)',
        }}
      >
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '72px'}}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.25em',
                textTransform: 'uppercase' as const,
                color: 'var(--color-matcha-mid)',
                marginBottom: '16px',
              }}
            >
              La philosophie de la simplicite
            </p>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--color-charcoal)',
                marginBottom: '16px',
              }}
            >
              Pour respecter l'esprit de HOSO,
              <br />
              nous avons simplifie chaque chose.
            </h2>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1rem',
                color: 'var(--color-matcha-mid)',
                opacity: 0.6,
              }}
            >
              純粋さの選択
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Pilier 1 */}
            <div
              style={{
                padding: '48px 36px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid var(--color-cream-dark)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-matcha-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-charcoal)',
                  marginBottom: '20px',
                }}
              >
                Simplifier l'origine
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: 'var(--color-stone)',
                }}
              >
                Nous avons concentre notre recherche sur un seul lieu : Uji, le
                coeur sacre du the japonais.
              </p>
            </div>

            {/* Pilier 2 */}
            <div
              style={{
                padding: '48px 36px',
                backgroundColor: 'var(--color-matcha-deep)',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  color: 'white',
                  marginBottom: '20px',
                }}
              >
                Simplifier la gamme
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Nous avons volontairement renonce aux melanges, aux aromes et
                aux recettes artificielles. Chez HOSO MATCHA, vous ne trouverez
                qu'une seule chose : du matcha pur.
              </p>
            </div>

            {/* Pilier 3 */}
            <div
              style={{
                padding: '48px 36px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid var(--color-cream-dark)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-matcha-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-charcoal)',
                  marginBottom: '20px',
                }}
              >
                Simplifier le chemin
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: 'var(--color-stone)',
                }}
              >
                De la plantation ombragee d'Uji jusqu'a votre bol, chaque etape
                est rigoureusement controlee afin de preserver toute
                l'authenticite du matcha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - L'essentiel */}
      <section style={{padding: '100px 24px'}}>
        <div
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-mid)',
              marginBottom: '32px',
            }}
          >
            L'essentiel
          </p>
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '1.5rem',
              color: 'var(--color-matcha-mid)',
              opacity: 0.5,
              marginBottom: '40px',
            }}
          >
            本質
          </p>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              fontWeight: 400,
              lineHeight: 1.8,
              color: 'var(--color-charcoal)',
              marginBottom: '40px',
            }}
          >
            Lorsque tout le superflu disparait,
            <br />
            il ne reste que l'essentiel.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            {[
              'Une couleur verte profonde et vibrante.',
              'Une texture fine et veloutee.',
              'Une fraicheur umami intense.',
            ].map((line, i) => (
              <p
                key={i}
                style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'var(--color-stone)',
                }}
              >
                {line}
              </p>
            ))}
          </div>

          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-matcha-mid)',
              margin: '0 auto 40px',
              opacity: 0.3,
            }}
          />

          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'var(--color-stone)',
              fontStyle: 'italic',
            }}
          >
            Et surtout, un moment suspendu dans le temps.
          </p>
        </div>
      </section>

      {/* Section 6 - Notre promesse */}
      <section
        style={{
          padding: '100px 24px',
          backgroundColor: 'var(--color-cream-warm)',
        }}
      >
        <div
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-mid)',
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
              color: 'var(--color-charcoal)',
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
              color: 'var(--color-matcha-mid)',
              marginBottom: '32px',
            }}
          >
            Mais nous voulons la faire parfaitement.
          </p>
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--color-matcha-mid)',
              margin: '0 auto 32px',
              opacity: 0.3,
            }}
          />
          <p
            style={{
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 2,
              color: 'var(--color-stone)',
            }}
          >
            Du matcha pur, extreme et exclusif, issu d'Uji au Japon, pense
            pour ceux qui recherchent l'essentiel.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--color-matcha-deep)',
          textAlign: 'center',
        }}
      >
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-light)',
              marginBottom: '20px',
            }}
          >
            Pret a decouvrir ?
          </p>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'white',
              marginBottom: '36px',
            }}
          >
            Goutez la purete
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/collections/all"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                backgroundColor: 'var(--color-matcha-mid)',
                color: 'white',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              Nos matchas
            </Link>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              Retour a l'accueil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
