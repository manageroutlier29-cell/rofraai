"use client";

import Link from "next/link";

const stats = [
  {
    label: "Total Earnings",
    value: "$842.50",
    change: "+12.5%",
    icon: "💰",
  },
  {
    label: "Available Tasks",
    value: "128",
    change: "+18 today",
    icon: "📋",
  },
  {
    label: "Completed Tasks",
    value: "64",
    change: "+8 this week",
    icon: "✓",
  },
  {
    label: "Quality Score",
    value: "96.8%",
    change: "Excellent",
    icon: "★",
  },
];

const tasks = [
  {
    title: "AI Response Evaluation",
    category: "AI Training",
    difficulty: "Intermediate",
    reward: "$18.50",
    time: "25 min",
  },
  {
    title: "Financial Reasoning Review",
    category: "Finance",
    difficulty: "Advanced",
    reward: "$24.00",
    time: "35 min",
  },
  {
    title: "Data Quality Assessment",
    category: "Data",
    difficulty: "Beginner",
    reward: "$12.75",
    time: "20 min",
  },
];

const submissions = [
  {
    title: "AI Model Evaluation #4821",
    status: "Approved",
    reward: "$18.50",
    date: "Today",
  },
  {
    title: "Financial Dataset Review #3917",
    status: "Under Review",
    reward: "$24.00",
    date: "Yesterday",
  },
  {
    title: "Response Quality Assessment #2844",
    status: "Approved",
    reward: "$15.25",
    date: "Aug 15",
  },
];

export default function WorkerDashboard() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* TOP HEADER */}
      <header className="border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Worker Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Welcome back 👋
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition">
              🔔
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center font-bold">
                RW
              </div>

              <div>
                <p className="text-sm font-semibold">ROFRA Worker</p>
                <p className="text-xs text-gray-500">Freelancer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* QUICK NAVIGATION */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <DashboardLink active href="/worker">
            Dashboard
          </DashboardLink>

          <DashboardLink href="/worker/profile">Profile</DashboardLink>
          <DashboardLink href="/worker/skills">Skills</DashboardLink>
          <DashboardLink href="/worker/assessments">
            Assessments
          </DashboardLink>
          <DashboardLink href="/worker/projects">Projects</DashboardLink>
          <DashboardLink href="/worker/tasks">Tasks</DashboardLink>
          <DashboardLink href="/worker/submissions">
            Submissions
          </DashboardLink>
          <DashboardLink href="/worker/earnings">Earnings</DashboardLink>
          <DashboardLink href="/worker/settings">Settings</DashboardLink>
        </div>

        {/* WELCOME CARD */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-7 md:p-9 mb-8">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                You're ready to work
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mt-4">
                Find your next task.
              </h2>

              <p className="text-gray-400 mt-3 max-w-2xl">
                Explore projects matched to your skills and experience.
                Complete high-quality work and grow your ROFRAAI reputation.
              </p>
            </div>

            <Link
              href="/worker/tasks"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-cyan-400 text-[#06101d] font-bold hover:bg-cyan-300 transition text-center"
            >
              Browse Tasks →
            </Link>
          </div>
        </section>

        {/* STATS */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>

                <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-5">{stat.label}</p>

              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* AVAILABLE TASKS */}
          <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                  Recommended
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Tasks for you
                </h2>
              </div>

              <Link
                href="/worker/tasks"
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="group rounded-2xl border border-white/10 bg-black/10 p-5 hover:border-cyan-400/30 hover:bg-white/[0.04] transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                        AI
                      </div>

                      <div>
                        <h3 className="font-semibold group-hover:text-cyan-300 transition">
                          {task.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                          <span>{task.category}</span>
                          <span>•</span>
                          <span>{task.difficulty}</span>
                          <span>•</span>
                          <span>{task.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5">
                      <div>
                        <p className="text-xs text-gray-500">Reward</p>
                        <p className="text-cyan-400 font-bold">
                          {task.reward}
                        </p>
                      </div>

                      <button className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-cyan-400 hover:text-black transition text-sm font-semibold">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PROFILE PROGRESS */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                  Your profile
                </p>

                <h2 className="text-xl font-bold mt-1">
                  Profile strength
                </h2>
              </div>

              <span className="text-2xl font-bold">82%</span>
            </div>

            <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Complete your profile to unlock more projects.
            </p>

            <div className="mt-6 space-y-4">
              <ProgressItem label="Basic information" done />
              <ProgressItem label="Skills" done />
              <ProgressItem label="Experience" done />
              <ProgressItem label="Assessments" />
              <ProgressItem label="Payment details" />
            </div>

            <Link
              href="/worker/profile"
              className="block text-center mt-7 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/[0.06] transition text-sm font-semibold"
            >
              Complete Profile
            </Link>
          </section>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* RECENT SUBMISSIONS */}
          <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Activity
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Recent submissions
                </h2>
              </div>

              <Link
                href="/worker/submissions"
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.title}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-black/10"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {submission.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {submission.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-lg ${
                        submission.status === "Approved"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}
                    >
                      {submission.status}
                    </span>

                    <span className="text-cyan-400 font-semibold text-sm">
                      {submission.reward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EARNINGS */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Earnings
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  This month
                </h2>
              </div>

              <span className="text-green-400 text-sm font-semibold">
                +18.4%
              </span>
            </div>

            <p className="text-4xl font-black mt-7">$386.75</p>

            <div className="mt-7 space-y-4">
              <EarningRow label="AI Training" value="$184.50" />
              <EarningRow label="Finance" value="$126.25" />
              <EarningRow label="Data" value="$76.00" />
            </div>

            <Link
              href="/worker/earnings"
              className="block text-center mt-7 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] transition text-sm font-semibold"
            >
              View Earnings
            </Link>
          </section>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-gray-600">
          <p>ROFRAAI Worker Platform</p>
          <p>Build skills. Complete tasks. Power AI.</p>
        </div>
      </div>
    </main>
  );
}

function DashboardLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-cyan-400 text-black"
          : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </Link>
  );
}

function ProgressItem({
  label,
  done = false,
}: {
  label: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
          done
            ? "bg-cyan-400 text-black"
            : "border border-white/20 text-transparent"
        }`}
      >
        ✓
      </div>

      <span className={done ? "text-gray-300 text-sm" : "text-gray-500 text-sm"}>
        {label}
      </span>
    </div>
  );
}

function EarningRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}