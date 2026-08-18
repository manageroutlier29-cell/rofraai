"use client";

import Link from "next/link";

export default function ForFreelancers() {
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
            <Link href="/how-it-works" className="transition hover:text-white">
              How it works
            </Link>

            <Link href="/for-clients" className="transition hover:text-white">
              For Clients
            </Link>

            <Link
              href="/for-freelancers"
              className="text-cyan-400"
            >
              For Freelancers
            </Link>

            <Link href="/#about" className="transition hover:text-white">
              About
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
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-24 lg:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Work on the future of AI
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Your skills.
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Global opportunities.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-400 md:text-xl">
              Turn your expertise into meaningful work. ROFRAAI connects
              skilled freelancers with projects involving AI evaluation,
              research, finance, data and specialized knowledge.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-cyan-400 px-7 py-4 text-center font-bold text-[#06101d] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
              >
                Become a Freelancer →
              </Link>

              <Link
                href="/how-it-works"
                className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-center font-semibold transition hover:bg-white/10"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm text-gray-400">
              <div>
                <strong className="block text-2xl text-white">10K+</strong>
                Freelancers
              </div>

              <div>
                <strong className="block text-2xl text-white">500+</strong>
                Projects
              </div>

              <div>
                <strong className="block text-2xl text-white">40+</strong>
                Countries
              </div>
            </div>
          </div>

          {/* FREELANCER DASHBOARD PREVIEW */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Freelancer Dashboard
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Good morning 👋
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 font-bold">
                  JD
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-4">
                <DashboardCard
                  title="Available Tasks"
                  value="24"
                />

                <DashboardCard
                  title="This Month"
                  value="$1,248"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Recommended Projects</p>

                    <p className="mt-1 text-xs text-gray-500">
                      Matched to your expertise
                    </p>
                  </div>

                  <span className="text-sm text-cyan-400">
                    View all
                  </span>
                </div>

                <div className="space-y-3">
                  <Project
                    title="AI Response Evaluation"
                    category="AI Training"
                    reward="$18.50 / task"
                  />

                  <Project
                    title="Financial Reasoning Review"
                    category="Finance"
                    reward="$24.00 / task"
                  />

                  <Project
                    title="Research Quality Assessment"
                    category="Research"
                    reward="$21.75 / task"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK CATEGORIES */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-cyan-400">
              OPPORTUNITIES
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              Work that matches your expertise.
            </h2>

            <p className="mt-5 text-lg text-gray-400">
              Different projects require different kinds of knowledge.
              ROFRAAI helps connect your skills with the right opportunities.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Category
              icon="◈"
              title="AI Evaluation"
              text="Evaluate AI responses, reasoning, accuracy and helpfulness."
            />

            <Category
              icon="◆"
              title="Finance"
              text="Review financial reasoning, accounting and economic analysis."
            />

            <Category
              icon="⌘"
              title="Data & Annotation"
              text="Help create high-quality datasets used to improve AI systems."
            />

            <Category
              icon="◎"
              title="Research"
              text="Conduct research, fact checking and specialized analysis."
            />

            <Category
              icon="◇"
              title="Content"
              text="Create, review and evaluate high-quality AI training content."
            />

            <Category
              icon="✦"
              title="Specialized Expertise"
              text="Use your professional knowledge to solve specialized tasks."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-2xl">
          <p className="font-semibold text-cyan-400">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            From signup to your first project.
          </h2>

          <p className="mt-5 text-lg text-gray-400">
            We've designed ROFRAAI to make finding specialized work simple.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          <Step
            number="01"
            title="Create your profile"
            text="Tell us about your education, skills, experience and areas of expertise."
          />

          <Step
            number="02"
            title="Complete assessments"
            text="Demonstrate your knowledge through relevant skill assessments."
          />

          <Step
            number="03"
            title="Get matched"
            text="Discover projects that match your skills and qualifications."
          />

          <Step
            number="04"
            title="Complete & earn"
            text="Deliver high-quality work, build your reputation and get paid."
          />
        </div>
      </section>

      {/* QUALITY SECTION */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-28 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-10">
          <div className="mb-6 text-4xl text-cyan-400">✓</div>

          <h3 className="text-3xl font-bold">
            Your reputation matters.
          </h3>

          <p className="mt-4 leading-relaxed text-gray-400">
            High-quality work helps you build a stronger profile and unlock
            better opportunities over time.
          </p>

          <div className="mt-8 space-y-4">
            <Progress label="Quality Score" value="96%" />
            <Progress label="Reliability" value="94%" />
            <Progress label="Task Accuracy" value="98%" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-10">
          <div className="mb-6 text-4xl text-purple-400">✦</div>

          <h3 className="text-3xl font-bold">
            Grow with every project.
          </h3>

          <p className="mt-4 leading-relaxed text-gray-400">
            Your ROFRAAI profile becomes a record of your skills, experience
            and performance across completed projects.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Stat value="24" label="Tasks completed" />
            <Stat value="4.9/5" label="Average rating" />
            <Stat value="$3,842" label="Total earned" />
            <Stat value="96%" label="Quality score" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-cyan-400/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl font-bold md:text-5xl">
              Your expertise can help build AI.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-gray-400">
              Join ROFRAAI and connect your skills with the projects shaping
              the next generation of artificial intelligence.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:bg-cyan-300"
            >
              Create Your Freelancer Profile →
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

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function Project({
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
        <p className="mt-1 text-xs text-gray-500">{category}</p>
      </div>

      <span className="whitespace-nowrap text-sm font-semibold text-cyan-400">
        {reward}
      </span>
    </div>
  );
}

function Category({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:bg-white/[0.06]">
      <div className="text-3xl text-cyan-400">{icon}</div>

      <h3 className="mt-6 text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-relaxed text-gray-400">{text}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
      <div className="text-sm font-bold text-cyan-400">{number}</div>

      <h3 className="mt-8 text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-relaxed text-gray-400">{text}</p>
    </div>
  );
}

function Progress({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{ width: value }}
        />
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}