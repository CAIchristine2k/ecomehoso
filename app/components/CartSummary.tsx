import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {FormattedMoney} from '~/components/FormattedMoney';
import {useRef} from 'react';
import {FetcherWithComponents, Link} from 'react-router';
import {useConfig} from '~/utils/themeContext';
import {useAside} from '~/components/Aside';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
  checkoutDomain?: string;
};

export function CartSummary({cart, layout, checkoutDomain}: CartSummaryProps) {
  const config = useConfig();

  return (
    <div
      aria-labelledby="cart-summary"
      className={`p-6 ${layout === 'page' ? 'max-w-md ml-auto' : ''}`}
    >
      <h4 className="text-lg font-bold mb-4" style={{color: 'var(--color-charcoal)'}}>Récapitulatif</h4>

      {/* Free shipping progress bar */}
      {(() => {
        const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || '0');
        const threshold = 50;
        const remaining = Math.max(0, threshold - subtotal);
        const progress = Math.min(100, (subtotal / threshold) * 100);
        return (
          <div className="mb-5 p-3 rounded-lg" style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)'}}>
            {remaining > 0 ? (
              <p style={{fontSize: '12px', color: 'var(--color-charcoal)', marginBottom: '6px', fontWeight: 400}}>
                Plus que <strong style={{color: 'var(--color-matcha-mid)'}}>{remaining.toFixed(0)}€</strong> pour la livraison offerte à partir de 50€
              </p>
            ) : (
              <p style={{fontSize: '12px', color: 'var(--color-matcha-mid)', marginBottom: '6px', fontWeight: 500}}>
                ✓ Livraison offerte !
              </p>
            )}
            <div style={{height: '3px', backgroundColor: 'var(--color-cream-dark)', borderRadius: '2px', overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${progress}%`, backgroundColor: 'var(--color-matcha-mid)', borderRadius: '2px', transition: 'width 0.5s ease'}} />
            </div>
          </div>
        );
      })()}

      <dl className="space-y-4">
        <div className="flex justify-between items-center">
          <dt className="font-medium" style={{color: 'var(--color-stone)'}}>Sous-total</dt>
          <dd className="font-bold" style={{color: 'var(--color-charcoal)'}}>
            {cart.cost?.subtotalAmount?.amount ? (
              <FormattedMoney data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>

        {cart.cost?.totalTaxAmount?.amount ? (
          <div className="flex justify-between items-center">
            <dt className="font-medium" style={{color: 'var(--color-stone)'}}>TVA incluse</dt>
            <dd className="font-bold" style={{color: 'var(--color-charcoal)'}}>
              <FormattedMoney data={cart.cost.totalTaxAmount} />
            </dd>
          </div>
        ) : null}

        <div className="flex justify-between items-center pt-4 mt-4" style={{borderTop: '1px solid var(--color-cream-dark)'}}>
          <dt className="font-bold text-lg" style={{color: 'var(--color-charcoal)'}}>Total</dt>
          <dd className="font-bold text-xl" style={{color: 'var(--color-matcha-mid)'}}>
            {cart.cost?.totalAmount?.amount ? (
              <FormattedMoney data={cart.cost?.totalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
      </dl>
      <CartDiscounts discountCodes={cart.discountCodes} />
      <CartCheckoutActions
        checkoutUrl={cart.checkoutUrl}
        checkoutDomain={checkoutDomain}
      />
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  checkoutDomain,
}: {
  checkoutUrl?: string;
  checkoutDomain?: string;
}) {
  const config = useConfig();
  const {close} = useAside();

  if (!checkoutUrl) return null;

  // Parse the checkout URL to preserve query parameters
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(checkoutUrl);
  } catch (error) {
    // Fallback to our custom checkout
    return (
      <div className="mt-8">
        <a
          href={checkoutUrl}
          onClick={close}
          className="block w-full text-white text-center py-4 px-6 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
          style={{backgroundColor: 'var(--color-matcha-mid)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, textDecoration: 'none'}}
        >
          Passer commande {'\u2192'}
        </a>
        <div className="mt-4 flex items-center justify-center">
          <p className="text-xs text-center" style={{color: 'var(--color-mist)'}}>
            Paiement sécurisé
          </p>
        </div>
      </div>
    );
  }

  // Preserve the actual checkout path and parameters
  const checkoutPath = parsedUrl.pathname;
  const checkoutParams = parsedUrl.search;

  // Construct the final checkout URL
  let finalCheckoutUrl = checkoutUrl;

  // If we're using a custom domain, ensure we construct the URL correctly
  if (checkoutDomain) {
    try {
      const customDomainUrl = new URL(`https://${checkoutDomain}`);
      customDomainUrl.pathname = checkoutPath;
      customDomainUrl.search = checkoutParams;
      finalCheckoutUrl = customDomainUrl.toString();
    } catch (error) {
      finalCheckoutUrl = checkoutUrl;
    }
  }

  return (
    <div className="mt-8">
      <a
        href={finalCheckoutUrl}
        onClick={close}
        className="block w-full text-white text-center py-4 px-6 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 btn-press"
        style={{backgroundColor: 'var(--color-matcha-mid)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, textDecoration: 'none'}}
      >
        Passer commande &rarr;
      </a>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center gap-4">
          <span className="text-xs" style={{color: 'var(--color-stone)'}}>
            🔒 Paiement sécurisé
          </span>
          <span className="text-xs" style={{color: 'var(--color-stone)'}}>
            🚚 Livraison offerte dès 50€
          </span>
        </div>
        <p className="text-xs text-center" style={{color: 'var(--color-mist)'}}>
          Satisfait ou remboursé · Retour sous 14 jours
        </p>
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const config = useConfig();
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mt-6 mb-4">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length} className="mb-4">
        <div>
          <dt className="font-medium mb-2" style={{fontSize: '12px', color: 'var(--color-stone)'}}>
            Code promo appliqué
          </dt>
          <UpdateDiscountForm>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'rgba(61, 107, 79, 0.08)', border: '1px solid rgba(61, 107, 79, 0.2)'}}>
              <code className="text-sm font-mono" style={{color: 'var(--color-matcha-mid)'}}>
                {codes?.join(', ')}
              </code>
              <button className="text-sm transition-colors font-medium" style={{color: 'var(--color-stone)'}}>
                Retirer
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            id="discountCode"
            type="text"
            name="discountCode"
            placeholder="Code promo"
            className="flex-grow rounded-lg px-4 py-2.5 transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-cream)',
              border: '1px solid var(--color-cream-dark)',
              color: 'var(--color-charcoal)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
            style={{
              backgroundColor: 'var(--color-cream)',
              border: '1px solid var(--color-cream-dark)',
              color: 'var(--color-charcoal)',
              fontSize: '12px',
              letterSpacing: '0.05em',
            }}
          >
            Appliquer
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const config = useConfig();
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div className="mb-6">
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length} className="mb-4">
        <div>
          <dt className="text-white/70 font-medium mb-2">
            Applied Gift Card(s)
          </dt>
          <UpdateGiftCardForm>
            <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <code className="text-sm text-primary font-mono">
                {codes?.join(', ')}
              </code>
              <button
                onSubmit={() => removeAppliedCode}
                className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Remove
              </button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="space-y-2">
          <label
            htmlFor="giftCardCode"
            className="block text-white/70 font-medium text-sm"
          >
            Gift Card
          </label>
          <div className="flex gap-2">
            <input
              id="giftCardCode"
              ref={giftCardCodeInput}
              type="text"
              name="giftCardCode"
              placeholder="Enter gift card code"
              className="flex-grow bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200"
            />
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/40 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
