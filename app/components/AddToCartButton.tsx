import {CartForm} from '@shopify/hydrogen';
import {useCart} from '~/providers/CartProvider';
import {useEffect, useState} from 'react';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

// Flexible type for selectedVariant that matches our actual GraphQL data
type SelectedVariant = {
  id: string;
  availableForSale?: boolean;
  title?: string;
  price?: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  [key: string]: any; // Allow additional fields
};

// Extended CartLineInput to include selectedVariant for optimistic cart
type ExtendedCartLineInput = CartLineInput & {
  selectedVariant?: SelectedVariant;
};

export function AddToCartButton({
  children,
  disabled,
  lines,
  analytics,
  className,
  style,
  buttonText = 'Ajouter au panier',
  onClick,
  selectedVariant,
}: {
  children?: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  analytics?: unknown;
  className?: string;
  style?: React.CSSProperties;
  buttonText?: string;
  onClick?: () => void;
  selectedVariant?: SelectedVariant;
}) {
  const {openCart} = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const defaultClasses =
    'w-full bg-primary hover:bg-primary-600 text-background font-bold py-4 px-6 rounded-sm transition-all duration-300 uppercase tracking-wider shadow-glow transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  // Reset added state after some time
  useEffect(() => {
    if (addedToCart) {
      const timeout = setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [addedToCart]);

  // Handle successful form submission
  const handleSuccess = () => {
    console.log('AddToCartButton form submitted successfully');
    onClick?.();
  };

  // Determine the button text based on the current state
  let buttonContent = children || buttonText;
  if (addedToCart) {
    buttonContent = 'Ajoute au panier !';
  }

  // Enhance lines with selectedVariant for optimistic cart
  const enhancedLines = selectedVariant
    ? lines.map((line) => ({...line, selectedVariant}))
    : lines;

  // Create properly typed lines for CartForm inputs
  const cartFormLines = enhancedLines.map((line) => {
    const baseInput = {
      merchandiseId: line.merchandiseId,
      quantity: line.quantity,
      attributes: line.attributes,
    };
    
    // Add selectedVariant for optimistic cart functionality
    // selectedVariant is required by useOptimisticCart but not in CartLineInput types
    if (selectedVariant) {
      // @ts-ignore
      baseInput.selectedVariant = selectedVariant;
    }
    
    return baseInput;
  });

  // Debug any custom attributes being added and selectedVariant
  useEffect(() => {
    if (lines.some((line) => line.attributes && line.attributes.length > 0)) {
      console.log(
        '🔍 AddToCartButton - Custom attributes detected:',
        lines.map((line) => ({
          merchandiseId: line.merchandiseId,
          quantity: line.quantity,
          attributeCount: line.attributes?.length || 0,
          attributes: line.attributes || [],
        })),
      );
    }
    
    if (selectedVariant) {
      console.log('✅ AddToCartButton - selectedVariant provided:', {
        id: selectedVariant.id,
        title: selectedVariant.title,
        availableForSale: selectedVariant.availableForSale,
      });
    } else {
      console.warn('⚠️ AddToCartButton - No selectedVariant provided for optimistic cart');
    }
  }, [lines, selectedVariant]);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: cartFormLines,
      }}
    >
      {(fetcher) => {
        const isSubmitting = fetcher.state === 'submitting';
        const isSuccess =
          fetcher.state === 'idle' &&
          fetcher.data &&
          !fetcher.data.errors?.length;

        // Debug logging
        useEffect(() => {
          console.log(
            'AddToCartButton fetcher state:',
            fetcher.state,
            'data:',
            fetcher.data,
          );

          // Log form data being submitted
          if (fetcher.formData) {
            const formDataEntries = Array.from(fetcher.formData.entries());
            console.log(
              'AddToCartButton form data being submitted:',
              Object.fromEntries(formDataEntries),
            );
          }
        }, [fetcher.state, fetcher.data, fetcher.formData]);

        // Handle successful cart addition
        useEffect(() => {
          if (isSuccess && fetcher.data?.cart) {
            console.log('Cart updated successfully:', fetcher.data.cart);
            setAddedToCart(true);
            handleSuccess();
            setTimeout(() => {
              openCart();
            }, 300);
          }
        }, [isSuccess, fetcher.data]);

        return (
          <button
            type="submit"
            disabled={disabled || isSubmitting}
            className={className || defaultClasses}
            style={style}
            aria-label={
              typeof buttonContent === 'string' ? buttonContent : 'Ajouter au panier'
            }
          >
            {isSubmitting ? 'Ajout en cours...' : buttonContent}
          </button>
        );
      }}
    </CartForm>
  );
}
