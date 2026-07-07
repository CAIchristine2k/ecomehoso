import {Link} from 'react-router';
import type {MetaFunction} from 'react-router';
import {useState, useEffect} from 'react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Nos Boutiques Matcha Paris | HOSO MATCHA - Saint-Honoré & Le Marais'},
    {
      name: 'description',
      content: 'Visitez nos deux boutiques HOSO MATCHA à Paris : 89 rue Saint-Honoré 75001 (Pont Neuf / Les Halles) et 44 rue Saint-Antoine 75004 (Le Marais / Bastille). Matcha cérémonial premium, dégustation sur place, gâteaux basque au matcha, accessoires traditionnels japonais.',
    },
    {name: 'keywords', content: 'boutiques matcha Paris, magasins matcha Paris, HOSO MATCHA Paris, matcha Saint-Honoré, matcha Le Marais, dégustation matcha Paris, matcha Paris 1er, matcha Paris 4ème, salon de thé matcha, gâteau basque matcha, matcha latte Paris, boutique thé japonais Paris'},
    {rel: 'canonical', href: '/notre-magasin'},
    {property: 'og:title', content: 'Nos Boutiques HOSO MATCHA - Paris'},
    {property: 'og:description', content: 'Deux boutiques matcha premium à Paris : Saint-Honoré (1er) et Le Marais (4ème). Dégustation, matcha cérémonial et accessoires traditionnels japonais.'},
    {property: 'og:type', content: 'place'},
    {property: 'og:locale', content: 'fr_FR'},
    {property: 'og:site_name', content: 'HOSO MATCHA'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: 'Nos Boutiques HOSO MATCHA - Paris'},
    {name: 'twitter:description', content: 'Matcha premium, dégustation et accessoires japonais. Deux boutiques à Paris : Saint-Honoré et Le Marais.'},
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
    mapLink: 'https://maps.google.com/?q=89+rue+Saint-Honoré+75001+Paris',
    image: '/images/magasin/boutique-saint-honore.jpg',
  },
  {
    nom: 'Saint-Antoine',
    adresse: '44 rue Saint-Antoine',
    codePostal: '75004 Paris, France',
    quartier: 'Le Marais / Bastille',
    japonais: 'パリ四区',
    orderLink: 'https://order.ody.app/b49decec-fa15-4998-a828-83e29bcada61',
    mapLink: 'https://maps.google.com/?q=44+Rue+Saint-Antoine+75004+Paris',
    image: '/images/20260121-141644.jpg',
  },
];

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

  const localBusinessSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CafeOrCoffeeShop',
      name: 'HOSO MATCHA - Boutique Paris Saint-Honoré',
      image: '/images/magasin/boutique-saint-honore.jpg',
      '@id': 'https://hosomatcha.com/notre-magasin#saint-honore',
      url: 'https://hosomatcha.com/notre-magasin',
      telephone: '',
      description: 'Boutique de matcha premium à Saint-Honoré, Paris 1er. Dégustation de matcha cérémonial, gâteaux basque au matcha, boissons au matcha et accessoires traditionnels japonais.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '89 rue Saint-Honoré',
        addressLocality: 'Paris',
        postalCode: '75001',
        addressRegion: 'Île-de-France',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.8622,
        longitude: 2.3419,
      },
      priceRange: '€€',
      servesCuisine: 'Matcha, Thé japonais, Pâtisseries',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Cash, Credit Card, Contactless',
      hasMap: 'https://maps.google.com/?q=89+rue+Saint-Honoré+75001+Paris',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CafeOrCoffeeShop',
      name: 'HOSO MATCHA - Boutique Paris Le Marais',
      image: '/images/magasin/devanture-1.jpg',
      '@id': 'https://hosomatcha.com/notre-magasin#saint-antoine',
      url: 'https://hosomatcha.com/notre-magasin',
      telephone: '',
      description: 'Boutique de matcha premium au cœur du Marais, Paris 4ème. Dégustation de matcha cérémonial, gâteaux basque au matcha, boissons au matcha et accessoires traditionnels japonais.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '44 rue Saint-Antoine',
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
    },
  ];

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
            Paris — 1er & 4ème
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 400,
              letterSpacing: '0.03em',
              lineHeight: 1.2,
              marginBottom: '16px',
              color: 'white',
            }}
          >
            Nos Magasins
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              lineHeight: 1.4,
              marginBottom: '16px',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            89 rue Saint-Honoré 75001 &nbsp;·&nbsp; 44 rue Saint-Antoine 75004
          </p>
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '18px',
              letterSpacing: '0.5em',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '40px',
            }}
          >
            パリ一区・四区
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
          <Link
            to="/commander"
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
          </Link>
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
            <Link
              to="/commander"
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
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Commander
            </Link>
          </div>
        </div>
      </section>

      {/* Nos deux boutiques */}
      <section className="pdv-section" style={{padding: 'clamp(60px, 10vw, 100px) 24px', backgroundColor: 'var(--color-cream)'}}>
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
                <img
                  src={pdv.image}
                  alt={`Boutique HOSO MATCHA ${pdv.adresse}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  style={{opacity: 0.72}}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(26,47,35,0.15) 0%, rgba(26,47,35,0.25) 38%, rgba(26,47,35,0.78) 78%, rgba(26,47,35,0.92) 100%)',
                  }}
                />

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

                  <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                    <a
                      href={pdv.orderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdv-cta inline-flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        flex: '1 1 160px',
                        padding: '14px 24px',
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a
                      href={pdv.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdv-cta inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        flex: '1 1 140px',
                        padding: '14px 20px',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase' as const,
                        color: 'white',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: '4px',
                        textDecoration: 'none',
                      }}
                    >
                      Itinéraire
                    </a>
                  </div>
                </div>
              </div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Horaires */}
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
                <span style={{fontSize: '12px', color: 'var(--color-stone)'}}>
                  Dans nos deux boutiques parisiennes
                </span>
              </div>
            </div>

            {/* Contact */}
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
