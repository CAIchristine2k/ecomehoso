import {Suspense} from 'react';
import {Await} from 'react-router';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {CartAside} from '~/components/CartAside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {SearchFormPredictive} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {useConfig} from '~/utils/themeContext';
import {WelcomePopup} from '~/components/WelcomePopup';

export type PageLayoutProps = {
  children?: React.ReactNode;
  layout?: {
    shop: any;
  };
  cart?: Promise<CartApiQueryFragment | null>;
  header?: Promise<HeaderQuery | null>;
  footer?: Promise<FooterQuery | null>;
  isLoggedIn?: Promise<boolean>;
  publicStoreDomain?: string;
  checkoutDomain?: string;
};

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  checkoutDomain,
}: PageLayoutProps) {
  const config = useConfig();

  return (
    <div className="flex flex-col min-h-screen" style={{backgroundColor: 'var(--color-cream)', color: 'var(--color-charcoal)'}}>
      {/* Shipping banner */}
      <div
        className="shipping-banner-wrapper"
        style={{
          borderBottom: '1px solid var(--color-cream-dark)',
          backgroundColor: 'var(--color-cream-warm)',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 101,
        }}
      >
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '40px',
          background: 'linear-gradient(to right, var(--color-cream-warm), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '40px',
          background: 'linear-gradient(to left, var(--color-cream-warm), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div
          className="shipping-banner-marquee"
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'shippingBannerScroll 14s linear infinite',
            padding: '10px 0',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 mx-10"
              style={{flexShrink: 0}}
            >
              <span style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: 'var(--color-charcoal)',
              }}>
                Livraison gratuite à partir de 49€
              </span>
              <span style={{
                color: 'var(--color-matcha-mid)',
                opacity: 0.3,
                margin: '0 6px',
                fontSize: '7px',
              }}>
                ●
              </span>
            </span>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shippingBannerScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-16.666%); }
          }
          .shipping-banner-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
      </div>

      <Header />

      <WelcomePopup />

      <main className="flex-grow flex-shrink-0">{children}</main>

      <Footer />

      {/* Aside Components */}
      <Aside type="search" heading="RECHERCHE">
        <div className="p-4" style={{backgroundColor: 'var(--color-cream)', color: 'var(--color-charcoal)'}}>
          <SearchFormPredictive>
            {({fetchResults, inputRef}) => (
              <div>
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Rechercher..."
                  ref={inputRef}
                  type="search"
                  className="w-full p-3 rounded-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-cream-warm)',
                    border: '1px solid var(--color-cream-dark)',
                    color: 'var(--color-charcoal)',
                    fontSize: '14px',
                  }}
                />
              </div>
            )}
          </SearchFormPredictive>
          <SearchResultsPredictive>
            {({term, items, closeSearch, total}) => {
              return (
                <div className="predictive-search">
                  {items && total > 0 && (
                    <div className="grid grid-cols-12 gap-4 mt-4">
                      <SearchResultsPredictive.Products
                        products={items.products || []}
                        closeSearch={closeSearch}
                        term={term}
                      />
                      <SearchResultsPredictive.Pages
                        pages={items.pages || []}
                        closeSearch={closeSearch}
                        term={term}
                      />
                      <SearchResultsPredictive.Articles
                        articles={items.articles || []}
                        closeSearch={closeSearch}
                        term={term}
                      />
                    </div>
                  )}
                  {total === 0 && term.current && (
                    <SearchResultsPredictive.Empty term={term} />
                  )}
                </div>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </Aside>

      {/* USING SPECIALIZED CART ASIDE THAT GUARANTEES RIGHT POSITIONING */}
      <CartAside heading="PANIER">
        <Suspense
          fallback={
            <div className="p-4 flex items-center justify-center h-full">
              <div className="w-10 h-10 border-t-2 border-r-2 border-primary rounded-full animate-spin"></div>
            </div>
          }
        >
          <Await resolve={cart || Promise.resolve(null)}>
            {(resolvedCart) => {
              console.log('Cart resolved in PageLayout:', resolvedCart);
              // Ensure we have a valid cart object or null
              const cartData = resolvedCart || null;
              return (
                <CartMain
                  cart={cartData}
                  layout="aside"
                  checkoutDomain={checkoutDomain}
                />
              );
            }}
          </Await>
        </Suspense>
      </CartAside>

      <Aside type="mobile" heading="MENU">
        <div className="p-4" style={{backgroundColor: 'var(--color-cream)', color: 'var(--color-charcoal)'}}>
          <nav className="space-y-4">
            {config.navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block transition-colors duration-300 hover:text-[#3d6b4f]"
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-charcoal)',
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </Aside>
    </div>
  );
}
