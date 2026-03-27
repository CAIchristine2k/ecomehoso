import {Link} from 'react-router';
import type {MetaFunction} from 'react-router';
import {useState, useEffect} from 'react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Boutique Matcha Paris Le Marais | HOSO MATCHA - Matcha Premium & Dégustation'},
    {
      name: 'description',
      content: 'Visitez la boutique HOSO MATCHA au cœur du Marais, Paris 4ème. Matcha cérémonial premium, dégustation sur place, gâteaux basque au matcha, accessoires traditionnels japonais. 44 Rue Saint-Antoine, 75004 Paris.',
    },
    {name: 'keywords', content: 'boutique matcha Paris, magasin matcha Le Marais, HOSO MATCHA Paris, dégustation matcha Paris, matcha Paris 4ème, salon de thé matcha, gâteau basque matcha, matcha latte Paris, boutique thé japonais Paris'},
    {rel: 'canonical', href: '/notre-magasin'},
    {property: 'og:title', content: 'Boutique HOSO MATCHA Paris - Le Marais'},
    {property: 'og:description', content: 'Boutique matcha premium au cœur du Marais, Paris. Dégustation, matcha cérémonial et accessoires traditionnels japonais.'},
    {property: 'og:type', content: 'place'},
    {property: 'og:locale', content: 'fr_FR'},
    {property: 'og:site_name', content: 'HOSO MATCHA'},
    {property: 'place:location:latitude', content: '48.8533'},
    {property: 'place:location:longitude', content: '2.3647'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: 'Boutique HOSO MATCHA - Paris Le Marais'},
    {name: 'twitter:description', content: 'Matcha premium, dégustation et accessoires japonais au cœur du Marais, Paris 4ème.'},
  ];
};

