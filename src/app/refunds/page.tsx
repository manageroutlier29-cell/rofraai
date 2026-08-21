import Link from "next/link";

export const metadata = {
  title: "Payments, Refunds & Cancellation Policy | ROFRAAI",
  description: "ROFRAAI payment, refund, cancellation, and payment dispute policy.",
};

export default function RefundsPage() {
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
            Payments, Refunds & Cancellation Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: August 21, 2026</p>
        </header>

        <div className="space-y-10 leading-7 text-gray-300">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">1. Marketplace Access Payments</h2>
            <p>
              Where ROFRAAI charges a marketplace access fee, the applicable
              amount and payment details will be displayed before payment is
              initiated.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">2. Payment Confirmation</h2>
            <p>
              A payment is considered successfully completed only after the
              applicable payment provider confirms the transaction.
            </p>
            <p className="mt-4">
              A payment request that is pending, cancelled, declined, failed,
              or otherwise unsuccessful does not by itself unlock paid platform
              access.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">3. Failed Payments</h2>
            <p>
              If a payment fails or is declined, ROFRAAI will not treat the
              failed transaction as a completed purchase. You may retry the
              payment where the platform or payment provider permits it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">4. Refund Requests</h2>
            <p>
              Refund requests are reviewed individually. A request should
              include enough information for ROFRAAI to identify the relevant
              transaction.
            </p>
            <p className="mt-4">
              Where a payment was completed but the purchased platform feature
              was not correctly activated because of a technical issue,
              ROFRAAI may investigate the transaction and, where appropriate,
              correct the account or issue a refund.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">5. Duplicate or Incorrect Charges</h2>
            <p>
              If you believe you were charged more than once for the same
              transaction or charged an incorrect amount, contact ROFRAAI
              promptly with the transaction details so the issue can be
              investigated.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">6. Worker Earnings</h2>
            <p>
              Worker earnings are separate from marketplace access payments.
              Eligible earnings are subject to the task, review, approval, and
              withdrawal rules described in the{" "}
              <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                Terms of Service
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">7. Third-Party Payment Providers</h2>
            <p>
              Payments may be processed by third-party payment providers.
              Provider processing times, outages, transaction limits, or
              provider-specific rules may affect a payment.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">8. Payment Security</h2>
            <p>
              ROFRAAI will not ask you to disclose your M-Pesa PIN, card PIN,
              banking password, or other payment authentication credentials.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
