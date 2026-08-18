import Link from "next/link";

const solutions = [
  {
    icon: "◈",
    title: "AI Evaluation",
    text: "Get human experts to evaluate AI responses, reasoning, accuracy, relevance and overall quality.",
  },
  {
    icon: "◇",
    title: "Data & Annotation",
    text: "Create high-quality labeled datasets for machine learning and artificial intelligence systems.",
  },
  {
    icon: "◎",
    title: "Financial Expertise",
    text: "Connect with finance professionals who can review financial reasoning, calculations and business content.",
  },
  {
    icon: "◌",
    title: "Research",
    text: "Scale research projects with a distributed network of skilled researchers and analysts.",
  },
  {
    icon: "✦",
    title: "Product Review",
    text: "Collect structured human feedback and evaluate products, content and digital experiences.",
  },
  {
    icon: "✓",
    title: "Quality Control",
    text: "Add human quality assurance to your AI and data workflows before results reach production.",
  },
];

const process = [
  {
    number: "01",
    title: "Define your project",
    text: "Tell us what needs to be done, the skills required and the quality standards your project needs.",
  },
  {
    number: "02",
    title: "Build your workforce",
    text: "ROFRAAI organizes qualified workers around your project requirements and task specifications.",
  },
  {
    number: "03",
    title: "Launch tasks",
    text: "Distribute tasks through the platform and monitor progress as work is completed.",
  },
  {
    number: "04",
    title: "Review results",
    text: "Use quality controls and human review workflows to maintain reliable project outcomes.",
  },
];

export default function ForClientsPage() {
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
              How It Works
            </Link>

            <Link
              href="/for-clients"
              className="text-cyan-400 transition hover:text-cyan-300"
            >
              For Clients
            </Link>

            <Link
              href="/for-freelancers"
              className="transition hover:text-white"
            >
              For Freelancers
            </Link>

            <Link href="/pricing" className="transition hover:text-white">
              Pricing
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
        <div className="absolute left-1/2 top-[-180px] h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[150px]" />

        <div className="absolute right-[-150px] top-[250px] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-24 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              BUILT FOR BUSINESSES
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Scale your
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI workforce.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-400 md:text-xl">
              Access skilled human talent to evaluate AI systems, create
              datasets, conduct research, review products and complete
              specialized tasks at scale.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-cyan-400 px-7 py-4 text-center font-bold text-[#06101d] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
              >
                Start a Project →
              </Link>

              <Link
                href="#solutions"
                className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-center font-semibold transition hover:bg-white/10"
              >
                Explore Solutions
              </Link>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Client Workspace</p>
                  <h3 className="mt-1 text-xl font-bold">
                    AI Evaluation Project
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  ◈
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Stat label="Tasks" value="2,480" />
                <Stat label="Completed" value="1,842" />
                <Stat label="Quality" value="96.8%" />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Project Progress</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Current project status
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-cyan-400">
                    74%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>

                <div className="mt-5 space-y-3">
                  <ProjectRow
                    title="AI Response Evaluation"
                    workers="42 workers"
                    status="Active"
                  />

                  <ProjectRow
                    title="Financial Reasoning"
                    workers="18 workers"
                    status="Active"
                  />

                  <ProjectRow
                    title="Quality Review"
                    workers="12 reviewers"
                    status="Review"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-sm text-gray-500">
            ONE PLATFORM FOR SPECIALIZED HUMAN-AI WORK
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-8 text-sm font-semibold text-gray-400 md:gap-16">
            <span>AI EVALUATION</span>
            <span>DATA</span>
            <span>FINANCE</span>
            <span>RESEARCH</span>
            <span>QUALITY</span>
            <span>PRODUCT</span>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-2xl">
          <p className="font-semibold text-cyan-400">OUR SOLUTIONS</p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Human expertise for
            <span className="block">complex AI work.</span>
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-gray-400">
            Build flexible workflows around the expertise your organization
            needs.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-400">
                {solution.icon}
              </div>

              <h3 className="mt-7 text-2xl font-bold">{solution.title}</h3>

              <p className="mt-4 leading-relaxed text-gray-400">
                {solution.text}
              </p>

              <div className="mt-6 text-sm font-semibold text-cyan-400">
                Explore solution →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-cyan-400">THE PROCESS</p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              From project idea
              <span className="block">to completed work.</span>
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-gray-400">
              ROFRAAI gives clients a structured workflow for managing
              distributed human work.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <div
                key={item.number}
                className="relative rounded-3xl border border-white/10 bg-[#07111f] p-7"
              >
                <div className="text-sm font-bold text-cyan-400">
                  {item.number}
                </div>

                <h3 className="mt-8 text-xl font-bold">{item.title}</h3>

                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ROFRAAI */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-semibold text-cyan-400">WHY ROFRAAI</p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              More than a
              <span className="block">freelance marketplace.</span>
            </h2>

            <p className="mt-6 leading-relaxed text-gray-400">
              ROFRAAI is designed around structured AI and business workflows,
              not simply connecting a client with a freelancer.
            </p>

            <div className="mt-8 space-y-5">
              <Benefit
                title="Specialized talent"
                text="Find people with the domain knowledge your project requires."
              />

              <Benefit
                title="Structured workflows"
                text="Break complex projects into manageable tasks and stages."
              />

              <Benefit
                title="Quality controls"
                text="Build review and validation processes into your projects."
              />

              <Benefit
                title="Centralized management"
                text="Manage projects, workers, tasks and results from one platform."
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-purple-500/10 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-gray-500">Project Overview</p>
                  <h3 className="mt-1 text-xl font-bold">ROFRAAI Workspace</h3>
                </div>

                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                  LIVE
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Metric label="Active Workers" value="72" />
                <Metric label="Tasks Today" value="486" />
                <Metric label="Approved" value="94.6%" />
                <Metric label="In Review" value="31" />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-semibold">Quality Performance</p>

                <div className="mt-6 flex items-end gap-2">
                  {[40, 58, 48, 72, 65, 82, 91, 86, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-cyan-400/70"
                        style={{ height: `${height}px` }}
                      />
                    ),
                  )}
                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-500">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-cyan-400/5 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold tracking-widest text-cyan-400">
              READY TO SCALE?
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Start your project with ROFRAAI.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-gray-400">
              Tell us what you need done and build a workforce around your
              project.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:bg-cyan-300"
            >
              Start a Project →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 md:flex-row">
          <div>
            <Link href="/" className="text-xl font-bold">
              ROFRA<span className="text-cyan-400">AI</span>
            </Link>

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

/* COMPONENTS */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}

function ProjectRow({
  title,
  workers,
  status,
}: {
  title: string;
  workers: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-gray-500">{workers}</p>
      </div>

      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
        {status}
      </span>
    </div>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm text-cyan-400">
        ✓
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">{text}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}