const storeImages = [
  {
    src: '/images/picc.JPG',
    alt: 'Boutique HOSO Basque Cheesecake Paris',
    caption: 'Notre boutique',
  },
  {
    src: '/images/IMG_2671.JPG',
    alt: 'Équipe HOSO Basque - préparation cheesecake',
    caption: 'Notre équipe',
  },
  {
    src: '/images/IMG_2689.JPG',
    alt: 'Basque cheesecake HOSO',
    caption: 'Notre basque cheesecake',
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
    alt: 'Intérieur',
    caption: 'Décoration japonaise',
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

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'HOSO MATCHA - Boutique Paris Le Marais',
    image: '/images/magasin/devanture-1.jpg',
    '@id': 'https://hosomatcha.com/notre-magasin',
    url: 'https://hosomatcha.com/notre-magasin',
    telephone: '',
    description: 'Boutique de matcha premium au cœur du Marais, Paris. Dégustation de matcha cérémonial, gâteaux basque au matcha, boissons au matcha et accessoires traditionnels japonais.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '44 Rue Saint-Antoine',
      addressLocality: 'Paris',
      postalCode: '75004',
      addressRegion: 'Île-de-France',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.8533,
      longitude: 2.3647,
    },
    priceRange: '€€',
    servesCuisine: 'Matcha, Thé japonais, Pâtisseries',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Contactless',
    hasMap: 'https://maps.google.com/?q=44+Rue+Saint-Antoine+75004+Paris',
  };

  return (
    <div style={{backgroundColor: 'var(--color-cream)'}}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}}
      />
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
              fontFamily: "var(--font-display)",
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
            Découvrir
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

      {/* CTA Section */}
      <section
        style={{
          padding: 'clamp(60px, 10vw, 100px) 24px',
          backgroundColor: 'var(--color-matcha-deep)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div data-reveal="up" style={{maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 2}}>
          <p style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: '0.85rem',
            color: 'var(--color-matcha-pale)',
            letterSpacing: '0.3em',
            marginBottom: '20px',
          }}>
            お茶の世界
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 400,
            color: 'white',
            lineHeight: 1.3,
            marginBottom: '16px',
          }}>
            Venez découvrir l'univers HOSO
          </h2>
          <p style={{
            fontSize: '15px',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.8,
            marginBottom: '36px',
            maxWidth: '520px',
            margin: '0 auto 36px',
          }}>
            Plongez dans notre sélection de matchas d'exception et d'accessoires artisanaux, directement importés d'Uji, Kyoto.
          </p>
          <a
            href="https://order.odyssey.ad/7e7e4908-c3a7-41b4-b29b-35803a7a10ce"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group transition-all duration-300 hover:scale-[1.02]"
            style={{
              padding: '16px 40px',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-deep)',
              backgroundColor: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
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
              src="/images/IMG_2671.JPG"
              alt="Équipe HOSO Basque - préparation cheesecake"
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
                Notre équipe
              </span>
            </div>
          </div>

          {/* Regular items */}
          {[
            {src: '/images/magasin/interieur-gobelets.jpg', caption: "L'espace dégustation"},
            {src: '/images/IMG_2689.JPG', caption: 'Notre basque cheesecake'},
            {src: '/images/magasin/plaque-hoso.jpg', caption: 'Notre enseigne'},
            {src: '/images/IMG_3315.JPG', caption: 'Notre équipe'},
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

      {/* Notre Carte */}
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
              À déguster sur place
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--color-charcoal)',
                marginBottom: '8px',
              }}
            >
              Notre Carte
            </h2>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1rem',
                color: 'var(--color-matcha-mid)',
                opacity: 0.6,
              }}
            >
              メニュー
            </p>
          </div>

          <div className="flex flex-col gap-16 max-w-[500px] mx-auto">
            {/* Matcha Love */}
            <div>
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-matcha-mid)',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--color-matcha-light)',
                }}
              >
                Matcha Love
              </h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {[
                  ['Matcha Latte', '6,00'],
                  ['Matcha a la rose', '6,50'],
                  ['Strawberry Matcha Latte', '7,50'],
                  ['Pop Yuzu Matcha', '7,00'],
                  ['Oreo Matcha Latte', '7,00'],
                  ['Coco Matcha Cloud', '7,00'],
                  ['Passion Matcha Latte', '7,50'],
                  ['Sesame Matcha Latte', '7,50'],
                  ['Pistacha Matcha Latte', '7,50'],
                ].map(([name, price]) => (
                  <li key={name} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <span style={{fontSize: '15px', color: 'var(--color-charcoal)', fontWeight: 400}}>{name}</span>
                    <span style={{flex: 1, borderBottom: '1px dotted var(--color-matcha-light)', margin: '0 12px', opacity: 0.4}} />
                    <span style={{fontSize: '15px', color: 'var(--color-matcha-mid)', fontWeight: 500}}>{price} €</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Signature Hoso */}
            <div>
              <h3
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-matcha-mid)',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--color-matcha-light)',
                }}
              >
                Signature Hoso
              </h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {[
                  {name: 'Pistachio Latte Secret', price: '7,00', desc: 'Espresso, Pistache, Lait, creme maison'},
                  {name: 'Vienna Sesame Latte', price: '7,00', desc: 'Espresso, Sesame noir, Lait, creme maison'},
                  {name: 'Mango Tango Matcha Latte', price: '7,50', desc: 'Mangue, Lait, Matcha, creme maison'},
                  {name: 'Matchamisu Latte', price: '7,90', desc: 'Matcha, Mascarpone, Lait, creme maison'},
                  {name: 'Basque Tiramisu Latte', price: '7,00', desc: 'Espresso, Mascarpone, creme maison'},
                  {name: 'Basque Matcha Latte', price: '7,00', desc: 'Matcha, Mascarpone, Lait, creme maison'},
                ].map((item) => (
                  <li key={item.name}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                      <span style={{fontSize: '15px', color: 'var(--color-charcoal)', fontWeight: 400}}>{item.name}</span>
                      <span style={{flex: 1, borderBottom: '1px dotted var(--color-matcha-light)', margin: '0 12px', opacity: 0.4}} />
                      <span style={{fontSize: '15px', color: 'var(--color-matcha-mid)', fontWeight: 500}}>{item.price} €</span>
                    </div>
                    <p style={{fontSize: '12px', color: 'var(--color-stone)', marginTop: '4px', fontStyle: 'italic'}}>{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div style={{textAlign: 'center', marginTop: '48px'}}>
            <a
              href="https://order.odyssey.ad/7e7e4908-c3a7-41b4-b29b-35803a7a10ce"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-all duration-500 hover:-translate-y-1"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                padding: '16px 48px',
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                fontWeight: 500,
                backgroundColor: 'var(--color-matcha-mid)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Commander
            </a>
          </div>
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
                fontFamily: "var(--font-display)",
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
              data-reveal="up" data-reveal-delay="1"
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
                <p style={{fontFamily: "var(--font-display)", fontSize: '22px', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '2px'}}>
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
              data-reveal="up" data-reveal-delay="2"
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
                <p style={{fontFamily: "var(--font-display)", fontSize: '22px', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '2px'}}>
                  Ouvert 7j/7
                </p>
                <p style={{fontSize: '16px', color: 'var(--color-stone)', marginBottom: '12px'}}>
                  11h00 — 19h30
                </p>
              </div>
            </div>

            {/* Contact */}
            <div
              data-reveal="up" data-reveal-delay="3"
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
                <h3 style={{fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--color-matcha-mid)', marginBottom: '16px'}}>
                  Contact
                </h3>

                <div style={{marginBottom: '16px'}}>
                  <p style={{fontFamily: "var(--font-display)", fontSize: '16px', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '4px'}}>
                    Hosomatchagroup@gmail.com
                  </p>
                  <span style={{fontSize: '12px', color: 'var(--color-stone)'}}>
                    Collaborations matcha & service client
                  </span>
                </div>

                <div>
                  <p style={{fontFamily: "var(--font-display)", fontSize: '16px', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '4px'}}>
                    Hosobasqueparis04@gmail.com
                  </p>
                  <span style={{fontSize: '12px', color: 'var(--color-stone)'}}>
                    Collaborations, commandes & événements magasin
                  </span>
                </div>
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
                fontFamily: "var(--font-display)",
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
              Niché dans le quartier historique du Marais, notre boutique vous
              accueille dans un cadre alliant tradition japonaise et élégance
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
              <span>Itinéraire</span>
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
            À bientôt
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
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
              Retour à l'accueil
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
