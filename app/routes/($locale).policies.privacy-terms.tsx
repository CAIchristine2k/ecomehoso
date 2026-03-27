import {
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from 'react-router';
import {useConfig} from '~/utils/themeContext';

export const meta: MetaFunction = () => {
  return [
    {title: 'Privacy Policy & Terms | Xavvi'},
    {
      name: 'description',
      content: 'Privacy policy and terms of service for Xavvi.',
    },
  ];
};

export default function PrivacyTerms() {
  const config = useConfig();

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="pt-32 pb-20 mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
          Privacy Policy & Terms
        </h1>

        <div className="space-y-16">
          {/* Privacy Policy */}
          <section className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Privacy Policy
            </h2>

            <div className="prose prose-invert prose-headings:text-primary prose-a:text-primary">
              <p className="text-sm text-gray-400 mb-6">
                Effective Date: Jun 3, 2025
              </p>

              <p>
                This Privacy Policy is issued by <strong>"the Company,"</strong>{' '}
                which refers to the legal entity that owns and operates this
                website and its services. By using this website, you consent to
                the practices described herein.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                1. Information We Collect
              </h3>
              <p>We may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Personal Information:</strong> Name, email, phone
                  number, address, payment info.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device identifiers, access times.
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, time on site,
                  click behavior, and interactions.
                </li>
                <li>
                  <strong>Cookies & Tracking:</strong> Behavioral and analytical
                  tracking via third-party tools.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                2. How We Use Information
              </h3>
              <p>The Company may use your information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide and improve our services.</li>
                <li>
                  Personalize your experience and deliver targeted content or
                  promotions.
                </li>
                <li>Manage payments, subscriptions, and transactions.</li>
                <li>Comply with applicable laws and enforce our policies.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                3. Data Sharing
              </h3>
              <p>Your data may be shared with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Service providers and business partners.</li>
                <li>
                  Payment processors, logistics platforms, and cloud hosts.
                </li>
                <li>Authorities if legally obligated.</li>
              </ul>
              <p>
                The Company reserves the right to use, license, or monetize
                anonymized or aggregated user data.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                4. Data Retention
              </h3>
              <p>
                Data is retained as long as necessary for business, legal, or
                security purposes—even after service termination.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                5. Your Rights
              </h3>
              <p>
                You may request to review, modify, or delete your personal data
                by contacting us at{' '}
                <a href="mailto:contact@xavvi.com">contact@xavvi.com</a>. The
                Company may deny requests for legitimate operational or legal
                reasons.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">6. Security</h3>
              <p>
                We implement standard security measures. However, no system is
                100% secure, and use of this site is at your own risk.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                7. International Use
              </h3>
              <p>
                Users outside the United States consent to their data being
                processed in and subject to the laws of the U.S.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                8. Changes to This Policy
              </h3>
              <p>
                We may update this policy at any time. Continued use of our
                services after changes implies acceptance.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">9. Contact</h3>
              <p>
                Questions? Email us at{' '}
                <a href="mailto:hosomatchagroup@gmail.com">hosomatchagroup@gmail.com</a> (contact matcha)
                {' '}or{' '}
                <a href="mailto:Hosobasqueparis04@gmail.com">Hosobasqueparis04@gmail.com</a> (contact magasin).
              </p>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Terms of Service
            </h2>

            <div className="prose prose-invert prose-headings:text-primary prose-a:text-primary">
              <p className="text-sm text-gray-400 mb-6">
                Effective Date: Jun 3, 2025
              </p>

              <p>
                This document sets the rules for using the services provided by{' '}
                <strong>the Company</strong>, the legal entity operating this
                website. By using the site, you agree to the following terms.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                1. Acceptance of Terms
              </h3>
              <p>
                Use of this site constitutes full agreement with these Terms. If
                you disagree, discontinue use immediately.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                2. Eligibility
              </h3>
              <p>
                You must be at least 13 years old (or 16 in the EU) to use our
                services.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                3. Intellectual Property
              </h3>
              <p>
                All content, branding, and underlying technology are the
                property of the Company. You may not reproduce, modify, or
                redistribute anything without written permission.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                4. User Conduct
              </h3>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Violate laws or third-party rights.</li>
                <li>
                  Use the service for unlawful, abusive, or exploitative
                  behavior.
                </li>
                <li>
                  Attempt to disrupt, reverse-engineer, or misuse the platform.
                </li>
              </ul>
              <p>
                The Company reserves the right to suspend or terminate accounts
                at its sole discretion.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                5. Transactions & Refunds
              </h3>
              <p>
                All purchases are final unless otherwise stated. The Company may
                refuse refunds for any reason.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                6. Limitation of Liability
              </h3>
              <p>
                Services are provided "as is." The Company is not liable for:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Direct or indirect damages.</li>
                <li>Loss of data or profits.</li>
                <li>Interruptions, errors, or unauthorized access.</li>
              </ul>
              <p>Use of the service is at your own risk.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                7. Indemnification
              </h3>
              <p>
                You agree to indemnify and hold harmless the Company against any
                claims, damages, or costs resulting from your use of the service
                or violation of these terms.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                8. Governing Law
              </h3>
              <p>
                These Terms are governed by the laws of the State of California,
                or the jurisdiction in which the Company is headquartered.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                9. Modifications
              </h3>
              <p>
                We may update these Terms at any time. Continued use of the
                service constitutes acceptance.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">10. Contact</h3>
              <p>
                For legal or general inquiries, email us at{' '}
                <a href="mailto:hosomatchagroup@gmail.com">hosomatchagroup@gmail.com</a> (contact matcha)
                {' '}or{' '}
                <a href="mailto:Hosobasqueparis04@gmail.com">Hosobasqueparis04@gmail.com</a> (contact magasin).
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
