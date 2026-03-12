import {Link} from 'react-router';
import type {MetaFunction} from 'react-router';
import {useState, useEffect} from 'react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Notre Magasin - HOSO | Paris'},
    {
      name: 'description',
      content:
        'Visitez notre boutique HOSO au coeur du Marais, Paris 4eme. Matcha premium, degustation et accessoires.',
    },
  ];
};

const storeImages = [
  {
    src: '/images/magasin/devanture-1.jpg',
    alt: 'Devanture HOSO',
    caption: 'Notre facade',
  },
  {
    src: '/images/magasin/interieur-gobelets.jpg',
    alt: 'Interieur boutique',
    caption: "L'espace degustation",
  },
  {
    src: '/images/magasin/service-sesame.jpg',
    alt: 'Service',
    caption: 'Preparation artisanale',
  },
  {
    src: '/images/magasin/ambiance.jpg',
    alt: 'Ambiance',
    caption: 'Ambiance zen',
  },
  {
    src: '/images/magasin/plaque-hoso.jpg',
    alt: 'Plaque HOSO',
    caption: 'Notre enseigne',
  },
  {
    src: '/images/magasin/interieur-drapeaux.jpg',
    alt: 'Interieur',
    caption: 'Decoration japonaise',
  },
];

export default function NotreMagasinPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % storeImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{backgroundColor: 'var(--color-cream)'}}>
      {/* Hero Immersif */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background slides */}
        <div style={{position: 'absolute', inset: 0, zIndex: 0}}>
          {storeImages.map((img, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${img.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === activeSlide ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(26,47,35,0.4) 0%, rgba(26,47,35,0.6) 50%, rgba(26,47,35,0.8) 100%)',
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
            Paris, Le Marais
          </span>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(16px, 3vw, 24px)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
              marginBottom: '12px',
              opacity: 0.5,
            }}
          >
            44 rue Saint-Antoine 75004 Paris
          </h1>
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '18px',
              letterSpacing: '0.5em',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '40px',
            }}
          >
            パリ四区
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

        {/* Slide indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 3,
          }}
        >
          {storeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              style={{
                width: index === activeSlide ? '60px' : '40px',
                height: '3px',
                background:
                  index === activeSlide
                    ? 'white'
                    : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                borderRadius: '2px',
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="magasin-scroll-anim"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.6)',
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
            }}
          >
            Decouvrir
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{width: '20px', height: '20px'}}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Gallery Mosaic */}
      <section style={{padding: '80px 24px', backgroundColor: 'var(--color-cream)'}}>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          style={{maxWidth: '1400px', margin: '0 auto'}}
        >
          {/* Large item */}
          <div
            className="col-span-2 row-span-2 relative overflow-hidden rounded-lg group"
            style={{height: '560px'}}
          >
            <img
              src="/images/magasin/devanture-1.jpg"
              alt="Devanture HOSO"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            />
            <div
              className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{
                background:
                  'linear-gradient(to top, rgba(26,47,35,0.9) 0%, rgba(26,47,35,0.3) 40%, transparent 100%)',
              }}
            >
              <span style={{color: 'white', fontSize: '14px', fontWeight: 400, letterSpacing: '0.05em'}}>
                Notre facade
              </span>
            </div>
          </div>

          {/* Regular items */}
          {[
            {src: '/images/magasin/interieur-gobelets.jpg', caption: "L'espace degustation"},
            {src: '/images/magasin/service-sesame.jpg', caption: 'Preparation artisanale'},
            {src: '/images/magasin/plaque-hoso.jpg', caption: 'Notre enseigne'},
            {src: '/images/magasin/ambiance.jpg', caption: 'Ambiance zen'},
          ].map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg group"
              style={{height: '275px'}}
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
              />
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background:
                    'linear-gradient(to top, rgba(26,47,35,0.9) 0%, rgba(26,47,35,0.3) 40%, transparent 100%)',
                }}
              >
                <span style={{color: 'white', fontSize: '13px', fontWeight: 400}}>
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Infos pratiques */}
      <section style={{padding: '100px 24px', backgroundColor: 'var(--color-cream)'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '64px'}}>
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
              Informations pratiques
            </span>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--color-charcoal)',
                marginBottom: '8px',
              }}
            >
              Nous rendre visite
            </h2>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1rem',
                color: 'var(--color-matcha-mid)',
                opacity: 0.6,
              }}
            >
              ご来店案内
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Adresse */}
            <div
              className="flex gap-5 p-8 rounded-2xl transition-all duration-400 hover:-translate-y-2"
              style={{border: '1px solid transparent'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 24px 64px rgba(26,47,35,0.1)';
                e.currentTarget.style.borderColor = 'var(--color-matcha-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{flexShrink: 0, width: '48px', height: '48px', color: 'var(--color-matcha-mid)'}}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width: '100%', height: '100%'}}>
                  <path d="M24 4c-7.732 0-14 6.268-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z" />
                  <circle cx="24" cy="18" r="5" />
                </svg>
              </div>
              <div>
                <h3 style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--color-matcha-mid)', marginBottom: '8px'}}>
                  Adresse
                </h3>
                <p style={{fontFamily: "'Poppins', sans-serif", fontSize: '22px', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '2px'}}>
                  44 Rue Saint-Antoine
                </p>
                <p style={{fontSize: '16px', color: 'var(--color-stone)', marginBottom: '12px'}}>
                  75004 Paris, France
                </p>
                <span style={{display: 'inline-flex', alignItems: 'center', fontSize: '13px', color: 'var(--color-stone)'}}>
                  Bastille / Saint-Paul
                </span>
              </div>
            </div>

            {/* Horaires */}
            <div
              className="flex gap-5 p-8 rounded-2xl transition-all duration-400 hover:-translate-y-2"
              style={{border: '1px solid transparent'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 24px 64px rgba(26,47,35,0.1)';
                e.currentTarget.style.borderColor = 'var(--color-matcha-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{flexShrink: 0, width: '48px', height: '48px', color: 'var(--color-matcha-mid)'}}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width: '100%', height: '100%'}}>
                  <circle cx="24" cy="24" r="18" />
                  <path d="M24 12v12l8 4" />
                </svg>
              </div>
              <div>
                <h3 style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--color-matcha-mid)', marginBottom: '8px'}}>
                  Horaires
                </h3>
                <p style={{fontFamily: "'Poppins', sans-serif", fontSize: '22px', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '2px'}}>
                  Mar — Dim
                </p>
                <p style={{fontSize: '16px', color: 'var(--color-stone)', marginBottom: '12px'}}>
                  10h00 — 19h00
                </p>
                <span style={{fontSize: '13px', color: 'var(--color-matcha-mid)', fontWeight: 500}}>
                  Ferme le lundi
                </span>
              </div>
            </div>

            {/* Contact */}
            <div
              className="flex gap-5 p-8 rounded-2xl transition-all duration-400 hover:-translate-y-2"
              style={{border: '1px solid transparent'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 24px 64px rgba(26,47,35,0.1)';
                e.currentTarget.style.borderColor = 'var(--color-matcha-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{flexShrink: 0, width: '48px', height: '48px', color: 'var(--color-matcha-mid)'}}>
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width: '100%', height: '100%'}}>
                  <rect x="6" y="10" width="36" height="28" rx="3" />
                  <path d="M6 18l18 12 18-12" />
                </svg>
              </div>
              <div>
                <h3 style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--color-matcha-mid)', marginBottom: '8px'}}>
                  Contact
                </h3>
                <p style={{fontFamily: "'Poppins', sans-serif", fontSize: '22px', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '2px'}}>
                  contact@hoso.fr
                </p>
                <p style={{fontSize: '16px', color: 'var(--color-stone)', marginBottom: '12px'}}>
                  @hoso.paris
                </p>
                <span style={{fontSize: '13px', color: 'var(--color-stone)'}}>
                  Reponse sous 24h
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{padding: '100px 24px', backgroundColor: 'var(--color-cream)'}}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          style={{maxWidth: '1200px', margin: '0 auto'}}
        >
          <div style={{padding: '24px 0'}}>
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
              Localisation
            </span>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--color-charcoal)',
                marginBottom: '20px',
              }}
            >
              Au coeur du Marais
            </h2>
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.9,
                color: 'var(--color-stone)',
                marginBottom: '32px',
                maxWidth: '400px',
              }}
            >
              Niche dans le quartier historique du Marais, notre boutique vous
              accueille dans un cadre alliant tradition japonaise et elegance
              parisienne.
            </p>
            <a
              href="https://maps.google.com/?q=44+Rue+Saint-Antoine+75004+Paris"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 transition-all duration-300 hover:gap-4"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
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
              <span>Itineraire</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{width: '18px', height: '18px'}}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{aspectRatio: '4/3'}}
          >
            <img
              src="/images/magasin/map.png"
              alt="Plan du quartier"
              className="w-full h-full object-cover"
            />
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
            A bientot
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
            Venez decouvrir notre univers
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes floatHint {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
          }
          .magasin-scroll-anim {
            animation: floatHint 2s ease-in-out infinite;
          }
        `,
        }}
      />
    </div>
  );
}
