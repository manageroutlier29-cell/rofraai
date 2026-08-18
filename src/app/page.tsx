"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* LOGO */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black">
              R
            </div>

            <span className="text-2xl font-bold tracking-tight">
              ROFRA<span className="text-cyan-400">AI</span>
            </span>
          </a>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <a
              href="/how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="/freelancers"
              className="transition hover:text-white"
            >
              For Freelancers
            </a>

            <a
              href="/clients"
              className="transition hover:text-white"
            >
              For Clients
            </a>

            <a
              href="/pricing"
              className="transition hover:text-white"
            >
              Pricing
            </a>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="rounded-xl border border-white/15 px-5 py-2.5 transition hover:bg-white/10"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 font-semibold text-[#06101d] transition hover:bg-cyan-300"
            >
              Get Started
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {menuOpen && (
          <div className="border-t border-white/10 px-6 pb-6 pt-5 md:hidden">
            <div className="flex flex-col gap-5 text-gray-300">
              <a href="/how-it-works">How It Works</a>

              <a href="/freelancers">For Freelancers</a>

              <a href="/clients">For Clients</a>

              <a href="/pricing">Pricing</a>

              <a href="/login">Login</a>

              <a
                href="/register"
                className="font-semibold text-cyan-400"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-[-150px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-24 lg:grid-cols-2">
          {/* HERO CONTENT */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              The AI work platform
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Powering the
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                future of AI.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-400 md:text-xl">
              ROFRAAI connects businesses with skilled professionals who
              evaluate, improve, and train the next generation of artificial
              intelligence.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/register"
                className="rounded-2xl bg-cyan-400 px-7 py-4 text-center font-bold text-[#06101d] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
              >
                Start Working →
              </a>

              <a
                href="/clients"
                className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-center font-semibold transition hover:bg-white/10"
              >
                Hire AI Talent
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm text-gray-400">
              <div>
                <strong className="block text-2xl text-white">
                  10K+
                </strong>
                Workers
              </div>

              <div>
                <strong className="block text-2xl text-white">
                  500+
                </strong>
                Projects
              </div>

              <div>
                <strong className="block text-2xl text-white">
                  40+
                </strong>
                Countries
              </div>
            </div>
          </div>

          {/* HERO DASHBOARD */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Freelancer Dashboard
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Welcome back 👋
                  </h3>
                </div>

                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500" />
              </div>

              <div className="mb-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-gray-400">
                    Available Tasks
                  </p>

                  <p className="mt-2 text-3xl font-bold">128</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-gray-400">
                    Earnings
                  </p>

                  <p className="mt-2 text-3xl font-bold">$842</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      Recommended Tasks
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Based on your skills
                    </p>
                  </div>

                  <a
                    href="/register"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    View all
                  </a>
                </div>

                <div className="space-y-3">
                  <Task
                    title="AI Response Evaluation"
                    category="AI Training"
                    reward="$18.50"
                  />

                  <Task
                    title="Financial Reasoning Review"
                    category="Finance"
                    reward="$24.00"
                  />

                  <Task
                    title="Data Quality Assessment"
                    category="Data"
                    reward="$12.75"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / CATEGORIES */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-10 text-center">
          <p className="mb-6 text-sm text-gray-500">
            WORK ACROSS MULTIPLE AI AND BUSINESS DOMAINS
          </p>

          <div className="flex flex-wrap justify-center gap-8 font-semibold text-gray-400 md:gap-16">
            <span>AI TRAINING</span>
            <span>DATA</span>
            <span>FINANCE</span>
            <span>RESEARCH</span>
            <span>QUALITY</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="mx-auto max-w-7xl px-6 py-28"
      >
        <div className="max-w-2xl">
          <p className="font-semibold text-cyan-400">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            One platform.
            <br />
            Endless possibilities.
          </h2>

          <p className="mt-5 text-lg text-gray-400">
            ROFRAAI brings businesses and skilled professionals together
            through a structured platform for AI and specialized work.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Feature
            number="01"
            title="Join"
            text="Create your profile and tell us about your skills and expertise."
          />

          <Feature
            number="02"
            title="Work"
            text="Discover projects and complete tasks that match your abilities."
          />

          <Feature
            number="03"
            title="Earn"
            text="Deliver high-quality work, build your reputation, and get rewarded."
          />
        </div>

        <div className="mt-10 text-center">
          <a
            href="/how-it-works"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Learn how ROFRAAI works →
          </a>
        </div>
      </section>

      {/* TWO SIDES */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-28 lg:grid-cols-2">
        {/* FREELANCERS */}
        <div
          id="workers"
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-10"
        >
          <div className="mb-6 text-4xl text-cyan-400">◉</div>

          <h3 className="text-3xl font-bold">
            For Freelancers
          </h3>

          <p className="mt-4 leading-relaxed text-gray-400">
            Turn your knowledge into opportunity. Work on AI evaluation,
            data annotation, finance, research, content, and specialized
            business projects.
          </p>

          <a
            href="/freelancers"
            className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Become a Freelancer
          </a>
        </div>

        {/* CLIENTS */}
        <div
          id="clients"
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-10"
        >
          <div className="mb-6 text-4xl text-purple-400">◆</div>

          <h3 className="text-3xl font-bold">
            For Clients
          </h3>

          <p className="mt-4 leading-relaxed text-gray-400">
            Access skilled professionals to evaluate AI systems, create
            datasets, review products, perform research, and complete
            specialized tasks.
          </p>

          <a
            href="/clients"
            className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Start a Project
          </a>
        </div>
      </section>

      {/* TYPES OF WORK */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="text-center">
          <p className="font-semibold text-cyan-400">
            WHAT CAN BE DONE
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Expertise for modern AI
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-400">
            Connect specialized human expertise with the tasks required
            to build better AI systems and business products.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <WorkCard
            title="AI Evaluation"
            text="Evaluate AI responses, reasoning, accuracy, and quality."
          />

          <WorkCard
            title="Data & Annotation"
            text="Create and review high-quality datasets for AI systems."
          />

          <WorkCard
            title="Finance"
            text="Accounting, financial reasoning, analysis, and research."
          />

          <WorkCard
            title="Research"
            text="Research, content review, quality assurance, and specialized work."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-cyan-400/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl font-bold md:text-5xl">
              Ready to build the future?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-gray-400">
              Join ROFRAAI and become part of a global network powering
              the next generation of artificial intelligence.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:bg-cyan-300"
              >
                Get Started →
              </a>

              <a
                href="/how-it-works"
                className="rounded-2xl border border-white/15 px-8 py-4 font-semibold transition hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row">
          <div>
            <a href="/" className="text-xl font-bold">
              ROFRA<span className="text-cyan-400">AI</span>
            </a>

            <p className="mt-2 text-sm text-gray-500">
              Building the workforce behind AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <a
              href="/how-it-works"
              className="hover:text-white"
            >
              How It Works
            </a>

            <a
              href="/freelancers"
              className="hover:text-white"
            >
              Freelancers
            </a>

            <a
              href="/clients"
              className="hover:text-white"
            >
              Clients
            </a>

            <a
              href="/pricing"
              className="hover:text-white"
            >
              Pricing
            </a>

            <a
              href="/login"
              className="hover:text-white"
            >
              Login
            </a>
          </div>

          <div className="text-sm text-gray-500">
            © 2026 ROFRAAI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* TASK COMPONENT */

function Task({
  title,
  category,
  reward,
}: {
  title: string;
  category: string;
  reward: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-gray-500">
          {category}
        </p>
      </div>

      <span className="whitespace-nowrap text-sm font-semibold text-cyan-400">
        {reward}
      </span>
    </div>
  );
}

/* FEATURE COMPONENT */

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.06]">
      <div className="text-sm font-bold text-cyan-400">
        {number}
      </div>

      <h3 className="mt-8 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 leading-relaxed text-gray-400">
        {text}
      </p>
    </div>
  );
}

/* WORK CARD */

function WorkCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        ◆
      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray-400">
        {text}
      </p>
    </div>
  );
}