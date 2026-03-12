import React from 'react';
import {useLoaderData, Link, Form} from 'react-router';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  MetaFunction,
  HeadersFunction,
  data,
  redirect,
} from 'react-router';
import {useConfig} from '~/utils/themeContext';
import {ArrowRight} from 'lucide-react';
import {Resend} from 'resend';

export const meta: MetaFunction = () => {
  return [{title: 'Contact'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  // Get success parameter from the URL
  const url = new URL(request.url);
  const success = url.searchParams.get('success') === 'true';

  return {
    success,
  };
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get('name')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const subject = formData.get('subject')?.toString() || '';
  const message = formData.get('message')?.toString() || '';

  // Validate the form data
  const errors: Record<string, string> = {};

  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  if (email && !/^\S+@\S+\.\S+$/.test(email))
    errors.email = 'Invalid email format';
  if (!message) errors.message = 'Message is required';

  if (Object.keys(errors).length > 0) {
    return data(
      {errors, formData: Object.fromEntries(formData)},
      {status: 400},
    );
  }

  // Get store information
  const storeUrl = request.url ? new URL(request.url).origin : 'Unknown';
  // Import config to get store name
  const {getConfig} = await import('~/utils/config');
  const config = getConfig();
  const storeName = config.brandName || 'Shopify Store';

  try {
    // Access the RESEND_API_KEY from environment variables
    const env = context.env as Record<string, any>;
    const resendApiKey = env['RESEND_API_KEY'];

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is missing in environment variables');
      throw new Error('Email service configuration is missing');
    }

    // Initialize Resend with API key
    const resend = new Resend(resendApiKey);

    // Create HTML for the email
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Store Name:</strong> ${storeName}</p>
      <p><strong>Store URL:</strong> ${storeUrl}</p>
      <hr>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'support@xavvi.com',
      subject: `Contact Form: ${storeName} - ${subject || 'New Message'}`,
      html: htmlContent,
    });

    console.log('Resend email response:', emailResponse);

    // Redirect to success page
    return redirect('/pages/contact?success=true');
  } catch (error) {
    console.error('Failed to send email:', error);
    return data(
      {
        errors: {
          form: 'Failed to send your message. Please try again later.',
        },
        formData: Object.fromEntries(formData),
      },
      {status: 500},
    );
  }
}

export default function Contact() {
  const {success} = useLoaderData<typeof loader>();
  const config = useConfig();

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--color-cream)', color: 'var(--color-charcoal)'}}>
      <div
        className="container mx-auto px-4 py-16"
        style={{
          paddingTop: 'calc(var(--header-height-desktop) + 3rem)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8" style={{border: '1px solid var(--color-cream-dark)'}}>
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--color-charcoal)'}}>
                  Message Sent!
                </h2>
                <p className="mb-6" style={{color: 'var(--color-stone)'}}>
                  Thank you for reaching out. We've received your message and
                  will get back to you as soon as possible.
                </p>
                <Link
                  to="/collections/all"
                  className="inline-flex items-center font-bold py-3 px-6 rounded-sm transition-all duration-300 text-white"
                  style={{backgroundColor: 'var(--color-matcha-mid)'}}
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center" style={{color: 'var(--color-charcoal)'}}>
                  Contact Us
                </h2>

                <Form method="post" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block font-medium text-sm mb-2" style={{color: 'var(--color-stone)'}}
                      >
                        Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all duration-200"
                        style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)', color: 'var(--color-charcoal)'}}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-medium text-sm mb-2" style={{color: 'var(--color-stone)'}}
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all duration-200"
                        style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)', color: 'var(--color-charcoal)'}}
                        placeholder="Your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block font-medium text-sm mb-2" style={{color: 'var(--color-stone)'}}
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all duration-200"
                      style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)', color: 'var(--color-charcoal)'}}
                      placeholder="Message subject"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block font-medium text-sm mb-2" style={{color: 'var(--color-stone)'}}
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 resize-none"
                      style={{backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-cream-dark)', color: 'var(--color-charcoal)'}}
                      placeholder="Your message"
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="font-bold py-3 px-8 rounded-lg transition-all duration-200 inline-flex items-center text-white"
                      style={{backgroundColor: 'var(--color-matcha-mid)'}}
                    >
                      Send Message
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
