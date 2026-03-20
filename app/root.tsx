import {getShopAnalytics, useNonce, Analytics} from '@shopify/hydrogen';
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  type LinksFunction,
} from 'react-router';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from 'react-router';
import {PageLayout} from '~/components/PageLayout';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {useEffect} from 'react';
import {initializeTheme} from '~/lib/themeConfig';
import {useScrollReveal} from '~/hooks/useScrollReveal';
import config from '~/utils/config';
import {ThemeProvider} from '~/utils/themeContext';
import {CartProvider} from '~/providers/CartProvider';
import {Aside} from '~/components/Aside';

import appStyles from './styles/app.css?url';
import favicon from '~/assets/favicon.svg';

export const links: LinksFunction = () => {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const},
    {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700&family=Almarai:wght@300;400;700;800&family=Noto+Serif+JP:wght@400;500&display=swap'},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

// Define meta tags statically to ensure consistency between server and client rendering
export const meta: MetaFunction = () => {
  return [
    {title: `${config.brandName} | Matcha Premium d'Exception depuis Uji, Kyoto`},
    {
      name: 'description',
      content: "HOSO MATCHA - Matcha d'exception sélectionné à Uji, Kyoto. Matcha cérémonial, matcha culinaire, accessoires traditionnels japonais et coffrets. Livraison en France.",
    },
    {
      name: 'keywords',
      content: 'matcha, matcha premium, matcha cérémonial, matcha culinaire, thé vert japonais, Uji, Kyoto, matcha bio, chasen, chawan, thé matcha, poudre de matcha, matcha latte, matcha Paris, HOSO MATCHA, accessoires matcha, coffret matcha',
    },
    {property: 'og:title', content: `${config.brandName} | Matcha Premium depuis Uji, Kyoto`},
    {property: 'og:description', content: "Matcha d'exception sélectionné à Uji, Kyoto. Découvrez nos matchas cérémoniaux et culinaires, accessoires traditionnels et coffrets."},
    {property: 'og:image', content: config.brandLogo},
    {property: 'og:type', content: 'website'},
    {property: 'og:locale', content: 'fr_FR'},
    {property: 'og:site_name', content: 'HOSO MATCHA'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: `${config.brandName} | Matcha Premium depuis Uji, Kyoto`},
    {name: 'twitter:description', content: "Matcha d'exception sélectionné à Uji, Kyoto. Matchas cérémoniaux, culinaires et accessoires traditionnels."},
    {name: 'twitter:image', content: config.brandLogo},
    {name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Get shop analytics for Analytics.Provider
  const {context} = args;
  const shopAnalytics = getShopAnalytics({
    storefront: context.storefront,
    publicStorefrontId: context.env.PUBLIC_STOREFRONT_ID,
  });

  return {
    ...criticalData,
    ...deferredData,
    shop: shopAnalytics,
    consent: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: context.env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true, // Enable privacy banner
      // Localize the privacy banner
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{shop}] = await Promise.all([
    context.storefront.query(LAYOUT_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    layout: {shop},
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched and rendered later, improving the initial page load performance.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart, env} = context || {};

  // defer the footer query (below the fold)
  const footer =
    storefront
      ?.query(FOOTER_QUERY, {
        cache: storefront.CacheLong(),
        variables: {
          footerMenuHandle: 'footer', // Adjust to your footer menu handle
        },
      })
      .catch((error: unknown) => {
        // Log query errors, but don't throw them so the page can still render
        console.error(error);
        return null;
      }) || Promise.resolve(null);

  // defer the header query (above the fold, but not critical)
  const header =
    storefront
      ?.query(HEADER_QUERY, {
        cache: storefront.CacheLong(),
        variables: {
          headerMenuHandle: 'main-menu', // Adjust to your header menu handle
        },
      })
      .catch((error: unknown) => {
        console.error(error);
        return null;
      }) || Promise.resolve(null);

  // Safely access cart - it might not be available during POST actions
  const cartData = cart ? cart.get() : Promise.resolve(null);

  // Log the cart data for debugging purposes
  console.log('Loading cart data:', cartData);

  return {
    footer,
    header,
    cart: cartData,
    isLoggedIn: customerAccount?.isLoggedIn() || Promise.resolve(false),
    publicStoreDomain: env?.PUBLIC_STORE_DOMAIN || '',
    checkoutDomain: env?.PUBLIC_CHECKOUT_DOMAIN || '',
  };
}

const LAYOUT_QUERY = `#graphql
  query layout($language: LanguageCode) @inContext(language: $language) {
    shop {
      id
      name
      description
    }
  }
` as const;

// Helper function to convert hex to RGB for CSS variables
function hexToRgb(hex: string) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

export function Layout({children}: {children?: React.ReactNode}) {
  let nonce: string | undefined;
  try {
    nonce = useNonce();
  } catch {
    // useNonce requires Hydrogen context which may not be available during initial client render
  }
  const data = useLoaderData<typeof loader>();

  // Initialize scroll reveal animations
  useScrollReveal();

  // Initialize theme on client side
  useEffect(() => {
    initializeTheme();

    // Add RGB versions of color variables for shadows and opacity
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const primaryColor = getComputedStyle(root)
        .getPropertyValue('--color-primary')
        .trim();

      if (primaryColor) {
        root.style.setProperty('--color-primary-rgb', hexToRgb(primaryColor));
      }
    }
  }, []);

  // Handle cases where data might be incomplete (e.g., during cart API calls)
  const safeData = {
    cart: data?.cart || null,
    header: data?.header || null,
    footer: data?.footer || null,
    isLoggedIn: data?.isLoggedIn || false,
    publicStoreDomain: data?.publicStoreDomain || '',
    checkoutDomain: data?.checkoutDomain || '',
    layout: data?.layout || null,
  };

  const hasUserConsent = true;

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/* Keep CSS variables consistent between server and client */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: #3d6b4f;
                --color-secondary: #f5f0e6;
                --color-accent: #c9a55c;
                --color-background: #f5f0e6;
                --color-text: #1a1a18;

                --color-primary-rgb: 61, 107, 79;
                --color-secondary-rgb: 245, 240, 230;

                --font-primary: 'Filson Pro', 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                --font-secondary: 'Noto Serif JP', Georgia, serif;
                --font-display: 'Bricolage Grotesque', 'Filson Pro', 'Almarai', sans-serif;

                --spacing-xs: 0.25rem;
                --spacing-sm: 0.5rem;
                --spacing-md: 1rem;
                --spacing-lg: 1.5rem;
                --spacing-xl: 2rem;
                --spacing-2xl: 3rem;
                --spacing-3xl: 4rem;

                --radius-sm: 0.25rem;
                --radius-md: 0.5rem;
                --radius-lg: 0.75rem;
                --radius-xl: 1rem;

                --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
                --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
                --shadow-primary: 0 0 15px rgba(61, 107, 79, 0.15);
              }
            `,
          }}
        />
      </head>
      <body>
        <Analytics.Provider
          cart={safeData.cart}
          shop={data?.shop}
          consent={data?.consent}
        >
          <ThemeProvider>
            <Aside.Provider>
              <CartProvider>
                <PageLayout
                  cart={safeData.cart}
                  header={safeData.header}
                  footer={safeData.footer}
                  isLoggedIn={safeData.isLoggedIn}
                  publicStoreDomain={safeData.publicStoreDomain}
                  checkoutDomain={safeData.checkoutDomain}
                  layout={safeData.layout}
                >
                  {children}
                </PageLayout>
                <ScrollRestoration nonce={nonce} />
                <Scripts nonce={nonce} />
              </CartProvider>
            </Aside.Provider>
          </ThemeProvider>
        </Analytics.Provider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data ?? errorMessage;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops!</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
