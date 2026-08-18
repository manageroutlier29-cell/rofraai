import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function WorkerReviewsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-[#07111f] p-8 text-white">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="mt-2 text-gray-400">
          Please sign in to view your reviews.
        </p>
      </div>
    );
  }

  const reviews = await prisma.review.findMany({
    where: {
      submission: {
        workerId: session.user.id,
      },
    },
    include: {
      submission: {
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
        },
      },
      reviewer: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const approved = reviews.filter(
    (review) => review.status === "APPROVED"
  ).length;

  const revisionRequired = reviews.filter(
    (review) => review.status === "REVISION_REQUIRED"
  ).length;

  const rejected = reviews.filter(
    (review) => review.status === "REJECTED"
  ).length;

  const scoredReviews = reviews.filter(
    (review) => review.score !== null
  );

  const averageScore =
    scoredReviews.length > 0
      ? (
          scoredReviews.reduce(
            (total, review) => total + (review.score ?? 0),
            0
          ) / scoredReviews.length
        ).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-[#07111f] p-6 text-white sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-400">
            WORKER MARKETPLACE
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Reviews
          </h1>

          <p className="mt-2 text-gray-400">
            Track feedback and evaluation results for your submitted work.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="mt-2 text-3xl font-bold">{reviews.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {approved}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Revision Required</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {revisionRequired}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="mt-2 text-3xl font-bold text-red-400">
              {rejected}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {averageScore}
            </p>
          </div>
        </div>

        {/* Review list */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-xl font-semibold">Review History</h2>
            <p className="mt-1 text-sm text-gray-500">
              Feedback from reviewers on your submitted work.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                ★
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No reviews yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Reviews will appear here after your submitted work has been
                evaluated.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {reviews.map((review) => {
                const task =
                  review.submission.assignment.task;

                const project =
                  task.project;

                const reviewer =
                  `${review.reviewer.firstName} ${review.reviewer.lastName}`;

                const statusClass =
                  review.status === "APPROVED"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : review.status === "REVISION_REQUIRED"
                      ? "bg-amber-400/10 text-amber-400"
                      : review.status === "REJECTED"
                        ? "bg-red-400/10 text-red-400"
                        : "bg-white/10 text-gray-300";

                return (
                  <div
                    key={review.id}
                    className="p-6 transition hover:bg-white/[0.02]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            {task.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                          >
                            {review.status.replaceAll("_", " ")}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {project.title}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-600">
                              Reviewer
                            </p>
                            <p className="mt-1 text-sm text-gray-300">
                              {reviewer}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-600">
                              Score
                            </p>
                            <p className="mt-1 text-sm font-semibold text-cyan-400">
                              {review.score !== null
                                ? `${review.score}/100`
                                : "Not scored"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-600">
                              Reviewed
                            </p>
                            <p className="mt-1 text-sm text-gray-300">
                              {review.reviewedAt
                                ? new Date(
                                    review.reviewedAt
                                  ).toLocaleDateString()
                                : "Pending"}
                            </p>
                          </div>
                        </div>

                        {review.feedback && (
                          <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                              Reviewer Feedback
                            </p>

                            <p className="mt-2 text-sm leading-6 text-gray-300">
                              {review.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}