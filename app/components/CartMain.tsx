import {useOptimisticCart} from '@shopify/hydrogen';
import {Link, useNavigate} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useConfig} from '~/utils/themeContext';
import {ShoppingBag} from 'lucide-react';
import {PrepareDesignsForCheckout} from './PrepareDesignsForCheckout';
import {useEffect, useMemo} from 'react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  checkoutDomain?: string;
};

/**
 * The main cart component that displays the cart items and summary.
 * Modern, clean design with fixed height layout and glass morphism effects.
 */
export function CartMain({
  layout,
  cart: originalCart,
  checkoutDomain,
}: CartMainProps) {
  const config = useConfig();
  const {close} = useAside();

  // Enhanced optimistic cart with safety checks
  // Use the useOptimisticCart hook for type consistency
  const optimisticCart = useOptimisticCart(originalCart);
  
  // Create a safe version that adds missing data where needed
  const cart = useMemo(() => {
    try {
      if (!optimisticCart) return optimisticCart;
      
      // Create a shallow copy to avoid mutating the optimistic cart directly
      const safeCart = {...optimisticCart};
      
      // Fix for missing variant data
      if (safeCart?.lines?.nodes) {
        safeCart.lines = {...safeCart.lines};
                 safeCart.lines.nodes = safeCart.lines.nodes.map((line: any) => {
           // Skip lines with complete merchandise data
           if (line && line.merchandise?.product) return line;
           
           // Clone the line to avoid mutations
           const fixedLine = {...line};
          
          // Try to find matching line in original cart
          if (originalCart?.lines?.nodes && line) {
            const originalLine = originalCart.lines.nodes.find(ol => ol.id === line.id);
            if (originalLine?.merchandise?.product) {
              if (!fixedLine.merchandise) fixedLine.merchandise = {...originalLine.merchandise};
              else fixedLine.merchandise = {
                ...fixedLine.merchandise,
                product: originalLine.merchandise.product
              };
            }
          }
          return fixedLine;
        });
      }
      return safeCart;
    } catch (error) {
      console.error('Error creating safe cart:', error);
      return optimisticCart || originalCart;
    }
  }, [optimisticCart, originalCart]);

  // Debug the cart structure and custom designs
  console.log('CartMain - Original cart:', originalCart);
  console.log('CartMain - Optimistic cart:', cart);

  if (cart?.lines?.nodes && cart.lines.nodes.length > 0) {
    console.log('CartMain - First line item structure:', cart.lines.nodes[0]);
    console.log(
      'CartMain - First line merchandise:',
      cart.lines.nodes[0]?.merchandise,
    );
    console.log(
      'CartMain - First line product:',
      cart.lines.nodes[0]?.merchandise?.product,
    );
    
    // Debug custom design attributes
    cart.lines.nodes.forEach((line, index) => {
      const hasCustomDesign = line.attributes?.some(
        attr => attr.key === '_custom_design' && attr.value === 'true'
      );
      
      if (hasCustomDesign) {
        console.log(`🎨 CartMain - Line ${index} has custom design:`, {
          lineId: line.id,
          attributes: line.attributes,
          attributeCount: line.attributes?.length || 0,
        });
      }
    });
  }

  // Cart calculations
  const cartHasItems = (cart?.totalQuantity || 0) > 0;

  // Loading state with modern spinner
  if (cart === undefined) {
    return (
      <div className="cart-container flex items-center justify-center">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-primary/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <CartEmpty hidden={cartHasItems} layout={layout} />

      {cartHasItems && (
        <div className="flex flex-col h-full">
          {/* Header - Minimal padding for maximum content space */}
          <div className="flex-shrink-0 p-3 pb-2">
            <div className="flex items-center justify-between">
              <h2 style={{fontSize: '16px', fontWeight: 500, color: 'var(--color-charcoal)'}}>Panier</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1" style={{fontSize: '12px', color: 'var(--color-stone)'}}>
                  <span>{cart?.totalQuantity || 0}</span>
                  <span>
                    {(cart?.totalQuantity || 0) === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                {layout === 'aside' && (
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-sm transition-all duration-200"
                    style={{color: 'var(--color-stone)'}}
                    onClick={close}
                    aria-label="Close cart"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items - Maximized scrollable area */}
          <div className="cart-items-container">
            <div className="pt-4 px-2 pb-2">
              <div className="space-y-2">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary - Compact bottom */}
          <div className="cart-summary-container">
            <div style={{borderTop: '1px solid var(--color-cream-dark)', backgroundColor: 'var(--color-cream-warm)'}}>
                          {/* Prepare designs for checkout */}
            <PrepareDesignsForCheckout 
              cart={cart} 
              onComplete={() => {
                console.log('✅ Designs prepared for checkout');
              }}
              onError={(error) => {
                console.error('❌ Error preparing designs:', error);
              }}
            />
            
            <CartSummary
              cart={cart}
              layout={layout}
              checkoutDomain={checkoutDomain}
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();

  if (hidden) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
      <ShoppingBag className="w-12 h-12 mb-4" style={{color: 'var(--color-cream-dark)'}} />
      <p style={{fontSize: '15px', fontWeight: 500, color: 'var(--color-charcoal)', marginBottom: '8px'}}>
        Votre panier est vide
      </p>
      <p style={{fontSize: '13px', color: 'var(--color-stone)', marginBottom: '24px'}}>
        Découvrez nos produits et ajoutez vos favoris.
      </p>
      <Link
        to="/collections/all"
        onClick={close}
        className="inline-block transition-all duration-300"
        style={{
          padding: '12px 28px',
          backgroundColor: 'var(--color-matcha-mid)',
          color: 'white',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          textDecoration: 'none',
        }}
      >
        Voir les produits
      </Link>
    </div>
  );
}
