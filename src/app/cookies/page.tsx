import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | ROFRAAI",
  description: "Cookie Policy for the ROFRAAI platform.",
};

export default function CookiesPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-white">Cookie Policy</h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: August 21, 2026</p>
        </header>

        <div className="space-y-10 leading-7 text-gray-300">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">1. What Are Cookies?</h2>
            <p>
              Cookies are small data files stored on your device by websites.
              They can help websites remember sessions, preferences, and other
              information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">2. How ROFRAAI Uses Cookies</h2>
            <p>ROFRAAI may use cookies or similar technologies for:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>user authentication and login sessions;</li>
              <li>security and fraud prevention;</li>
              <li>remembering preferences;</li>
              <li>maintaining platform functionality;</li>
              <li>understanding how the platform is used.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">3. Required Cookies</h2>
            <p>
              Some cookies may be necessary for ROFRAAI to provide secure
              authentication and core functionality. Disabling these cookies
              may prevent parts of the platform from working correctly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">4. Third-Party Technologies</h2>
            <p>
              Third-party services used by ROFRAAI may use cookies or similar
              technologies in accordance with their own policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">5. Managing Cookies</h2>
            <p>
              Most web browsers allow users to control or delete cookies through
              browser settings. Blocking required cookies may affect login,
              security, or other platform functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">6. Changes</h2>
            <p>
              ROFRAAI may update this Cookie Policy when platform functionality
              or applicable requirements change.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
