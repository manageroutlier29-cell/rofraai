"use client";

import Link from "next/link";

const stats = [
  {
    label: "Total Workers",
    value: "12,482",
    change: "+8.4%",
    icon: "◉",
  },
  {
    label: "Active Clients",
    value: "486",
    change: "+5.2%",
    icon: "◆",
  },
  {
    label: "Active Tasks",
    value: "128",
    change: "+12.7%",
    icon: "✓",
  },
  {
    label: "Paid Out",
    value: "$48,620",
    change: "+18.3%",
    icon: "$",
  },
];

const projects = [
  {
    name: "AI Response Evaluation",
    client: "AI Research Labs",
    progress: 82,
    tasks: "1,240",
    status: "Active",
  },
  {
    name: "Financial Reasoning Review",
    client: "FinTech Intelligence",
    progress: 61,
    tasks: "840",
    status: "Active",
  },
  {
    name: "Data Quality Assessment",
    client: "DataScale",
    progress: 74,
    tasks: "2,180",
    status: "Active",
  },
];

const activity = [
  {
    title: "New worker registered",
    description: "A new worker joined ROFRAAI",
    time: "4 min ago",
    icon: "◉",
  },
  {
    title: "Project created",
    description: "AI Research Labs created a new project",
    time: "18 min ago",
    icon: "◆",
  },
  {
    title: "Task submitted",
    description: "A worker submitted 24 completed tasks",
    time: "31 min ago",
    icon: "✓",
  },
  {
    title: "Payment approved",
    description: "$842 payment batch approved",
    time: "1 hr ago",
    icon: "$",
  },
  {
    title: "Assessment completed",
    description: "Finance assessment completed by 18 workers",
    time: "2 hrs ago",
    icon: "★",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">

      {/* TOP BAR */}
      <div className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-5 lg:px-8">

          <div>
            <p className="text-sm text-gray-500">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Command Center
            </h1>
          </div>

          <div className="hidden items-center gap-3 sm:flex">

            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 transition hover:bg-white/[0.07] hover:text-white">
              🔔

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
            </button>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              View Website
            </Link>

          </div>

        </div>
      </div>

      <div className="space-y-8 p-6 lg:p-8">

        {/* WELCOME */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 p-7 md:p-9">

            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Platform Overview
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Good morning, Administrator.
              </h2>

              <p className="mt-3 max-w-2xl text-gray-400">
                Monitor workers, clients, projects, tasks, quality and
                payments from one centralized ROFRAAI control center.
              </p>

            </div>

          </div>
        </section>

        {/* STAT CARDS */}
        <section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:bg-white/[0.05]"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
                    {stat.icon}
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    {stat.change}
                  </span>

                </div>

                <p className="mt-5 text-sm text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* PROJECTS + QUALITY */}
        <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

          {/* PROJECT ACTIVITY */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

            <div className="flex items-center justify-between border-b border-white/10 p-6">

              <div>
                <h3 className="text-lg font-bold">
                  Project Activity
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Current platform projects
                </p>
              </div>

              <Link
                href="/admin/projects"
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                View all →
              </Link>

            </div>

            <div className="divide-y divide-white/10">

              {projects.map((project) => (
                <div
                  key={project.name}
                  className="p-6 transition hover:bg-white/[0.02]"
                >

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                      <div className="flex items-center gap-3">

                        <h4 className="font-semibold">
                          {project.name}
                        </h4>

                        <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-400">
                          {project.status}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {project.client}
                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="text-sm font-semibold">
                        {project.tasks} tasks
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {project.progress}% complete
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* QUALITY */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

            <div className="border-b border-white/10 p-6">

              <h3 className="text-lg font-bold">
                Quality Overview
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Platform quality indicators
              </p>

            </div>

            <div className="space-y-6 p-6">

              <div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-400">
                    Average Quality
                  </span>

                  <span className="font-bold text-cyan-400">
                    94.2%
                  </span>

                </div>

                <div className="mt-3 h-2 rounded-full bg-white/5">

                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: "94.2%" }}
                  />

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                  <p className="text-xs text-gray-500">
                    Pending Reviews
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    37
                  </p>

                </div>

                <div className="rounded-xl border border-white/10 bg-black/10 p-4">

                  <p className="text-xs text-gray-500">
                    Flagged
                  </p>

                  <p className="mt-2 text-2xl font-bold text-amber-400">
                    12
                  </p>

                </div>

              </div>

              <Link
                href="/admin/quality"
                className="block rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                Open Quality Center
              </Link>

            </div>

          </div>

        </section>

        {/* ACTIVITY + ALERTS */}
        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

          {/* RECENT ACTIVITY */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

            <div className="flex items-center justify-between border-b border-white/10 p-6">

              <div>
                <h3 className="text-lg font-bold">
                  Recent Activity
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Latest platform events
                </p>
              </div>

              <span className="text-xs text-gray-500">
                Live
              </span>

            </div>

            <div className="divide-y divide-white/10">

              {activity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 p-5"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold">
                      {item.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.description}
                    </p>

                  </div>

                  <span className="whitespace-nowrap text-xs text-gray-600">
                    {item.time}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* ALERTS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

            <div className="border-b border-white/10 p-6">

              <h3 className="text-lg font-bold">
                System Alerts
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Items requiring attention
              </p>

            </div>

            <div className="space-y-3 p-6">

              <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-4">

                <div className="flex gap-3">

                  <span className="text-amber-400">
                    ⚠
                  </span>

                  <div>

                    <p className="text-sm font-semibold">
                      Reviews required
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      12 submissions are waiting for quality review.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-xl border border-purple-400/10 bg-purple-400/5 p-4">

                <div className="flex gap-3">

                  <span className="text-purple-400">
                    $
                  </span>

                  <div>

                    <p className="text-sm font-semibold">
                      Payments awaiting approval
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      5 payment batches require administrator approval.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">

                <div className="flex gap-3">

                  <span className="text-emerald-400">
                    ✓
                  </span>

                  <div>

                    <p className="text-sm font-semibold">
                      Platform operational
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      All major ROFRAAI services are operating normally.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section>

          <div className="mb-4">

            <h3 className="text-lg font-bold">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Frequently used administration tools
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Link
              href="/admin/users"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
            >
              <span className="text-2xl text-cyan-400">
                ◉
              </span>

              <h4 className="mt-4 font-semibold">
                Manage Users
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Review and manage platform accounts.
              </p>
            </Link>

            <Link
              href="/admin/projects"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
            >
              <span className="text-2xl text-blue-400">
                ▣
              </span>

              <h4 className="mt-4 font-semibold">
                Manage Projects
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Monitor client projects and progress.
              </p>
            </Link>

            <Link
              href="/admin/quality"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
            >
              <span className="text-2xl text-purple-400">
                ★
              </span>

              <h4 className="mt-4 font-semibold">
                Review Quality
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Inspect flagged work and reviews.
              </p>
            </Link>

            <Link
              href="/admin/payments"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
            >
              <span className="text-2xl text-emerald-400">
                $
              </span>

              <h4 className="mt-4 font-semibold">
                Review Payments
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Approve and monitor worker payouts.
              </p>
            </Link>

          </div>

        </section>

      </div>

    </div>
  );
}
