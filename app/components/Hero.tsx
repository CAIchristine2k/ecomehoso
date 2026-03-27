import React from 'react';
import {Link} from 'react-router';
import {useConfig} from '~/utils/themeContext';

export function Hero() {
  const config = useConfig();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={config.heroBackgroundImage}
          alt="HOSO MATCHA - Matcha premium d'exception depuis Uji, Kyoto, Japon"
          className="absolute inset-0 w-full h-full object-cover"
          style={{filter: 'saturate(0.85)', opacity: 0.75}}
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 z-10" style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(26, 47, 35, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(26, 47, 35, 0.6) 0%, transparent 50%),
            linear-gradient(180deg, rgba(26, 47, 35, 0.3) 0%, rgba(26, 47, 35, 0.1) 40%, rgba(26, 47, 35, 0.5) 100%)
          `
        }}></div>
        {/* Subtle noise texture */}
        <div className="absolute inset-0 z-11 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Hero Content - Centered, minimal */}
      <div className="relative z-20 text-center px-4">
        <div
          className="pb-6 hero-title-breathe mx-auto overflow-hidden"
          style={{
            height: 'clamp(180px, 35vw, 450px)',
            width: 'clamp(300px, 60vw, 700px)',
          }}
        >
          <img
            src="/images/hoso-logo-brush.png"
            alt="Logo HOSO MATCHA - marque de matcha cérémonial et culinaire premium"
            className="w-full h-full"
            style={{
              filter: 'brightness(0) invert(1)',
              objectFit: 'cover',
              transform: 'scale(0.9)',
            }}
          />
        </div>

        {/* Japanese subtitle */}
        <p
          className="text-white/80"
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            letterSpacing: '1em',
          }}
        >
          宇治
        </p>

        <p
          className="text-white/70 max-w-lg mx-auto mb-12"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: '15px',
            fontWeight: 300,
            lineHeight: 1.9,
            letterSpacing: '0.02em',
          }}
        >
          {config.heroSubtitle}
        </p>

        <a
          href="#matcha-showcase"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('matcha-showcase')?.scrollIntoView({behavior: 'smooth'});
          }}
          className="inline-block transition-all duration-500 hover:-translate-y-1 btn-press cursor-pointer"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            padding: '18px 56px',
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            fontWeight: 500,
            backgroundColor: 'rgba(61, 107, 79, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '4px',
            color: 'transparent',
            WebkitTextStroke: '1px white',
          }}
        >
          {config.ctaText}
        </a>

        <div className="mt-4">
          <Link
            to="/notre-magasin"
            className="inline-block transition-all duration-500 hover:-translate-y-1 btn-press"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              padding: '18px 56px',
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              fontWeight: 500,
              backgroundColor: 'transparent',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '4px',
              color: 'transparent',
              WebkitTextStroke: '1px white',
            }}
          >
            Découvrir nos basques
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
        <span
          className="text-white/60 mb-3"
          style={{
            fontFamily: "'Brusher', 'Poppins', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase' as const,
          }}
        >
          SCROLL
        </span>
        <div className="w-px h-10 bg-white/30 animate-pulse"></div>
      </div>

      {/* Bottom tagline bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-8 py-4 px-6"
        style={{
          background: 'rgba(26, 47, 35, 0.85)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {['Matcha d\'exception', 'Origine Uji, Kyoto', 'Artisanal', 'Livraison offerte'].map((item, i) => (
          <span
            key={i}
            className="text-white/60 hidden sm:inline"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              fontWeight: 400,
            }}
          >
            {i > 0 && <span className="mr-8 text-white/30">·</span>}
            {item}
          </span>
        ))}
        {/* Mobile: show only first two */}
        {['Matcha d\'exception', 'Uji, Kyoto'].map((item, i) => (
          <span
            key={`mobile-${i}`}
            className="text-white/60 sm:hidden"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              fontWeight: 400,
            }}
          >
            {i > 0 && <span className="mr-6 text-white/30">·</span>}
            {item}
          </span>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hero-title-glow {
            text-shadow: 0 4px 40px rgba(0, 0, 0, 0.3);
          }
          .hero-title-breathe {
            animation: heroBreathe 4s ease-in-out infinite;
          }
          @keyframes heroBreathe {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `,
        }}
      />
    </section>
  );
}
