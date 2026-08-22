import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Join ROFRAAI by creating your account and building a professional profile that reflects your skills and experience.",
  },
  {
    number: "02",
    title: "Build your profile",
    description:
      "Tell us about your expertise, industries, languages, qualifications and areas where you can contribute.",
  },
  {
    number: "03",
    title: "Discover opportunities",
    description:
      "Browse projects and tasks that match your skills, experience and interests.",
  },
  {
    number: "04",
    title: "Complete quality work",
    description:
      "Work on AI evaluation, data, research, finance and other specialized projects while following project requirements.",
  },
  {
    number: "05",
    title: "Quality review",
    description:
      "Submissions go through quality controls designed to maintain reliable and consistent project results.",
  },
  {
    number: "06",
    title: "Get paid",
    description:
      "Approved work is recorded in your account and eligible earnings become available through the platform.",
  },
];

export default function HowItWorksPage() {
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
            <Link
              href="/how-it-works"
              className="text-white transition hover:text-cyan-400"
            >
              How It Works
            </Link>

            <Link
              href="/for-freelancers"
              className="transition hover:text-white"
            >
              For Freelancers
            </Link>

            <Link
              href="/for-clients"
              className="transition hover:text-white"
            >
              For Clients
            </Link>

          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl border border-white/15 px-5 py-2.5 transition hover:bg-white/10 sm:block"
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
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            HOW ROFRAAI WORKS
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            From skills to
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              real opportunities.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
            ROFRAAI connects skilled people with organizations that need
            reliable human expertise to build, evaluate and improve AI
            systems.
          </p>
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-cyan-400">
                  {step.number}
                </span>

                <div className="h-2 w-2 rounded-full bg-cyan-400 opacity-50 transition group-hover:opacity-100" />
              </div>

              <h2 className="mt-10 text-2xl font-bold">{step.title}</h2>

              <p className="mt-4 leading-relaxed text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TWO SIDES */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-24 lg:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-10">
            <p className="font-semibold text-cyan-400">FOR FREELANCERS</p>

            <h2 className="mt-4 text-3xl font-bold">
              Turn your expertise into opportunity.
            </h2>

            <p className="mt-5 leading-relaxed text-gray-400">
              Whether you are a finance graduate, researcher, analyst,
              accountant, data specialist or AI enthusiast, ROFRAAI gives you
              access to specialized work.
            </p>

            <Link
              href="/register"
              className="mt-7 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
            >
              Join as a Freelancer
            </Link>
          </div>

          <div className="rounded-3xl border border-purple-400/10 bg-gradient-to-br from-purple-500/10 to-transparent p-10">
            <p className="font-semibold text-purple-400">FOR CLIENTS</p>

            <h2 className="mt-4 text-3xl font-bold">
              Get specialized work done.
            </h2>

            <p className="mt-5 leading-relaxed text-gray-400">
              Access a distributed workforce capable of supporting AI
              evaluation, research, data projects, financial analysis and
              other specialized tasks.
            </p>

            <Link
              href="/for-clients"
              className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Explore Client Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-cyan-400/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl font-bold md:text-5xl">
              Ready to get started?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-gray-400">
              Join the platform connecting skilled people with the future of
              AI work.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:bg-cyan-300"
              >
                Create an Account →
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 font-semibold transition hover:bg-white/10"
              >
                Back Home
              </Link>
            </div>
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