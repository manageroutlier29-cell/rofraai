import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "For businesses testing AI workforce solutions.",
    price: "Free",
    period: "",
    featured: false,
    features: [
      "Create a client account",
      "Explore available services",
      "Basic project management",
      "Standard support",
    ],
    button: "Get Started",
  },
  {
    name: "Growth",
    description: "For businesses running regular AI projects.",
    price: "$99",
    period: "/month",
    featured: true,
    features: [
      "Everything in Starter",
      "Post multiple projects",
      "Access qualified specialists",
      "Advanced project management",
      "Priority support",
      "Quality monitoring",
    ],
    button: "Start Growing",
  },
  {
    name: "Enterprise",
    description: "For organizations operating at scale.",
    price: "Custom",
    period: "",
    featured: false,
    features: [
      "Everything in Growth",
      "Dedicated workforce programs",
      "Custom assessments",
      "Advanced quality control",
      "Dedicated account support",
      "Custom integrations",
    ],
    button: "Contact Us",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black">
              R
            </div>

            <span className="text-2xl font-bold tracking-tight">
              ROFRA<span className="text-cyan-400">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <Link href="/how-it-works" className="hover:text-white">
              How it works
            </Link>

            <Link href="/for-clients" className="hover:text-white">
              For Clients
            </Link>

            <Link href="/for-freelancers" className="hover:text-white">
              For Freelancers
            </Link>

            <Link href="/pricing" className="text-cyan-400">
              Pricing
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl border border-white/15 px-5 py-2.5 transition hover:bg-white/10"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-[#06101d] transition hover:bg-cyan-300"
            >
              Get Started
            </Link>
          </div>

          <div className="text-2xl md:hidden">☰</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
            Simple & transparent pricing
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Plans built for
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              every stage.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
            Start small, scale your workforce and access specialized talent
            when your business needs it.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${
                plan.featured
                  ? "border-cyan-400/40 bg-gradient-to-b from-cyan-400/10 to-white/[0.03] shadow-2xl shadow-cyan-500/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {plan.featured && (
                <div className="absolute right-6 top-6 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-black">
                  MOST POPULAR
                </div>
              )}

              <h2 className="text-2xl font-bold">{plan.name}</h2>

              <p className="mt-3 min-h-[50px] text-sm leading-relaxed text-gray-400">
                {plan.description}
              </p>

              <div className="mt-8 flex items-end gap-1">
                <span className="text-5xl font-black">{plan.price}</span>
                {plan.period && (
                  <span className="mb-2 text-gray-500">{plan.period}</span>
                )}
              </div>

              <Link
                href="/register"
                className={`mt-8 block rounded-xl px-5 py-3 text-center font-semibold transition ${
                  plan.featured
                    ? "bg-cyan-400 text-black hover:bg-cyan-300"
                    : "border border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                {plan.button}
              </Link>

              <div className="my-8 border-t border-white/10" />

              <p className="text-sm font-semibold">What&apos;s included</p>

              <div className="mt-5 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <span className="mt-0.5 text-cyan-400">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FREELANCER NOTE */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="font-semibold text-cyan-400">
                FOR FREELANCERS
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                You don&apos;t pay to find work.
              </h2>

              <p className="mt-5 leading-relaxed text-gray-400">
                Freelancers can create profiles, complete assessments and
                discover available projects without a monthly subscription.
              </p>

              <Link
                href="/for-freelancers"
                className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
              >
                Explore Freelancer Opportunities
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MiniCard value="Free" label="Profile creation" />
              <MiniCard value="0%" label="Monthly subscription" />
              <MiniCard value="24/7" label="Project access" />
              <MiniCard value="Global" label="Opportunities" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <div className="text-center">
          <p className="font-semibold text-cyan-400">FAQ</p>

          <h2 className="mt-3 text-4xl font-bold">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          <Faq
            question="Do freelancers pay a subscription?"
            answer="No. Freelancers can create their profiles and access eligible opportunities without a monthly subscription."
          />

          <Faq
            question="Can I start with the Starter plan?"
            answer="Yes. Starter is designed for businesses that want to explore ROFRAAI before scaling their project activity."
          />

          <Faq
            question="What happens when my business grows?"
            answer="You can move to a Growth or Enterprise arrangement as your project volume and workforce requirements increase."
          />

          <Faq
            question="Can Enterprise pricing be customized?"
            answer="Yes. Enterprise arrangements can be tailored around workforce size, project requirements, quality controls and integrations."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-cyan-400/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl font-bold md:text-5xl">
              Ready to get started?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-gray-400">
              Build your workforce, find specialized projects and become part
              of the ROFRAAI ecosystem.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:bg-cyan-300"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 md:flex-row">
          <div>
            <div className="text-xl font-bold">
              ROFRA<span className="text-cyan-400">AI</span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Building the workforce behind AI.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            © 2026 ROFRAAI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

function MiniCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-2xl font-bold text-cyan-400">{value}</p>
      <p className="mt-2 text-xs text-gray-500">{label}</p>
    </div>
  );
}

function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="font-semibold">{question}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-400">
        {answer}
      </p>
    </div>
  );
}