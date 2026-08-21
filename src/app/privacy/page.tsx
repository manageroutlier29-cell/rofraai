import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | ROFRAAI",
  description: "Privacy Policy explaining how ROFRAAI collects and uses information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#06101d] text-gray-200">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
          ← Back to ROFRAAI
        </Link>

        <header className="mb-12 mt-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: August 21, 2026
          </p>
        </header>

        <div className="space-y-10 leading-7 text-gray-300">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">1. Information We Collect</h2>
            <p>
              ROFRAAI may collect information you provide when creating or
              managing an account, including your name, email address, profile
              information, skills, payment-account information, and information
              submitted while using marketplace features.
            </p>
            <p className="mt-4">
              We may also collect information about your use of the platform,
              including tasks, submissions, reviews, account activity,
              transactions, withdrawals, and related technical information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">2. How We Use Information</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>create and manage user accounts;</li>
              <li>operate the marketplace and match workers with tasks;</li>
              <li>process submissions and reviews;</li>
              <li>calculate and record eligible earnings;</li>
              <li>process payments and withdrawals;</li>
              <li>prevent fraud, abuse, and unauthorized activity;</li>
              <li>provide customer support;</li>
              <li>maintain and improve the platform;</li>
              <li>comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">3. Payment Information</h2>
            <p>
              ROFRAAI may store payment-account details necessary to process
              eligible worker withdrawals. Payment processing may involve
              third-party providers.
            </p>
            <p className="mt-4">
              ROFRAAI does not request or intentionally store your M-Pesa PIN,
              banking password, card PIN, or other confidential authentication
              credentials.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">4. Third-Party Services</h2>
            <p>
              We may use third-party services for payment processing, hosting,
              authentication, analytics, communications, security, and other
              operational purposes. Those providers may process information
              according to their own policies and applicable agreements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">5. Information Sharing</h2>
            <p>
              We do not sell personal information as a business model. We may
              share information when necessary to operate ROFRAAI, process
              payments, provide services, protect users and the platform,
              prevent fraud, or comply with legal requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">6. Worker Profiles</h2>
            <p>
              Depending on platform settings, worker profile information such
              as name, skills, experience, biography, or other professional
              information may be visible to clients or other authorized users.
            </p>
            <p className="mt-4">
              Workers should avoid publishing sensitive personal information
              that is not required for their professional profile.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">7. Data Security</h2>
            <p>
              We use reasonable technical and organizational measures designed
              to protect information against unauthorized access, alteration,
              disclosure, or destruction. No internet-based service can
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">8. Data Retention</h2>
            <p>
              We retain information for as long as reasonably necessary to
              operate the service, maintain financial and transaction records,
              resolve disputes, prevent fraud, enforce agreements, and comply
              with applicable legal requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">9. Your Choices</h2>
            <p>
              Depending on the information and applicable law, you may have
              rights to access, correct, update, or request deletion of certain
              personal information.
            </p>
            <p className="mt-4">
              Some information may need to be retained for legal, security,
              accounting, fraud-prevention, or transaction-record purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">10. Cookies</h2>
            <p>
              ROFRAAI may use cookies or similar technologies required for
              authentication, security, preferences, and platform functionality.
              See our{" "}
              <Link href="/cookies" className="text-cyan-400 hover:text-cyan-300">
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">11. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or your personal
              information, contact ROFRAAI through the contact information
              provided on the platform.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <p>
              By using ROFRAAI, you acknowledge that you have read this Privacy
              Policy and understand how information may be processed.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
