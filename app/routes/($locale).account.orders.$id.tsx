import {redirect, type LoaderFunctionArgs} from 'react-router';
import {useLoaderData, type MetaFunction} from 'react-router';
import {Image, flattenConnection} from '@shopify/hydrogen';
import {FormattedMoney} from '~/components/FormattedMoney';
import type {OrderLineItemFullFragment} from 'customer-accountapi.generated';
// import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
const CUSTOMER_ORDER_QUERY = `#graphql
  query CustomerOrder($orderId: ID!, $customerAccessToken: String!) {
    node(id: $orderId) {
      ... on Order {
        id
        name
        processedAt
        financialStatus
        statusUrl
        totalPrice {
          amount
          currencyCode
        }
        originalTotalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        fulfillmentStatus
        discountApplications(first: 100) {
          nodes {
            value {
              __typename
              ... on MoneyV2 {
                amount
                currencyCode
              }
              ... on PricingPercentageValue {
                percentage
              }
            }
          }
        }
        shippingAddress {
          name
          formatted(withName: true)
          formattedArea
        }
        lineItems(first: 100) {
          nodes {
            title
            quantity
            variant {
              title
              price {
                amount
                currencyCode
              }
              image {
                altText
                height
                url
                id
                width
              }
            }
            discountAllocations {
              allocatedAmount {
                amount
                currencyCode
              }
              discountApplication {
                value {
                  __typename
                  ... on MoneyV2 {
                    amount
                    currencyCode
                  }
                  ... on PricingPercentageValue {
                    percentage
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
import {getConfig} from '~/utils/config';
import {Link} from 'react-router';
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const config = getConfig();
  return [{title: `${config.brandName} | Order ${data?.order?.name ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);

  // Get customer access token
  const customerAccessToken = await context.customerAccount.getAccessToken();
  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDER_QUERY,
    {
      variables: {
        orderId,
        customerAccessToken,
      },
    },
  );

  if (errors?.length || !data?.node) {
    throw new Error('Order not found');
  }

  const order = data.node;

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);

  const fulfillmentStatus =
    (flattenConnection(order.fulfillments)[0] as any)?.status ?? 'N/A';

  const firstDiscount = (discountApplications[0] as any)?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  // Get configuration
  const config = getConfig();

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
    config: {
      ...config,
      theme: config.influencerName.toLowerCase().replace(/\s+/g, '-'),
    },
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
    config,
  } = useLoaderData<typeof loader>();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'fulfilled':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'pending':
      case 'unfulfilled':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'cancelled':
      case 'refunded':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  return (
    <div data-theme={config.theme} className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/account/orders"
            className="inline-flex items-center text-gold-500 hover:text-gold-400 transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        {/* Order Header */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Package className="w-6 h-6 text-gold-500 mr-3" />
                <h1 className="text-3xl font-bold text-white">
                  Order #{order.name}
                </h1>
              </div>
              <p className="text-gray-400">
                Placed on {new Date(order.processedAt!).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Total</div>
                <FormattedMoney
                  data={order.totalPrice!}
                  className="text-2xl font-bold text-gold-500"
                />
              </div>

              <span
                className={`px-3 py-1 rounded-sm text-sm font-bold border ${getStatusColor(fulfillmentStatus)}`}
              >
                {fulfillmentStatus}
              </span>
            </div>
          </div>

          <a
            target="_blank"
            href={order.statusUrl}
            rel="noreferrer"
            className="inline-flex items-center text-gold-500 hover:text-gold-400 transition-colors duration-300"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Order Status
          </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-sm p-8">
              <h2 className="text-xl font-bold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {lineItems.map((lineItem, lineItemIndex) => (
                  <OrderLineRow
                    key={lineItemIndex}
                    lineItem={lineItem as any}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Shipping */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-sm p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gold-500" />
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <FormattedMoney data={order.subtotal!} />
                </div>

                {((discountValue && discountValue.amount) ||
                  discountPercentage) && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>
                      {discountPercentage
                        ? `-${discountPercentage}% OFF`
                        : discountValue && <FormattedMoney data={discountValue!} />}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <FormattedMoney data={order.totalTax!} />
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between font-bold text-gold-500 text-lg">
                    <span>Total</span>
                    <FormattedMoney data={order.totalPrice!} />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-sm p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gold-500" />
                Shipping Address
              </h3>

              {order?.shippingAddress ? (
                <address className="text-gray-300 not-italic leading-relaxed">
                  <div className="font-medium text-white mb-2">
                    {order.shippingAddress.name}
                  </div>
                  {order.shippingAddress.formatted && (
                    <div className="mb-1">
                      {order.shippingAddress.formatted}
                    </div>
                  )}
                  {order.shippingAddress.formattedArea && (
                    <div>{order.shippingAddress.formattedArea}</div>
                  )}
                </address>
              ) : (
                <p className="text-gray-400">No shipping address defined</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800 rounded-md">
      <div className="flex items-center col-span-2">
        {lineItem?.image && (
          <div className="mr-4">
            <Image
              data={lineItem.image}
              width={96}
              height={96}
              className="rounded-md"
            />
          </div>
        )}
        <div>
          <p className="text-white font-medium">{lineItem.title}</p>
          <p className="text-gray-400 text-sm">{lineItem.variantTitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">Price</p>
        <FormattedMoney data={lineItem.price!} className="text-white font-medium" />
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">Quantity</p>
        <span className="text-white font-medium">{lineItem.quantity}</span>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">Total</p>
        <FormattedMoney
          data={lineItem.totalDiscount!}
          className="text-white font-medium"
        />
      </div>
    </div>
  );
}
