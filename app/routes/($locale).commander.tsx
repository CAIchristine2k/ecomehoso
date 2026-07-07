import {Link} from 'react-router';
import type {MetaFunction} from 'react-router';

export const meta: MetaFunction = () => {
  return [
    {title: 'Commander | HOSO MATCHA - Choisissez votre point de vente'},
    {
      name: 'description',
      content:
        'Commandez en ligne chez HOSO MATCHA. Choisissez votre point de vente : 89 rue Saint-Honoré 75001 ou 44 rue Saint-Antoine 75004 Paris.',
    },
    {rel: 'canonical', href: '/commander'},
    {property: 'og:title', content: 'Commander chez HOSO MATCHA'},
    {
      property: 'og:description',
      content:
        'Choisissez votre point de vente parisien pour commander votre matcha HOSO.',
    },
    {property: 'og:locale', content: 'fr_FR'},
  ];
};

const pointsDeVente = [
  {
    nom: 'Saint-Honoré',
    adresse: '89 rue Saint-Honoré',
    codePostal: '75001 Paris, France',
    quartier: 'Pont Neuf / Les Halles',
    japonais: 'パリ一区',
    orderLink: 'https://order.ody.app/701ca4ff-507d-4bab-9fc4-e9a916837a35',
    image: '/images/magasin/boutique-saint-honore.jpg',
  },
  {
    nom: 'Saint-Antoine',
    adresse: '44 rue Saint-Antoine',
    codePostal: '75004 Paris, France',
    quartier: 'Le Marais / Bastille',
    japonais: 'パリ四区',
    orderLink: 'https://order.ody.app/b49decec-fa15-4998-a828-83e29bcada61',
    image: '/images/20260121-141644.jpg',
  },
];

export default function CommanderPage() {
  return (
    <div style={{backgroundColor: 'var(--color-cream)'}}>
      {/* Hero Immersif */}
      <section
        className="pdv-hero"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: 'clamp(110px, 14vw, 150px) 24px clamp(56px, 8vw, 80px)',
        }}
      >
        {/* Background */}
        <div style={{position: 'absolute', inset: 0, zIndex: 0}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/images/magasin/ambiance.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(26,47,35,0.5) 0%, rgba(26,47,35,0.65) 50%, rgba(26,47,35,0.85) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            padding: '0 24px',
            maxWidth: '680px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-light)',
              marginBottom: '24px',
              padding: '8px 20px',
              border: '1px solid rgba(138,178,152,0.3)',
              borderRadius: '100px',
            }}
          >
            Commander en ligne
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              lineHeight: 1.25,
              marginBottom: '14px',
            }}
          >
            Choisissez votre point de vente
          </h1>
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '16px',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '28px',
            }}
          >
            ご注文
          </p>
          <p
            style={{
              fontSize: '15px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.8,
              maxWidth: '480px',
              margin: '0 auto 36px',
            }}
          >
            Deux boutiques au cœur de Paris pour déguster nos matchas
            d&apos;exception. Sélectionnez l&apos;adresse de votre choix.
          </p>
          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'var(--color-matcha-light)',
              margin: '0 auto',
              opacity: 0.5,
            }}
          />
        </div>
      </section>

      {/* Points de vente */}
      <section className="pdv-section" style={{padding: 'clamp(48px, 10vw, 100px) 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div className="pdv-header" style={{textAlign: 'center', marginBottom: '64px'}}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.25em',
                textTransform: 'uppercase' as const,
                color: 'var(--color-matcha-mid)',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Nos points de vente
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--color-charcoal)',
                marginBottom: '8px',
              }}
            >
              Deux adresses à Paris
            </h2>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1rem',
                color: 'var(--color-matcha-mid)',
                opacity: 0.6,
              }}
            >
              店舗一覧
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {pointsDeVente.map((pdv) => (
              <div
                key={pdv.adresse}
                className="pdv-card group relative flex flex-col justify-end overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-2"
                style={{
                  minHeight: '520px',
                  border: '1px solid transparent',
                  backgroundColor: 'var(--color-matcha-deep)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 24px 64px rgba(26,47,35,0.18)';
                  e.currentTarget.style.borderColor = 'var(--color-matcha-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Image de fond */}
                <img
                  src={pdv.image}
                  alt={`Boutique HOSO MATCHA ${pdv.adresse}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  style={{opacity: 0.72}}
                />
                {/* Dégradé lisibilité */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(26,47,35,0.15) 0%, rgba(26,47,35,0.25) 38%, rgba(26,47,35,0.78) 78%, rgba(26,47,35,0.92) 100%)',
                  }}
                />

                {/* Japonais (haut) */}
                <span
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '22px',
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: '13px',
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  {pdv.japonais}
                </span>

                {/* Contenu par-dessus */}
                <div
                  className="pdv-body"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Pin + adresse */}
                  <div className="pdv-addr" style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                    <div className="pdv-icon" style={{flexShrink: 0, width: '40px', height: '40px', color: 'var(--color-matcha-light)'}}>
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width: '100%', height: '100%'}}>
                        <path d="M24 4c-7.732 0-14 6.268-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z" />
                        <circle cx="24" cy="18" r="5" />
                      </svg>
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase' as const,
                          color: 'var(--color-matcha-light)',
                          marginBottom: '8px',
                        }}
                      >
                        Adresse
                      </h3>
                      <p className="pdv-name" style={{fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'white', marginBottom: '2px', textShadow: '0 1px 12px rgba(0,0,0,0.5)'}}>
                        {pdv.adresse}
                      </p>
                      <p style={{fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '12px', textShadow: '0 1px 10px rgba(0,0,0,0.5)'}}>
                        {pdv.codePostal}
                      </p>
                      <span style={{display: 'inline-flex', alignItems: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.75)'}}>
                        {pdv.quartier}
                      </span>
                    </div>
                  </div>

                  <a
                    href={pdv.orderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdv-cta inline-flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      padding: '16px 32px',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const,
                      color: 'white',
                      backgroundColor: 'var(--color-matcha-mid)',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    }}
                  >
                    Commander
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
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
            À bientôt
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'white',
              marginBottom: '36px',
            }}
          >
            Venez découvrir notre univers
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
              to="/notre-magasin"
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
              Nos magasins
            </Link>
            <Link
              to="/collections/all"
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
              Nos matchas
            </Link>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (max-width: 767px) {
            .pdv-section { padding-top: 40px !important; padding-bottom: 48px !important; }
            .pdv-header { margin-bottom: 28px !important; }
            .pdv-card { min-height: 360px !important; }
            .pdv-body { padding: 20px !important; }
            .pdv-addr { gap: 12px !important; margin-bottom: 16px !important; }
            .pdv-icon { width: 30px !important; height: 30px !important; }
            .pdv-name { font-size: 19px !important; }
            .pdv-cta { padding: 14px 24px !important; }
          }
        `,
        }}
      />
    </div>
  );
}
