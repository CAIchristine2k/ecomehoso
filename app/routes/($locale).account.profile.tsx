import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from 'react-router';
import {User, Save, AlertCircle, CheckCircle} from 'lucide-react';
import {useConfig} from '~/utils/themeContext';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  const config = useConfig();
  return [{title: `${config.brandName} | Profile`}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(CUSTOMER_UPDATE, {
      variables: {
        customer,
      },
    });

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (data?.customerUpdate?.userErrors?.length) {
      throw new Error(data.customerUpdate.userErrors[0].message);
    }

    // Refetch customer data after update
    const {data: customerData} = await customerAccount.query(
      `query GetUpdatedCustomer {
        customer {
          id
          firstName
          lastName
        }
      }`,
    );

    return {
      error: null,
      customer: customerData?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;
  const config = useConfig();

  return (
    <div className="rounded-sm p-8" style={{backgroundColor: 'white', border: '1px solid var(--color-cream-dark)'}}>
      {/* Header */}
      <div className="flex items-center mb-8">
        <User className="w-6 h-6 mr-3" style={{color: 'var(--color-matcha-mid)'}} />
        <h2 className="text-2xl font-bold" style={{color: 'var(--color-charcoal)'}}>Personal Information</h2>
      </div>

      {/* Success Message */}
      {action?.customer && !action?.error && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-700">Profile updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {action?.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-700">{action.error}</span>
        </div>
      )}

      {/* Form */}
      <Form method="PUT" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-bold mb-2"
              style={{color: 'var(--color-matcha-mid)'}}
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Enter your first name"
              aria-label="First name"
              defaultValue={customer.firstName ?? ''}
              minLength={2}
              required
              className="w-full rounded-sm py-3 px-4 focus:outline-none focus:ring-1 transition-colors duration-300"
              style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)', color: 'var(--color-charcoal)'}}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-bold mb-2"
              style={{color: 'var(--color-matcha-mid)'}}
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Enter your last name"
              aria-label="Last name"
              defaultValue={customer.lastName ?? ''}
              minLength={2}
              required
              className="w-full rounded-sm py-3 px-4 focus:outline-none focus:ring-1 transition-colors duration-300"
              style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)', color: 'var(--color-charcoal)'}}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={state !== 'idle'}
            className="inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-sm transition-all duration-300 uppercase tracking-wider"
            style={{backgroundColor: 'var(--color-matcha-mid)'}}
          >
            <Save className="w-4 h-4 mr-2" />
            {state !== 'idle' ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </Form>

      {/* Championship Note */}
      <div className="mt-8 p-4 rounded-sm" style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)'}}>
        <p className="text-sm leading-relaxed" style={{color: 'var(--color-stone)'}}>
          Keep your profile updated to ensure you receive the latest news about{' '}
          {config.brandName}'s championship collection and exclusive offers.
        </p>
      </div>
    </div>
  );
}
