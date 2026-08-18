"use client";

import Link from "next/link";

export default function WorkerProfile() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Worker / Profile</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Your Profile
            </h1>
          </div>

          <Link
            href="/worker"
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition text-sm"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* PROFILE HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-7 md:p-10">
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-cyan-400/10 blur-3xl rounded-full" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-7">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-3xl font-black text-white shadow-xl">
              RW
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold">ROFRA Worker</h2>

                <span className="px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-semibold">
                  ● Available
                </span>
              </div>

              <p className="text-gray-400 mt-2">
                AI Evaluator • Finance Specialist • Data Reviewer
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span>📍 Kenya</span>
                <span>🌐 English</span>
                <span>⭐ 96.8% Quality</span>
              </div>
            </div>

            <button className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition">
              Edit Profile
            </button>
          </div>
        </section>

        {/* PROFILE COMPLETION */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                Profile strength
              </p>

              <h2 className="text-xl font-bold mt-1">
                Your profile is 82% complete
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Complete the remaining sections to improve your chances of
                receiving projects.
              </p>
            </div>

            <span className="text-3xl font-black text-cyan-400">82%</span>
          </div>

          <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="w-[82%] h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* ABOUT */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">About</h2>

                <button className="text-sm text-cyan-400 hover:text-cyan-300">
                  Edit
                </button>
              </div>

              <p className="text-gray-400 leading-relaxed mt-5">
                I am a detail-oriented professional interested in AI
                evaluation, financial analysis, data quality and research. I
                enjoy solving complex problems, reviewing information and
                helping improve the quality of AI systems.
              </p>
            </section>

            {/* EXPERIENCE */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Experience</h2>

                <button className="text-sm text-cyan-400 hover:text-cyan-300">
                  + Add
                </button>
              </div>

              <Experience
                title="Accounting & Finance Specialist"
                company="Professional Experience"
                period="2023 — Present"
                description="Financial analysis, accounting, reporting, budgeting and business operations."
              />

              <Experience
                title="AI Evaluation & Data Review"
                company="ROFRAAI"
                period="2026 — Present"
                description="Evaluating AI responses, reviewing datasets and assessing response quality."
              />
            </section>

            {/* EDUCATION */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Education</h2>

                <button className="text-sm text-cyan-400 hover:text-cyan-300">
                  + Add
                </button>
              </div>

              <div className="mt-6 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                  🎓
                </div>

                <div>
                  <h3 className="font-semibold">
                    Economics & Finance
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    University Degree
                  </p>

                  <p className="text-xs text-gray-600 mt-2">
                    Economics • Finance • Accounting • Statistics
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* SKILLS */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Skills</h2>

                <Link
                  href="/worker/skills"
                  className="text-sm text-cyan-400"
                >
                  Manage
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <Skill>Accounting</Skill>
                <Skill>Financial Analysis</Skill>
                <Skill>AI Evaluation</Skill>
                <Skill>Data Review</Skill>
                <Skill>Research</Skill>
                <Skill>Excel</Skill>
                <Skill>Business</Skill>
                <Skill>Communication</Skill>
              </div>
            </section>

            {/* LANGUAGES */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-xl font-bold">Languages</h2>

              <div className="mt-6 space-y-4">
                <Language
                  language="English"
                  level="Professional"
                  percentage="95%"
                />

                <Language
                  language="Swahili"
                  level="Native"
                  percentage="100%"
                />
              </div>
            </section>

            {/* VERIFICATION */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-xl font-bold">Verification</h2>

              <div className="mt-6 space-y-4">
                <Verification label="Email address" />
                <Verification label="Phone number" />
                <Verification label="Identity verification" />
              </div>
            </section>

            {/* AVAILABILITY */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-xl font-bold">Availability</h2>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="font-medium">Available for projects</p>
                  <p className="text-xs text-gray-500 mt-1">
                    You can receive new task invitations.
                  </p>
                </div>

                <div className="w-12 h-7 rounded-full bg-cyan-400 p-1">
                  <div className="w-5 h-5 rounded-full bg-black ml-auto" />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-gray-600 flex justify-between">
          <span>ROFRAAI Worker Platform</span>
          <span>Profile & Identity</span>
        </div>
      </div>
    </main>
  );
}

function Skill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/10 text-cyan-300 text-xs">
      {children}
    </span>
  );
}

function Experience({
  title,
  company,
  period,
  description,
}: {
  title: string;
  company: string;
  period: string;
  description: string;
}) {
  return (
    <div className="relative pl-7 pb-7 border-l border-white/10 last:pb-0">
      <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-cyan-400" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-cyan-400 mt-1">{company}</p>
        </div>

        <span className="text-xs text-gray-600">{period}</span>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed mt-3">
        {description}
      </p>
    </div>
  );
}

function Language({
  language,
  level,
  percentage,
}: {
  language: string;
  level: string;
  percentage: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{language}</span>
        <span className="text-gray-500">{level}</span>
      </div>

      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-400 rounded-full"
          style={{ width: percentage }}
        />
      </div>
    </div>
  );
}

function Verification({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>

      <span className="text-xs px-2.5 py-1 rounded-lg bg-green-400/10 text-green-400">
        ✓ Verified
      </span>
    </div>
  );
}