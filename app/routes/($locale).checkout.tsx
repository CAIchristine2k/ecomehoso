import React, { useState, useEffect, useCallback } from 'react';
import { useLoaderData, Link, Form, redirect } from 'react-router';
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  MetaFunction,
} from 'react-router';
import { CartForm, Image } from '@shopify/hydrogen';
import { FormattedMoney } from '~/components/FormattedMoney';
import { useConfig } from '~/utils/themeContext';
import type { CartApiQueryFragment, CartLineFragment } from 'storefrontapi.generated';
import { Truck, Shield, CreditCard, ArrowLeft, ExternalLink } from 'lucide-react';
import { CART_QUERY_FRAGMENT } from '~/lib/fragments';

interface LoaderData {
  cart: CartApiQueryFragment;
  checkoutDomain: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Checkout' },
    {
      property: 'og:title',
      content: 'Secure Checkout',
    },
    {
      name: 'description',
      content: 'Complete your purchase securely with Shopify Pay',
    },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { cart: cartHandler } = context;
  const cartData = await cartHandler.get();

  if (!cartData || !cartData.lines?.nodes?.length) {
    return redirect('/cart');
  }

  return {
    cart: cartData,
    checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN || 'https://shop.app'
  };
}

/**
 * CheckoutLineItem component that properly displays custom designs
 * using the same storage manager as CartLineItem for consistency
 */
