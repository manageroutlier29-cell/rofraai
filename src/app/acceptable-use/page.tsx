import Link from "next/link";

export const metadata = {
  title: "Acceptable Use Policy | ROFRAAI",
  description: "Rules governing acceptable use of the ROFRAAI marketplace.",
};

export default function AcceptableUsePage() {
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
            Acceptable Use Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: August 21, 2026</p>
        </header>

        <div className="space-y-10 leading-7 text-gray-300">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">1. Purpose</h2>
            <p>
              This policy establishes rules intended to keep ROFRAAI safe,
              reliable, fair, and useful for clients, workers, administrators,
              and other users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">2. Fraud and Deception</h2>
            <p>You must not:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>create fraudulent accounts;</li>
              <li>impersonate another person;</li>
              <li>submit fabricated work;</li>
              <li>claim payment for work not performed;</li>
              <li>manipulate reviews, assignments, earnings, or payments;</li>
              <li>use stolen payment information.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">3. Platform Security</h2>
            <p>You must not attempt to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>access another user&apos;s account;</li>
              <li>bypass authentication or authorization;</li>
              <li>probe or attack platform infrastructure;</li>
              <li>introduce malware or malicious code;</li>
              <li>interfere with platform availability;</li>
              <li>circumvent technical restrictions.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">4. Marketplace Integrity</h2>
            <p>
              Workers must complete tasks honestly and according to the
              instructions provided. Clients must provide accurate task
              descriptions and must not intentionally create misleading,
              abusive, or impossible task requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">5. Prohibited Content</h2>
            <p>
              Users must not upload or distribute content through ROFRAAI that
              is unlawful, malicious, fraudulent, or intended to harm other
              users or the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">6. Enforcement</h2>
            <p>
              ROFRAAI may investigate suspected violations and may restrict,
              suspend, or terminate accounts or marketplace activity where
              reasonably necessary to protect the platform, users, or
              applicable legal requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">7. Reporting Abuse</h2>
            <p>
              Users who believe that another account is abusing the platform
              should report the issue through the support channels provided by
              ROFRAAI.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
