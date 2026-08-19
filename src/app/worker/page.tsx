import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function WorkerDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "WORKER") {
    redirect("/login");
  }

  const workerId = session.user.id;

  const [
    worker,
    availableTasks,
    completedAssignments,
    earnings,
    submissions,
    qualifications,
    paymentAccount,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: workerId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        workerProfile: {
          select: {
            bio: true,
            skills: true,
            experience: true,
          },
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.assignment.count({
      where: {
        workerId,
        status: "COMPLETED",
      },
    }),

    prisma.earning.aggregate({
      where: {
        workerId,
        status: {
          in: ["PENDING", "AVAILABLE", "PAID"],
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.submission.findMany({
      where: {
        workerId,
      },
      include: {
        assignment: {
          include: {
            task: {
              select: {
                title: true,
                reward: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),

    prisma.workerQualification.findMany({
      where: {
        workerId,
      },
      select: {
        status: true,
      },
    }),

    prisma.paymentAccount.findFirst({
      where: {
        workerId,
        status: "ACTIVE",
      },
    }),
  ]);

  if (!worker) {
    redirect("/login");
  }

  const totalEarnings = Number(earnings._sum.amount ?? 0);

  const hasBasicInfo =
    Boolean(worker.firstName) &&
    Boolean(worker.lastName) &&
    Boolean(worker.email);

  const hasSkills = Boolean(worker.workerProfile?.skills);

  const hasExperience = Boolean(worker.workerProfile?.experience);

  const hasAssessment = qualifications.some(
    (qualification) => qualification.status === "PASSED"
  );

  const profileItems = [
    hasBasicInfo,
    hasSkills,
    hasExperience,
    hasAssessment,
    Boolean(paymentAccount),
  ];

  const profileCompleted = profileItems.filter(Boolean).length;
  const profileStrength = Math.round(
    (profileCompleted / profileItems.length) * 100
  );

  const firstName = worker.firstName || "Worker";
  const initials =
    `${worker.firstName?.[0] ?? ""}${worker.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Worker Dashboard</p>

          <h1 className="mt-1 text-3xl font-bold">
            Welcome back, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your work, tasks, submissions and earnings.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 font-bold text-[#06101d]">
          {initials || "W"}
        </div>
      </div>

      {/* WELCOME CARD */}
      <section className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-7">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              You&apos;re ready to work
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              Find your next task.
            </h2>

            <p className="mt-3 max-w-2xl text-gray-400">
              Explore projects matched to your skills and experience.
              Complete high-quality work and grow your ROFRAAI reputation.
            </p>
          </div>

          <Link
            href="/worker/tasks"
            className="shrink-0 rounded-xl bg-cyan-400 px-6 py-3.5 text-center font-bold text-[#06101d] transition hover:bg-cyan-300"
          >
            Browse Tasks →
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Earnings"
          value={`$${totalEarnings.toFixed(2)}`}
          icon="💰"
        />

        <StatCard
          label="Available Tasks"
          value={availableTasks.toString()}
          icon="📋"
        />

        <StatCard
          label="Completed Tasks"
          value={completedAssignments.toString()}
          icon="✓"
        />

        <StatCard
          label="Profile Strength"
          value={`${profileStrength}%`}
          icon="★"
        />
      </section>

      {/* MAIN GRID */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* RECENT SUBMISSIONS */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Activity
              </p>

              <h2 className="mt-1 text-2xl font-bold">
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

          {submissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-gray-400">
                You haven&apos;t submitted any work yet.
              </p>

              <Link
                href="/worker/tasks"
                className="mt-4 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Browse available tasks →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">
                      {submission.assignment.task.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {submission.status.replaceAll("_", " ")}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-bold text-cyan-400">
                      ${submission.assignment.task.reward.toString()}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(
                        submission.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PROFILE */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Your profile
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Profile strength
          </h2>

          <div className="mt-6 flex items-end justify-between">
            <span className="text-3xl font-bold">
              {profileStrength}%
            </span>

            <span className="text-xs text-gray-500">
              {profileCompleted}/{profileItems.length} complete
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
              style={{ width: `${profileStrength}%` }}
            />
          </div>

          <div className="mt-6 space-y-4">
            <ProgressItem
              label="Basic information"
              done={hasBasicInfo}
            />

            <ProgressItem
              label="Skills"
              done={hasSkills}
            />

            <ProgressItem
              label="Experience"
              done={hasExperience}
            />

            <ProgressItem
              label="Assessments"
              done={hasAssessment}
            />

            <ProgressItem
              label="Payment details"
              done={Boolean(paymentAccount)}
            />
          </div>

          <Link
            href="/worker/profile"
            className="mt-7 block rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-semibold transition hover:bg-white/[0.06]"
          >
            Complete Profile
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>

      <p className="mt-5 text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function ProgressItem({
  label,
  done,
}: {
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>

      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
          done
            ? "bg-emerald-400/15 text-emerald-400"
            : "bg-white/5 text-gray-600"
        }`}
      >
        {done ? "✓" : "•"}
      </span>
    </div>
  );
}