function CheckoutLineItem({ line }: { line: CartLineFragment }) {
  const { merchandise, quantity, attributes } = line;

  // Find the custom design attributes for this line item
  const customDesignImage = attributes?.find(
    (attr) => attr.key === '_design_image_url' || attr.key === '_checkout_image' || attr.key === '_checkout_display_image',
  )?.value;

  const isCustomDesign = attributes?.some(
    (attr) => (attr.key === '_custom_design' && attr.value === 'true') ||
      (attr.key === '_checkout_image_prepared' && (attr.value === 'true' || attr.value === 'ready'))
  );

  const customizedImage = attributes?.find(
    (attr) => attr.key === '_customized_image' || attr.key === '_checkout_display_image',
  )?.value;

  const designStorageKey = attributes?.find(
    (attr) => attr.key === '_design_storage_key',
  )?.value;

  // State to store local design images
  const [localDesignUrl, setLocalDesignUrl] = useState<string | null>(null);
  const [imageLoadAttempted, setImageLoadAttempted] = useState(false);

  // Debug log all attributes and design info
  console.log(`🔍 [Checkout] CheckoutLineItem Debug for ${merchandise?.product?.title}:`, {
    lineId: line.id,
    isCustomDesign,
    customDesignImage: customDesignImage ? `${customDesignImage.substring(0, 50)}...` : 'NONE',
    customizedImage: customizedImage ? `${customizedImage.substring(0, 50)}...` : 'NONE',
    designStorageKey,
    allAttributes: attributes,
    localDesignUrl: localDesignUrl ? `${localDesignUrl.substring(0, 50)}...` : 'NONE',
    imageLoadAttempted,
  });

  // Check localStorage for persisted design URLs
  useEffect(() => {
    if (!isCustomDesign || imageLoadAttempted) {
      return;
    }

    setImageLoadAttempted(true);

    // Extract line ID from the Shopify cart line ID
    const lineIdMatch = line.id?.match(/gid:\/\/shopify\/CartLine\/([^?]+)/);
    const lineId = lineIdMatch ? lineIdMatch[1] : null;

    if (lineId) {
      try {
        // Try direct localStorage access first - fastest method
        const storageKey = `cart-line-design-${lineId}`;
        const storedDesign = localStorage.getItem(storageKey);

        if (storedDesign && storedDesign.startsWith('http')) {
          console.log(`✅ [Checkout] Found persisted design in localStorage for line: ${lineId}`);
          setLocalDesignUrl(storedDesign);
          return;
        }

        // Also check 'temp-latest' as fallback
        const latestDesign = localStorage.getItem('cart-line-design-temp-latest');
        if (latestDesign && latestDesign.startsWith('http')) {
          console.log('✅ [Checkout] Using latest design from localStorage');
          setLocalDesignUrl(latestDesign);
          return;
        }
      } catch (e) {
        console.error('[Checkout] Error accessing localStorage', e);
      }
    }
  }, [isCustomDesign, line.id, imageLoadAttempted]);

  // Determine what image to display - prioritize custom designs completely
  let displayImageUrl = merchandise?.image?.url || '';
  let displayImageType = 'PRODUCT';

  // Add an effect to use direct attribute values as fallback
  useEffect(() => {
    // If we already have a design image from localStorage, don't replace it
    if (localDesignUrl) return;

    // Otherwise, check direct cart attributes as fallback
    if (isCustomDesign) {
      if (customDesignImage?.startsWith('http')) {
        console.log('🔍 [Checkout] Setting design URL from direct attributes:', customDesignImage.substring(0, 50));
        setLocalDesignUrl(customDesignImage);
      } else if (customizedImage?.startsWith('http')) {
        console.log('🔍 [Checkout] Setting design URL from customized image:', customizedImage.substring(0, 50));
        setLocalDesignUrl(customizedImage);
      }

      // Check for all_designed_images attribute
      const allDesignedImagesAttr = attributes?.find(
        (attr) => attr.key === '_all_designed_images' || attr.key === '_all_design_images'
      )?.value;

      if (allDesignedImagesAttr && !localDesignUrl) {
        try {
          const imageUrls = JSON.parse(allDesignedImagesAttr);
          if (Array.isArray(imageUrls) && imageUrls.length > 0 &&
            typeof imageUrls[0] === 'string' && imageUrls[0].startsWith('http')) {
            console.log('🔍 [Checkout] Setting design URL from all_designed_images:', imageUrls[0].substring(0, 50));
            setLocalDesignUrl(imageUrls[0]);
          }
        } catch (e) {
          console.error('[Checkout] Error parsing all_designed_images', e);
        }
      }
    }
  }, [isCustomDesign, customDesignImage, customizedImage, localDesignUrl, attributes]);

  if (isCustomDesign) {
    // ABSOLUTE PRIORITY: If we have a local design URL from storage, use it
    if (localDesignUrl) {
      displayImageUrl = localDesignUrl;
      displayImageType = 'CUSTOM_DESIGN';
      console.log('✅ [Checkout] Using custom design from storage:', localDesignUrl.substring(0, 50) + '...');
    }
    // SECOND: Direct URL from cart attributes
    else if (customDesignImage?.startsWith('http')) {
      displayImageUrl = customDesignImage;
      displayImageType = 'CUSTOM_DESIGN';
      console.log('✅ [Checkout] Using custom design URL from cart attributes');
    }
    // THIRD: Base64 image from cart attributes
    else if (customDesignImage?.startsWith('data:image')) {
      displayImageUrl = customDesignImage;
      displayImageType = 'CUSTOM_DESIGN';
      console.log('✅ [Checkout] Using custom design base64 from cart attributes');
    }
    // FOURTH: Fallback to customized base image
    else if (customizedImage?.startsWith('http')) {
      displayImageUrl = customizedImage;
      displayImageType = 'CUSTOMIZED_BASE';
      console.log('⚠️ [Checkout] Using customized base image as fallback');
    }
    // LAST RESORT: Product image with custom label
    else {
      displayImageUrl = merchandise?.image?.url || '';
      displayImageType = 'VARIANT_WITH_CUSTOM_LABEL';
      console.warn('❌ [Checkout] Could not load custom design, using product image');
    }
  } else {
    // Standard product without customization
    displayImageUrl = merchandise?.image?.url || '';
    displayImageType = 'VARIANT';
  }

  console.log(`🖼️ [Checkout] Final image decision for ${merchandise?.product?.title}:`, {
    displayImageType,
    hasImageUrl: !!displayImageUrl,
    isCustomDesign,
    hasLocalDesignUrl: !!localDesignUrl,
    imageLoadAttempted,
  });

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg" style={{backgroundColor: 'var(--color-cream)'}}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden relative" style={{backgroundColor: 'var(--color-cream-warm)', border: '1px solid var(--color-cream-dark)'}}>
          {displayImageUrl ? (
            displayImageType === 'CUSTOM_DESIGN' || displayImageType === 'CUSTOMIZED_BASE' ? (
              // Custom design image - URL or base64
              <div className="relative h-full">
                <img
                  src={displayImageUrl}
                  className="w-full h-full object-cover"
                  alt={`Custom ${merchandise.product.title}`}
                  onError={(e) => {
                    console.error('🚨 [Checkout] Custom design image failed to load:', displayImageUrl?.substring(0, 100));

                    // Try falling back to different sources in priority order
                    const imgElement = e.currentTarget;

                    // First check if there are any other attributes with images
                    if (attributes) {
                      // First try _checkout_image or _checkout_display_image if we're not already using it
                      const checkoutImage = attributes.find(attr =>
                        (attr.key === '_checkout_image' || attr.key === '_checkout_display_image') &&
                        attr.value && attr.value.startsWith('http') &&
                        attr.value !== displayImageUrl
                      )?.value;

                      if (checkoutImage) {
                        console.log('♻️ [Checkout] Falling back to checkout image attribute');
                        imgElement.src = checkoutImage;
                        return;
                      }

                      // Next try _all_designed_images or _all_design_images
                      const allDesignedImagesAttr = attributes.find(
                        (attr) => (attr.key === '_all_designed_images' || attr.key === '_all_design_images') &&
                          attr.value && attr.value.startsWith('[')
                      )?.value;

                      if (allDesignedImagesAttr) {
                        try {
                          const imageUrls = JSON.parse(allDesignedImagesAttr);
                          if (Array.isArray(imageUrls) && imageUrls.length > 0 &&
                            typeof imageUrls[0] === 'string' && imageUrls[0].startsWith('http') &&
                            imageUrls[0] !== displayImageUrl) {
                            console.log('♻️ [Checkout] Falling back to all_designed_images URL');
                            imgElement.src = imageUrls[0];
                            return;
                          }
                        } catch (e) { /* Ignore parsing errors */ }
                      }

                      // Next try _design_image_url if not already using it
                      const designImageUrl = attributes.find(attr =>
                        attr.key === '_design_image_url' &&
                        attr.value && attr.value.startsWith('http') &&
                        attr.value !== displayImageUrl
                      )?.value;

                      if (designImageUrl) {
                        console.log('♻️ [Checkout] Falling back to design_image_url attribute');
                        imgElement.src = designImageUrl;
                        return;
                      }

                      // Next try _customized_image if not already using it
                      const custImage = attributes.find(attr =>
                        attr.key === '_customized_image' &&
                        attr.value && attr.value.startsWith('http') &&
                        attr.value !== displayImageUrl
                      )?.value;

                      if (custImage) {
                        console.log('♻️ [Checkout] Falling back to customized_image attribute');
                        imgElement.src = custImage;
                        return;
                      }
                    }

                    // Additionally, check localStorage fallbacks
                    try {
                      // Check the temp-latest key first as that's most likely to have a valid image
                      const latestDesign = localStorage.getItem('cart-line-design-temp-latest');
                      if (latestDesign && latestDesign.startsWith('http') && latestDesign !== displayImageUrl) {
                        console.log('♻️ [Checkout] Falling back to latest design from localStorage');
                        imgElement.src = latestDesign;
                        return;
                      }
                    } catch (e) {
                      console.error('[Checkout] Error accessing localStorage during fallback', e);
                    }

                    // Finally fall back to product image as last resort
                    if (merchandise?.image?.url && merchandise.image.url !== displayImageUrl) {
                      console.log('♻️ [Checkout] Falling back to product image');
                      imgElement.src = merchandise.image.url;
                    } else {
                      // Hide the image on error if no fallback is available
                      console.log('❌ [Checkout] No fallback image available, hiding image');
                      imgElement.style.display = 'none';
                    }
                  }}
                  onLoad={() => {
                    console.log('✅ [Checkout] Custom design image loaded successfully');
                  }}
                />
              </div>
            ) : merchandise.image ? (
              // Standard Shopify product image object
              <Image
                data={merchandise.image}
                sizes="80px"
                className="w-full h-full object-cover"
                alt={merchandise.product.title}
              />
            ) : (
              // Fallback
              <div className="w-full h-full flex items-center justify-center text-xs" style={{color: 'var(--color-stone)'}}>
                {isCustomDesign ? 'Custom' : 'No Image'}
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs" style={{color: 'var(--color-stone)'}}>
              No Image
            </div>
          )}

          {/* Custom design indicator removed as requested */}
        </div>

        {/* Custom design status badge removed as requested */}
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="font-semibold text-lg" style={{color: 'var(--color-charcoal)'}}>
          {merchandise.product.title}
        </h3>
        {merchandise.title && merchandise.title !== 'Default Title' && (
          <p className="text-sm" style={{color: 'var(--color-stone)'}}>{merchandise.title}</p>
        )}

        {/* Custom design attributes - user-friendly display */}
        {isCustomDesign && attributes && (
          <div className="mt-2 space-y-1">
            {attributes
              .filter((attr) => !attr.key.startsWith('_')) // Only show non-hidden attributes
              .map((attr) => (
                <div key={attr.key} className="text-xs" style={{color: 'var(--color-stone)'}}>
                  <span className="font-medium">{attr.key}:</span> {attr.value}
                </div>
              ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm" style={{color: 'var(--color-stone)'}}>Quantity: {quantity}</div>
          <div className="font-bold" style={{color: 'var(--color-charcoal)'}}>
            <FormattedMoney data={merchandise.price} />
          </div>
        </div>
      </div>
    </div>
  );
}

const CART_QUERY = `#graphql
  query Cart($cartId: ID!, $numCartLines: Int!) {
    cart(id: $cartId) {
      ...CartApiQuery
    }
  }
  ${CART_QUERY_FRAGMENT}
` as const;

/**
 * Custom checkout page that displays custom design images properly
 * and provides a clean review experience before payment
 */
export default function Checkout() {
  const { cart, checkoutDomain } = useLoaderData<LoaderData>();
  const config = useConfig();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreparingOrder, setIsPreparingOrder] = useState(false);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [checkoutReady, setCheckoutReady] = useState(false);
  // Add state for customized designs
  const [customizedDesigns, setCustomizedDesigns] = useState<string[]>([]);

  // Check if any items have custom designs
  const hasCustomDesigns = cart?.lines?.nodes?.some((line) =>
    line.attributes?.some(
      (attr) => attr.key === '_custom_design' && attr.value === 'true',
    ),
  ) || false;

  // Function to collect all customized design images from cart
  const collectCustomizedDesigns = useCallback(() => {
    if (!cart?.lines?.nodes) return [];
    
    const designs: string[] = [];
    
    cart.lines.nodes.forEach(line => {
      // Check for _design_image_url attribute
      const designUrl = line.attributes?.find(
        attr => attr.key === '_design_image_url' && attr.value?.startsWith('http')
      )?.value;
      
      // Check for _checkout_image or _checkout_display_image attribute
      const checkoutImage = line.attributes?.find(
        attr => (attr.key === '_checkout_image' || attr.key === '_checkout_display_image') && 
               attr.value?.startsWith('http')
      )?.value;

      // Check for _customized_image attribute
      const customizedImage = line.attributes?.find(
        attr => attr.key === '_customized_image' && attr.value?.startsWith('http')
      )?.value;

      // Check for array of all designed images
      const allDesignedImagesAttr = line.attributes?.find(
        attr => (attr.key === '_all_designed_images' || attr.key === '_all_design_images')
      )?.value;
      
      let allDesignedImages: string[] = [];
      if (allDesignedImagesAttr) {
        try {
          const parsed = JSON.parse(allDesignedImagesAttr);
          if (Array.isArray(parsed)) {
            allDesignedImages = parsed.filter((url): url is string => 
              typeof url === 'string' && url.startsWith('http')
            );
          }
        } catch (e) {
          console.error('[Checkout] Error parsing all_designed_images', e);
        }
      }
      
      // Try to get from localStorage as well
      let localDesign: string | null = null;
      try {
        const lineIdMatch = line.id?.match(/gid:\/\/shopify\/CartLine\/([^?]+)/);
        const lineId = lineIdMatch ? lineIdMatch[1] : null;
        if (lineId) {
          localDesign = localStorage.getItem(`cart-line-design-${lineId}`);
        }
      } catch (e) {
        console.error('[Checkout] Error reading from localStorage', e);
      }
      
      // Add all valid URLs to our designs array, ensuring uniqueness
      [designUrl, checkoutImage, customizedImage, localDesign, ...allDesignedImages]
        .filter((url): url is string => typeof url === 'string' && url.startsWith('http'))
        .forEach(url => {
          if (url && !designs.includes(url)) {
            designs.push(url);
          }
        });
    });
    
    return designs;
  }, [cart?.lines?.nodes]);

  // Effect to collect custom designs when cart changes
  useEffect(() => {
    if (hasCustomDesigns) {
      const designs = collectCustomizedDesigns();
      console.log(`🎨 [Checkout] Found ${designs.length} customized designs:`, designs);
      setCustomizedDesigns(designs);
    }
  }, [hasCustomDesigns, collectCustomizedDesigns, cart?.id]);

  // Function to prepare cart for checkout by ensuring all design images are uploaded
  const prepareCartForCheckout = useCallback(async () => {
    if (!cart?.id) return;

    setIsPreparingOrder(true);
    setPrepareError(null);

    try {
      console.log('🔄 Preparing cart for checkout...');
      const response = await fetch('/api/cart-prepare-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartId: cart.id }),
      });

      const result = await response.json() as {
        success: boolean;
        message?: string;
        error?: string;
        designCount?: number;
      };

      if (result.success) {
        console.log('✅ Cart prepared successfully with', result.designCount || 0, 'designs');
        setCheckoutReady(true);
        return true;
      } else {
        console.error('❌ Failed to prepare cart:', result.error);
        setPrepareError(result.error || 'Failed to prepare order');
        setCheckoutReady(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Error preparing cart for checkout:', error);
      setPrepareError('Network error preparing your order');
      setCheckoutReady(false);
      return false;
    } finally {
      setIsPreparingOrder(false);
    }
  }, [cart?.id]);

  // Initialize checkout preparation if cart has custom designs
  useEffect(() => {
    if (hasCustomDesigns && cart?.id && !isPreparingOrder && !checkoutReady && !prepareError) {
      prepareCartForCheckout();
    } else if (!hasCustomDesigns && cart?.id) {
      // If no custom designs, checkout is already ready
      setCheckoutReady(true);
    }
  }, [hasCustomDesigns, cart?.id, isPreparingOrder, checkoutReady, prepareError, prepareCartForCheckout]);

  const handleProceedToPayment = async () => {
    setIsProcessing(true);

    // If we have custom designs but they haven't been prepared yet, prepare them first
    if (hasCustomDesigns && !checkoutReady && !isPreparingOrder) {
      const success = await prepareCartForCheckout();
      if (!success) {
        setIsProcessing(false);
        return; // Don't proceed if preparation failed
      }
    }

    // Create checkout URL on the centralized domain or use Shopify's checkout
    if (cart.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen mt-20" style={{backgroundColor: 'var(--color-cream)'}}>
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 shadow-sm" style={{borderBottom: '1px solid var(--color-cream-dark)'}}>
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="flex items-center space-x-2"
                style={{color: 'var(--color-matcha-mid)'}}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Cart</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold" style={{color: 'var(--color-charcoal)'}}>
              {config.brandName} Checkout
            </h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-16 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Review - Left Side */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg p-6" style={{border: '1px solid var(--color-cream-dark)'}}>
              <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--color-charcoal)'}}>
                Order Review
              </h2>

              {/* Line Items */}
              <div className="space-y-4 mb-6">
                {cart?.lines?.nodes?.map((line) => (
                  <CheckoutLineItem key={line.id} line={line} />
                )) || []}
              </div>

              {/* Customized Designs */}
              {customizedDesigns.length > 0 && (
                <div className="pt-6 mb-6" style={{borderTop: '1px solid var(--color-cream-dark)'}}>
                  <h3 className="font-semibold mb-4" style={{color: 'var(--color-charcoal)'}}>
                    All Customized Designs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {customizedDesigns.map((designUrl, index) => (
                      <div key={index} className="relative overflow-hidden rounded-lg aspect-square" style={{backgroundColor: 'var(--color-cream-warm)'}}>
                        <img
                          src={designUrl}
                          alt={`Custom Design ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.error('Failed to load design image:', designUrl);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Features */}
              <div className="pt-6" style={{borderTop: '1px solid var(--color-cream-dark)'}}>
                <h3 className="font-semibold mb-4 flex items-center" style={{color: 'var(--color-charcoal)'}}>
                  <Shield className="w-5 h-5 mr-2" style={{color: 'var(--color-matcha-mid)'}} />
                  Customized Designs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customizedDesigns.map((design, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm" style={{color: 'var(--color-stone)'}}>
                      <span>{design.substring(0, 50)}...</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6" style={{borderTop: '1px solid var(--color-cream-dark)'}}>
                <h3 className="font-semibold mb-4 flex items-center" style={{color: 'var(--color-charcoal)'}}>
                  <Shield className="w-5 h-5 mr-2" style={{color: 'var(--color-matcha-mid)'}} />
                  Secure Checkout Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-sm" style={{color: 'var(--color-stone)'}}>
                    <CreditCard className="w-4 h-4" style={{color: 'var(--color-matcha-mid)'}} />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm" style={{color: 'var(--color-stone)'}}>
                    <Truck className="w-4 h-4" style={{color: 'var(--color-matcha-mid)'}} />
                    <span>Fast, reliable shipping</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm" style={{color: 'var(--color-stone)'}}>
                    <Shield className="w-4 h-4" style={{color: 'var(--color-matcha-mid)'}} />
                    <span>SSL encrypted transaction</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm" style={{color: 'var(--color-stone)'}}>
                    <ExternalLink className="w-4 h-4" style={{color: 'var(--color-matcha-mid)'}} />
                    <span>Shopify secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Payment - Right Side */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg p-6 sticky top-28" style={{border: '1px solid var(--color-cream-dark)'}}>
              <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--color-charcoal)'}}>
                Order Summary
              </h2>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span style={{color: 'var(--color-stone)'}}>
                    Subtotal ({cart?.totalQuantity || 0} item
                    {(cart?.totalQuantity || 0) !== 1 ? 's' : ''})
                  </span>
                  <span className="font-medium" style={{color: 'var(--color-charcoal)'}}>
                    {cart.cost?.subtotalAmount ? (
                      <FormattedMoney data={cart.cost.subtotalAmount} />
                    ) : (
                      '-'
                    )}
                  </span>
                </div>

                {cart.cost?.totalTaxAmount?.amount && (
                  <div className="flex justify-between items-center">
                    <span style={{color: 'var(--color-stone)'}}>Tax (estimated)</span>
                    <span className="font-medium" style={{color: 'var(--color-charcoal)'}}>
                      <FormattedMoney data={cart.cost.totalTaxAmount} />
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span style={{color: 'var(--color-stone)'}}>Shipping</span>
                  <span className="text-sm" style={{color: 'var(--color-stone)'}}>
                    Calculated at checkout
                  </span>
                </div>

                <div className="pt-4" style={{borderTop: '1px solid var(--color-cream-dark)'}}>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold" style={{color: 'var(--color-charcoal)'}}>Total</span>
                    <span className="font-bold text-xl" style={{color: 'var(--color-matcha-mid)'}}>
                      {cart.cost?.totalAmount ? (
                        <FormattedMoney data={cart.cost.totalAmount} />
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loading indicator only if designs are being prepared */}
              {isPreparingOrder && (
                <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <div className="flex items-center justify-center text-blue-200 text-sm">
                    <div className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mr-2"></div>
                    Preparing your order...
                  </div>
                </div>
              )}

              {/* Error message */}
              {prepareError && (
                <div className="mb-6 p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 mt-0.5">⚠️</div>
                    <div>
                      <h4 className="text-red-300 font-semibold text-sm mb-1">
                        Error Preparing Designs
                      </h4>
                      <p className="text-red-200 text-xs">
                        {prepareError} Please try again or contact customer support.
                      </p>
                      <button
                        onClick={() => prepareCartForCheckout()}
                        className="mt-2 text-xs text-white bg-red-600/30 hover:bg-red-600/50 px-3 py-1 rounded-full"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Proceed to Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center space-x-2"
                style={{backgroundColor: 'var(--color-matcha-mid)'}}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                    <span>Redirecting...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Proceed to Secure Payment</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs" style={{color: 'var(--color-stone)'}}>
                  You'll be securely redirected to Shopify's payment processor
                </p>
              </div>

              {/* Alternative Actions */}
              <div className="mt-6 pt-6" style={{borderTop: '1px solid var(--color-cream-dark)'}}>
                <div className="space-y-3">
                  <Link
                    to="/cart"
                    className="block w-full text-center py-3 px-4 rounded-lg transition-colors"
                    style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)', color: 'var(--color-charcoal)'}}
                  >
                    Back to Cart
                  </Link>
                  <Link
                    to="/collections"
                    className="block w-full text-center py-2 text-sm"
                    style={{color: 'var(--color-matcha-mid)'}}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
