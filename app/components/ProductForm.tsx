import {useState, useEffect} from 'react';
import {useConfig} from '~/utils/themeContext';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {Money, ShopPayButton} from '@shopify/hydrogen';
import type {ProductDetailsQuery} from 'storefrontapi.generated';
import {useCart} from '~/providers/CartProvider';
import {useLoaderData} from 'react-router';

interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{name: string; value: string}>;
  price: {
    amount: string;
    currencyCode: any;
    __typename?: 'MoneyV2';
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: any;
    __typename?: 'MoneyV2';
  } | null;
  sku?: string | null;
}

export function ProductForm({
  product,
  storeDomain,
  onVariantChange,
}: {
  product: NonNullable<ProductDetailsQuery['product']>;
  storeDomain?: string;
  onVariantChange?: (variant: any) => void;
}) {
  const config = useConfig();
  const {open} = useAside();
  const {openCart} = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const variant = product.selectedVariant || product.variants?.nodes?.[0];
    if (variant) {
      setSelectedVariant({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        selectedOptions: variant.selectedOptions,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode,
          __typename: 'MoneyV2',
        },
        compareAtPrice: variant.compareAtPrice
          ? {
              amount: variant.compareAtPrice.amount,
              currencyCode: variant.compareAtPrice.currencyCode,
              __typename: 'MoneyV2',
            }
          : null,
        sku: variant.sku,
      });

      setSelectedOptions(
        variant.selectedOptions.reduce(
          (acc: Record<string, string>, option) => {
            acc[option.name] = option.value;
            return acc;
          },
          {},
        ),
      );
    }
  }, [product]);

  useEffect(() => {
    if (selectedVariant && onVariantChange) {
      const variantWithImage = product.variants?.nodes?.find(
        (variant) => variant.id === selectedVariant.id,
      );
      if (variantWithImage) {
        onVariantChange(variantWithImage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant?.id, product.variants?.nodes]);

  const options = product.options.filter((option) => option.values.length > 1);

  const updateSelectedVariant = (name: string, value: string) => {
    const newSelectedOptions = {...selectedOptions, [name]: value};
    setSelectedOptions(newSelectedOptions);

    const variantNodes = product.variants?.nodes || [];
    const newVariant = variantNodes.find((variant) => {
      return variant.selectedOptions.every((option) => {
        return newSelectedOptions[option.name] === option.value;
      });
    });

    if (newVariant) {
      setSelectedVariant({
        id: newVariant.id,
        title: newVariant.title,
        availableForSale: newVariant.availableForSale,
        selectedOptions: newVariant.selectedOptions,
        price: {
          amount: newVariant.price.amount,
          currencyCode: newVariant.price.currencyCode,
          __typename: 'MoneyV2',
        },
        compareAtPrice: newVariant.compareAtPrice
          ? {
              amount: newVariant.compareAtPrice.amount,
              currencyCode: newVariant.compareAtPrice.currencyCode,
              __typename: 'MoneyV2',
            }
          : null,
        sku: newVariant.sku,
      });
    }
  };

  const formatVariantId = (id: string) => {
    if (!id) return '';
    if (id.startsWith('gid://shopify/ProductVariant/')) return id;
    const numericId = id.includes('/') ? id.split('/').pop() || id : id;
    return `gid://shopify/ProductVariant/${numericId}`;
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
      setTimeout(() => openCart(), 500);
    }, 500);
  };

  const lines = selectedVariant
    ? [{merchandiseId: formatVariantId(selectedVariant.id), quantity}]
    : [];

  const isAvailable = selectedVariant?.availableForSale || false;

  if (!selectedVariant) {
    return <div style={{color: 'var(--color-stone)', fontSize: '14px'}}>Chargement des options...</div>;
  }

  return (
    <div>
      {/* Variant Selector - Tab style like screenshot */}
      {options.length > 0 && (
        <div className="mb-8">
          {options.map((option) => (
            <div key={option.name}>
              <div
                className="flex"
                style={{
                  border: '1px solid var(--color-cream-dark)',
                  borderRadius: '0',
                }}
              >
                {option.values.map((value, index) => {
                  const isSelected = selectedOptions[option.name] === value;
                  const variantNodes = product.variants?.nodes || [];
                  const optionVariant = variantNodes.find((variant) =>
                    variant.selectedOptions.some(
                      (opt) => opt.name === option.name && opt.value === value,
                    ),
                  );
                  const isAvailableOption = optionVariant?.availableForSale || false;

                  return (
                    <button
                      key={value}
                      onClick={() => updateSelectedVariant(option.name, value)}
                      disabled={!isAvailableOption}
                      className="flex-1 flex items-center justify-center gap-2 py-4 transition-all duration-200"
                      style={{
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 400,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase' as const,
                        color: isAvailableOption
                          ? 'var(--color-charcoal)'
                          : 'var(--color-stone)',
                        backgroundColor: isSelected
                          ? 'var(--color-cream-warm)'
                          : 'transparent',
                        borderRight: index < option.values.length - 1
                          ? '1px solid var(--color-cream-dark)'
                          : 'none',
                        opacity: isAvailableOption ? 1 : 0.5,
                        cursor: isAvailableOption ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {/* Small icon */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                      </svg>
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Add to Cart Button - Large, prominent */}
      <div>
        <AddToCartButton
          lines={lines}
          selectedVariant={selectedVariant}
          disabled={!isAvailable || isAdding}
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isAvailable ? 'var(--color-matcha-mid)' : 'var(--color-cream-dark)',
            color: isAvailable ? '#ffffff' : 'var(--color-stone)',
            padding: '18px 32px',
            borderRadius: '10px',
            fontSize: 'clamp(13px, 3.5vw, 15px)',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            boxShadow: isAvailable ? '0 4px 16px rgba(76,120,72,0.3)' : 'none',
            border: 'none',
            gap: '8px',
          }}
        >
          {isAdding ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Ajout en cours...
            </div>
          ) : addedToCart ? (
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Ajouté au panier !
            </div>
          ) : isAvailable ? (
            <span>
              Ajouter au panier — <Money data={selectedVariant.price} />
            </span>
          ) : (
            'Épuisé'
          )}
        </AddToCartButton>
      </div>
    </div>
  );
}
