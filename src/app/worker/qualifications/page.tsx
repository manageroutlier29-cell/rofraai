import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusStyles: Record<string, string> = {
  NOT_STARTED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PASSED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
  EXPIRED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const statusLabels: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  PASSED: "Passed",
  FAILED: "Failed",
  EXPIRED: "Expired",
};

export default async function WorkerQualificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Qualification Center</h1>
        <p className="mt-2 text-gray-400">
          Please sign in to view your qualifications.
        </p>
      </div>
    );
  }

  const qualifications = await prisma.workerQualification.findMany({
    where: {
      workerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const passed = qualifications.filter(
    (qualification) => qualification.status === "PASSED"
  ).length;

  const inProgress = qualifications.filter(
    (qualification) => qualification.status === "IN_PROGRESS"
  ).length;

  const failed = qualifications.filter(
    (qualification) => qualification.status === "FAILED"
  ).length;

  const expired = qualifications.filter(
    (qualification) => qualification.status === "EXPIRED"
  ).length;

  return (
    <div className="min-h-screen bg-[#07111f] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-cyan-400">
            WORKER QUALIFICATION
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Qualification Center
          </h1>

          <p className="mt-2 max-w-2xl text-gray-400">
            Complete qualifications to unlock projects and tasks that match
            your skills.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Total Qualifications</p>
            <p className="mt-2 text-3xl font-bold">
              {qualifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">
            <p className="text-sm text-gray-500">Passed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {passed}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-5">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">
              {inProgress}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/10 bg-orange-500/[0.03] p-5">
            <p className="text-sm text-gray-500">Expired / Failed</p>
            <p className="mt-2 text-3xl font-bold text-orange-400">
              {expired + failed}
            </p>
          </div>
        </div>

        {/* Qualifications */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex flex-col gap-2 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Your Qualifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Qualifications determine which marketplace tasks you can
                access.
              </p>
            </div>

            <div className="rounded-lg bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300">
              {passed} qualification{passed === 1 ? "" : "s"} active
            </div>
          </div>

          {qualifications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
                ★
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No qualifications yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Complete assessments to earn qualifications and unlock
                marketplace opportunities.
              </p>

              <a
                href="/worker/assessments"
                className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#06101d] transition hover:bg-cyan-300"
              >
                View Assessments
              </a>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {qualifications.map((qualification) => {
                const statusClass =
                  statusStyles[qualification.status] ??
                  statusStyles.NOT_STARTED;

                const statusLabel =
                  statusLabels[qualification.status] ??
                  qualification.status;

                return (
                  <div
                    key={qualification.id}
                    className="flex flex-col gap-5 p-6 transition hover:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-400">
                        ★
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold">
                          {qualification.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                            {qualification.category}
                          </span>

                          <span
                            className={`rounded-md border px-2 py-1 text-xs ${statusClass}`}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        {qualification.description && (
                          <p className="mt-3 max-w-2xl text-sm text-gray-500">
                            {qualification.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:min-w-[330px]">
                      <div>
                        <p className="text-xs text-gray-500">Score</p>

                        <p className="mt-1 font-semibold">
                          {qualification.score !== null
                            ? `${qualification.score}%`
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Expires</p>

                        <p className="mt-1 text-sm font-medium">
                          {qualification.expiresAt
                            ? qualification.expiresAt.toLocaleDateString()
                            : "No expiry"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Category</p>

                        <p className="mt-1 truncate text-sm font-medium">
                          {qualification.category}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Marketplace notice */}
        <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-6">
          <div className="flex gap-4">
            <div className="text-xl text-cyan-400">ℹ</div>

            <div>
              <h3 className="font-semibold">
                How qualifications affect your work
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                ROFRAAI uses your qualifications to determine which projects
                and tasks you are eligible to claim. Higher qualifications can
                unlock more specialized work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
