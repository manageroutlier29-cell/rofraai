import Link from "next/link";

export const metadata = {
  title: "Terms of Service | ROFRAAI",
  description:
    "Terms of Service governing the use of the ROFRAAI marketplace.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#06101d] text-gray-200">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            ← Back to ROFRAAI
          </Link>
        </div>

        <header className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Legal
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: August 21, 2026
          </p>
        </header>

        <div className="space-y-10 leading-7 text-gray-300">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              1. About ROFRAAI
            </h2>

            <p>
              ROFRAAI is an online marketplace that connects clients with
              workers and facilitates digital projects, tasks, submissions,
              reviews, and eligible earnings through the platform.
            </p>

            <p className="mt-4">
              ROFRAAI may provide different features to clients,
              administrators, and workers. Features, task availability,
              payment methods, fees, and eligibility requirements may change
              from time to time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              2. Acceptance of These Terms
            </h2>

            <p>
              By creating an account, accessing ROFRAAI, or using any ROFRAAI
              service, you agree to these Terms of Service and our{" "}
              <Link
                href="/privacy"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <p className="mt-4">
              If you do not agree with these terms, you must not create an
              account or use the platform.
            </p>

            <p className="mt-4">
              You are responsible for providing accurate information and for
              keeping your account credentials secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              3. Eligibility and Accounts
            </h2>

            <p>
              You must provide truthful, current, and complete information
              when creating and maintaining your account.
            </p>

            <p className="mt-4">
              You may not create an account using another person&apos;s identity,
              impersonate another person, or maintain multiple accounts for
              the purpose of manipulating the marketplace.
            </p>

            <p className="mt-4">
              You are responsible for activity performed through your account.
              Notify ROFRAAI promptly if you believe your account has been
              accessed without authorization.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              4. Marketplace Tasks and Projects
            </h2>

            <p>
              Clients may create projects and tasks through the marketplace.
              Workers may browse, claim, accept, perform, and submit eligible
              tasks according to the requirements displayed on the platform.
            </p>

            <p className="mt-4">
              A task may have specific instructions, eligibility requirements,
              deadlines, quality standards, and payment conditions. Workers
              are responsible for reviewing those requirements before
              accepting or performing a task.
            </p>

            <p className="mt-4">
              The availability of tasks is not guaranteed. ROFRAAI does not
              guarantee that a particular worker will receive a particular
              number of tasks, projects, assignments, or earnings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              5. Work Submissions and Reviews
            </h2>

            <p>
              Workers must submit work that they have actually completed and
              that complies with the applicable task instructions.
            </p>

            <p className="mt-4">
              ROFRAAI or authorized reviewers may review submitted work for
              quality, completeness, accuracy, compliance, or other applicable
              requirements.
            </p>

            <p className="mt-4">
              Submission of work does not automatically create a right to
              payment. Earnings become eligible according to the applicable
              review and approval process.
            </p>

            <p className="mt-4">
              ROFRAAI may reject submissions that do not meet applicable
              requirements or that appear fraudulent, duplicated,
              manipulated, incomplete, or otherwise non-compliant.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              6. Earnings and Withdrawals
            </h2>

            <p>
              Eligible worker earnings are recorded through the ROFRAAI
              platform. Available balances, pending balances, and paid amounts
              may be displayed separately depending on the status of work and
              payment processing.
            </p>

            <p className="mt-4">
              A withdrawal request is subject to the applicable minimum
              withdrawal amount, payment-account requirements, review
              procedures, processing times, and other platform rules.
            </p>

            <p className="mt-4">
              Payment processing may involve third-party payment providers.
              Processing delays, rejected transactions, provider outages,
              incorrect payment details, or other circumstances outside
              ROFRAAI&apos;s direct control may affect the timing of a payment.
            </p>

            <p className="mt-4">
              ROFRAAI does not guarantee a particular payment-processing time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              7. Marketplace Access Fees
            </h2>

            <p>
              ROFRAAI may offer certain marketplace features subject to an
              access fee. Where an access fee applies, the amount and payment
              currency will be displayed before payment is initiated.
            </p>

            <p className="mt-4">
              A payment request may be processed through a third-party
              payment provider. Access should only be considered unlocked
              after the payment has been successfully confirmed by the
              applicable payment system.
            </p>

            <p className="mt-4">
              Information about refunds, failed payments, cancellations, and
              payment-related disputes is provided in our{" "}
              <Link
                href="/refunds"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Payments, Refunds & Cancellation Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              8. Payment Information
            </h2>

            <p>
              Workers may provide payment-account information so that eligible
              earnings can be paid to them.
            </p>

            <p className="mt-4">
              You are responsible for ensuring that payment details you
              provide are accurate and belong to you or that you are
              authorized to use them.
            </p>

            <p className="mt-4">
              ROFRAAI will not ask you to provide your M-Pesa PIN, banking
              password, card PIN, or other confidential authentication
              credentials through the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              9. Prohibited Conduct
            </h2>

            <p>You must not use ROFRAAI to:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>commit fraud or deceive other users;</li>
              <li>submit fabricated or materially misleading work;</li>
              <li>create duplicate accounts to manipulate the platform;</li>
              <li>attempt to obtain earnings for work that was not performed;</li>
              <li>manipulate task, review, payment, or referral systems;</li>
              <li>interfere with the operation or security of the platform;</li>
              <li>upload malicious software or harmful content;</li>
              <li>access accounts or information without authorization;</li>
              <li>harass, threaten, or abuse other users; or</li>
              <li>use ROFRAAI for unlawful purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              10. Account Suspension and Termination
            </h2>

            <p>
              ROFRAAI may restrict, suspend, or terminate an account where
              reasonably necessary to protect the platform, its users, its
              payment systems, or the integrity of marketplace activity.
            </p>

            <p className="mt-4">
              This may include suspected fraud, abuse, unauthorized access,
              manipulation of task or payment systems, repeated policy
              violations, or other conduct that presents a material risk to
              ROFRAAI or its users.
            </p>

            <p className="mt-4">
              Where appropriate, ROFRAAI may review relevant account,
              submission, transaction, and activity records before making a
              decision.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              11. Intellectual Property
            </h2>

            <p>
              The ROFRAAI name, branding, software, interface, designs,
              content, and other platform materials may be protected by
              applicable intellectual-property laws.
            </p>

            <p className="mt-4">
              You may not copy, modify, distribute, reverse engineer, sell,
              or commercially exploit ROFRAAI platform materials except where
              permitted by law or with appropriate authorization.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              12. User Content
            </h2>

            <p>
              Users may submit information, documents, text, files, or other
              materials in connection with projects and tasks.
            </p>

            <p className="mt-4">
              You are responsible for ensuring that you have the necessary
              rights and permissions to submit such material and that your
              submissions do not unlawfully infringe another person&apos;s rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              13. Third-Party Services
            </h2>

            <p>
              ROFRAAI may rely on third-party services for functions such as
              payment processing, hosting, authentication, communications, or
              other infrastructure.
            </p>

            <p className="mt-4">
              Third-party services operate according to their own terms and
              policies. ROFRAAI is not responsible for independent failures
              or policy decisions made by third-party providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              14. No Guarantee of Income or Work
            </h2>

            <p>
              ROFRAAI is a marketplace platform and does not guarantee
              employment, a minimum income, a particular number of tasks, or a
              particular financial outcome.
            </p>

            <p className="mt-4">
              Any earnings shown on the platform are subject to the applicable
              task, review, approval, payment, and withdrawal processes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              15. Platform Availability
            </h2>

            <p>
              We aim to keep ROFRAAI available and reliable, but the platform
              may occasionally be unavailable because of maintenance,
              technical problems, security incidents, infrastructure failures,
              or circumstances beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              16. Changes to These Terms
            </h2>

            <p>
              ROFRAAI may update these Terms of Service as the platform,
              services, legal requirements, or business practices develop.
            </p>

            <p className="mt-4">
              Updated terms will be published on this page with a revised
              effective or updated date. Continued use of ROFRAAI after an
              applicable update may constitute acceptance of the revised
              terms, subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              17. Contact
            </h2>

            <p>
              If you have questions about these Terms of Service, please use
              the contact information provided through the ROFRAAI platform.
            </p>
          </section>

          <section className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <h2 className="mb-3 text-lg font-bold text-yellow-300">
              Legal review notice
            </h2>

            <p className="text-sm leading-6 text-gray-400">
              These Terms of Service are intended as a platform-specific
              starting point and are not a substitute for advice from a
              qualified lawyer. Before launching ROFRAAI commercially,
              especially where the platform handles payments, personal data,
              worker relationships, or cross-border activity, the final terms
              should be reviewed for compliance with applicable law.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
