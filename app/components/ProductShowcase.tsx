import React from 'react';
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

  const defaultSubtitle = "Selectionnes avec soin pour vous offrir le meilleur du matcha japonais. Chaque produit incarne notre engagement envers l'excellence et la tradition.";
  const effectiveSubtitle = subtitle || defaultSubtitle;

  return (
    <section
      id="shop"
      className="relative overflow-hidden"
      style={{
        padding: 'var(--section-spacing) 0',
        backgroundColor: 'var(--color-cream)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center">
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

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} loading={loading} />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
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
