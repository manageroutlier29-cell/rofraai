import { prisma } from "@/lib/prisma";
import ReviewActions from "./review-actions";

export default async function AdminReviewsPage() {
  const submissions = await prisma.submission.findMany({
    include: {
      worker: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
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
        include: {
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
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  const awaitingReview = submissions.filter(
    (submission) =>
      submission.status === "SUBMITTED" ||
      submission.status === "UNDER_REVIEW"
  ).length;

  const approved = submissions.filter(
    (submission) => submission.status === "APPROVED"
  ).length;

  const revisionRequired = submissions.filter(
    (submission) => submission.status === "REVISION_REQUIRED"
  ).length;

  const rejected = submissions.filter(
    (submission) => submission.status === "REJECTED"
  ).length;

  function formatStatus(status: string) {
    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-400/10 text-emerald-400";

      case "REVISION_REQUIRED":
        return "bg-amber-400/10 text-amber-400";

      case "REJECTED":
        return "bg-red-400/10 text-red-400";

      case "UNDER_REVIEW":
        return "bg-purple-400/10 text-purple-400";

      default:
        return "bg-cyan-400/10 text-cyan-400";
    }
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl p-6 sm:p-8">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Marketplace Operations
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Review Center
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400 sm:text-base">
            Review worker submissions, evaluate quality, provide feedback,
            and approve completed marketplace work.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">
              Awaiting Review
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {awaitingReview}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {approved}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">
              Revision Required
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-400">
              {revisionRequired}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-400">
              {rejected}
            </p>
          </div>

        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="border-b border-white/10 p-6">
            <h2 className="text-xl font-semibold">
              Worker Submissions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All submitted work requiring marketplace review.
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                ✓
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No submissions yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Worker submissions will appear here after workers submit
                completed tasks.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-white/10">

              {submissions.map((submission) => {
                const task = submission.assignment.task;
                const project = task.project;
                const latestReview = submission.reviews[0];

                return (
                  <article
                    key={submission.id}
                    className="p-6 transition hover:bg-white/[0.02]"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                      <div>
                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-semibold">
                            {task.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              submission.status
                            )}`}
                          >
                            {formatStatus(submission.status)}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Project: {project.title}
                        </p>
                      </div>

                      <div className="lg:text-right">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Submitted
                        </p>

                        <p className="mt-1 text-sm text-gray-300">
                          {submission.submittedAt.toLocaleDateString()}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 grid gap-4 rounded-xl border border-white/10 bg-black/10 p-4 sm:grid-cols-3">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Worker
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-200">
                          {submission.worker.firstName}{" "}
                          {submission.worker.lastName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Email
                        </p>

                        <p className="mt-1 truncate text-sm text-gray-400">
                          {submission.worker.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Category
                        </p>

                        <p className="mt-1 text-sm text-gray-300">
                          {task.category}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Task Reward
                        </p>

                        <p className="mt-1 text-lg font-semibold text-cyan-400">
                          {task.reward.toString()}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Assignment
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-300">
                          {formatStatus(submission.assignment.status)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Reviews
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-300">
                          {submission.reviews.length}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5">

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Worker Submission
                      </p>

                      <div className="mt-2 rounded-xl border border-white/10 bg-[#050d18] p-5">

                        {submission.content ? (
                          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                            {submission.content}
                          </p>
                        ) : (
                          <p className="text-sm italic text-gray-600">
                            No text content was provided.
                          </p>
                        )}

                      </div>

                    </div>

                    {latestReview && (
                      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-5">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                              Latest Review
                            </p>

                            <p className="mt-2 text-sm text-gray-300">
                              Reviewed by{" "}
                              <span className="font-semibold text-white">
                                {latestReview.reviewer.firstName}{" "}
                                {latestReview.reviewer.lastName}
                              </span>
                            </p>
                          </div>

                          {latestReview.score !== null && (
                            <div className="sm:text-right">
                              <p className="text-xs text-gray-500">
                                Score
                              </p>

                              <p className="mt-1 text-2xl font-bold text-cyan-400">
                                {latestReview.score}
                                <span className="text-sm text-gray-600">
                                  /100
                                </span>
                              </p>
                            </div>
                          )}

                        </div>

                        {latestReview.feedback && (
                          <div className="mt-4 rounded-xl bg-black/10 p-4">
                            <p className="text-sm leading-6 text-gray-400">
                              {latestReview.feedback}
                            </p>
                          </div>
                        )}

                      </div>
                    )}

                    <ReviewActions
                      submissionId={submission.id}
                    />

                  </article>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

