import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function WorkerSubmissionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <p className="mt-2 text-gray-400">
          Please sign in to view your submissions.
        </p>
      </div>
    );
  }

  if (session.user.role !== "WORKER") {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <p className="mt-2 text-gray-400">
          Only workers can view worker submissions.
        </p>
      </div>
    );
  }

  const submissions = await prisma.submission.findMany({
    where: {
      workerId: session.user.id,
    },
    include: {
      assignment: {
        include: {
          task: {
            include: {
              project: true,
            },
          },
        },
      },
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  const submitted = submissions.filter(
    (submission) => submission.status === "SUBMITTED"
  ).length;

  const reviewing = submissions.filter(
    (submission) => submission.status === "UNDER_REVIEW"
  ).length;

  const approved = submissions.filter(
    (submission) => submission.status === "APPROVED"
  ).length;

  const revision = submissions.filter(
    (submission) => submission.status === "REVISION_REQUIRED"
  ).length;

  return (
    <div className="p-6 lg:p-8">

      <div>
        <p className="text-sm text-gray-500">
          Worker Portal
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          My Submissions
        </h1>

        <p className="mt-2 text-gray-400">
          Track work you&apos;ve submitted for review.
        </p>
      </div>

      {/* STATS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Stat
          label="Submitted"
          value={submitted}
        />

        <Stat
          label="Under Review"
          value={reviewing}
        />

        <Stat
          label="Approved"
          value={approved}
        />

        <Stat
          label="Revision Required"
          value={revision}
        />

      </div>

      {/* SUBMISSIONS */}

      <div className="mt-8 space-y-4">

        {submissions.map((submission) => {

          const review = submission.reviews[0];

          return (
            <div
              key={submission.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:bg-white/[0.05]"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="min-w-0">

                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    {submission.assignment.task.project.title}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {submission.assignment.task.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    Submitted{" "}
                    {new Date(
                      submission.submittedAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                <StatusBadge status={submission.status} />

              </div>

              <div className="mt-5 border-t border-white/10 pt-5">

                <p className="text-sm text-gray-400">
                  {submission.content || "No text content attached."}
                </p>

              </div>

              {review?.feedback && (

                <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Reviewer Feedback
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {review.feedback}
                  </p>

                  {review.score !== null && (
                    <p className="mt-2 text-xs text-gray-500">
                      Score: {review.score}/100
                    </p>
                  )}

                </div>

              )}

            </div>
          );
        })}

        {submissions.length === 0 && (

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">

            <div className="text-4xl">
              ◇
            </div>

            <h2 className="mt-4 text-xl font-bold">
              No submissions yet
            </h2>

            <p className="mt-2 text-gray-500">
              Completed work will appear here after you submit it.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {

  const styles: Record<string, string> = {
    SUBMITTED:
      "bg-blue-400/10 text-blue-400",

    UNDER_REVIEW:
      "bg-amber-400/10 text-amber-400",

    REVISION_REQUIRED:
      "bg-orange-400/10 text-orange-400",

    APPROVED:
      "bg-emerald-400/10 text-emerald-400",

    REJECTED:
      "bg-red-400/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] ||
        "bg-gray-400/10 text-gray-400"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}