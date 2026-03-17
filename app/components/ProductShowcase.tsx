import React, {useRef, useEffect, useState, useCallback} from 'react';
import {Link} from 'react-router';
import {ProductCard} from '~/components/ProductCard';
import {useConfig} from '~/utils/themeContext';
import type {ProductItemFragment} from 'storefrontapi.generated';

interface ProductShowcaseProps {
  products: ProductItemFragment[];
  title?: string;
  subtitle?: string;
  loading?: 'eager' | 'lazy';
}

export function ProductShowcase({
  products,
  title = 'NOS PRODUITS',
  subtitle,
  loading = 'lazy',
}: ProductShowcaseProps) {
  const config = useConfig();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPosRef = useRef(0);

  const defaultSubtitle = "Sélectionnés avec soin pour vous offrir le meilleur du matcha japonais. Chaque produit incarne notre engagement envers l'excellence et la tradition.";
  const effectiveSubtitle = subtitle || defaultSubtitle;

  const displayProducts = products.slice(0, 6);
  // Duplicate products for seamless infinite loop
  const carouselProducts = [...displayProducts, ...displayProducts, ...displayProducts];

  const animate = useCallback(() => {
    if (!scrollRef.current || isPaused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    scrollPosRef.current += 0.5; // medium speed

    const singleSetWidth = scrollRef.current.scrollWidth / 3;
    if (scrollPosRef.current >= singleSetWidth) {
      scrollPosRef.current -= singleSetWidth;
    }

    scrollRef.current.style.transform = `translateX(-${scrollPosRef.current}px)`;
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <section
      id="shop"
      className="relative overflow-hidden py-0 md:py-[var(--section-spacing)]"
      style={{
        backgroundColor: 'var(--color-cream)',
      }}
    >
      <div className="relative z-10">
        {/* Section Header */}
        <div className="mb-8 md:mb-16 text-center px-3 md:px-10">
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
            Collection
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--color-charcoal)',
              marginBottom: '12px',
            }}
          >
            {title}
          </h2>
          <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.85rem', color: 'var(--color-matcha-mid)', letterSpacing: '0.3em', marginTop: '8px'}}>
            私たちの製品
          </p>
          <p
            className="max-w-2xl mx-auto"
            style={{
              color: 'var(--color-stone)',
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            {effectiveSubtitle}
          </p>
        </div>

        {/* Product Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
        >
          {/* Fade edges */}
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '60px',
              background: 'linear-gradient(to right, var(--color-cream), transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '60px',
              background: 'linear-gradient(to left, var(--color-cream), transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />

          <div
            ref={scrollRef}
            className="flex"
            style={{
              gap: 'clamp(12px, 2vw, 24px)',
              paddingLeft: '12px',
              paddingRight: '12px',
              willChange: 'transform',
            }}
          >
            {carouselProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0"
                style={{
                  width: 'clamp(260px, 40vw, 380px)',
                }}
              >
                <ProductCard product={product} loading={loading} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="mt-8 md:mt-16 mb-8 md:mb-16 text-center">
          <Link
            to="/collections/all"
            prefetch="intent"
            className="inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-matcha-mid)',
            }}
          >
            Voir tous les produits
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
