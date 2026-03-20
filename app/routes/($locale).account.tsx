import {type LoaderFunctionArgs} from 'react-router';
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  Link,
  type MetaFunction,
} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {ArrowLeft, User, Package, MapPin, LogOut} from 'lucide-react';
import {getConfig} from '~/utils/config';

export const meta: MetaFunction = () => {
  const config = getConfig();
  return [
    {title: `Mon Compte | ${config.brandName}`},
    {name: 'robots', content: 'noindex, nofollow'},
  ];
};

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const heading = 'Account';

  // Fetch the customer information
  const response = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);
  const customer = response.data?.customer;

  // Get configuration
  const config = getConfig();

  return {
    customer,
    heading,
    config: {
      ...config,
      theme: config.influencerName.toLowerCase().replace(/\s+/g, '-'),
    },
  };
}

export default function AccountLayout() {
  const {customer, heading, config} = useLoaderData<typeof loader>();

  return (
    <div data-theme={config.theme} className="min-h-screen" style={{backgroundColor: 'var(--color-cream)', color: 'var(--color-charcoal)'}}>
      <div className="container mx-auto px-4 py-24">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center transition-colors duration-300"
            style={{color: 'var(--color-matcha-mid)'}}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Account Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 text-sm font-bold tracking-wider uppercase mb-4 rounded-sm" style={{backgroundColor: 'color-mix(in srgb, var(--color-matcha-mid) 15%, transparent)', color: 'var(--color-matcha-mid)'}}>
            My Account
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--color-stone)'}}>
            Manage your account, view orders, and update your information.
          </p>
        </div>

        {/* Account Navigation */}
        <div className="mb-12">
          <AccountMenu />
        </div>

        {/* Account Content */}
        <div className="max-w-4xl mx-auto">
          <Outlet context={{customer}} />
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  function getNavLinkClass({isActive}: {isActive: boolean}) {
    return `flex items-center px-4 py-2 rounded-sm transition-colors duration-300 ${
      isActive
        ? 'font-bold'
        : ''
    }`;
  }

  function getNavLinkStyle({isActive}: {isActive: boolean}) {
    return isActive
      ? {backgroundColor: 'var(--color-matcha-mid)', color: '#fff'}
      : {backgroundColor: 'white', color: 'var(--color-charcoal)', border: '1px solid var(--color-cream-dark)'};
  }

  return (
    <nav className="flex flex-wrap justify-center gap-4">
      <NavLink to="/account/orders" className={getNavLinkClass} style={getNavLinkStyle}>
        <Package className="w-4 h-4" />
        <span>Orders</span>
      </NavLink>

      <NavLink to="/account/profile" className={getNavLinkClass} style={getNavLinkStyle}>
        <User className="w-4 h-4" />
        <span>Profile</span>
      </NavLink>

      <NavLink to="/account/addresses" className={getNavLinkClass} style={getNavLinkStyle}>
        <MapPin className="w-4 h-4" />
        <span>Addresses</span>
      </NavLink>

      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form action="/account/logout" method="POST" className="flex">
      <button
        type="submit"
        className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-sm transition-colors duration-300"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    </Form>
  );
}
