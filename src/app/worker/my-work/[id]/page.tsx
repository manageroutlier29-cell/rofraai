import SubmitWorkForm from "../SubmitWorkForm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StartWorkButton from "../StartWorkButton";
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssignmentPage({
  params,
}: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const assignment = await prisma.assignment.findFirst({
    where: {
      id,
      workerId: session.user.id,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
      submissions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  const reward = Number(assignment.task.reward).toFixed(2);

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "No deadline";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const statusLabel = (() => {
    switch (assignment.status) {
      case "PENDING":
        return "Pending";

      case "ACCEPTED":
        return "Ready to Start";

      case "IN_PROGRESS":
        return "In Progress";

      case "SUBMITTED":
        return "Under Review";

      case "COMPLETED":
        return "Completed";

      case "REJECTED":
        return "Rejected";

      case "CANCELLED":
        return "Cancelled";

      default:
        return assignment.status;
    }
  })();

  const statusClass = (() => {
    switch (assignment.status) {
      case "COMPLETED":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "SUBMITTED":
        return "border-purple-400/20 bg-purple-400/10 text-purple-300";

      case "IN_PROGRESS":
      case "ACCEPTED":
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

      case "PENDING":
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";

      case "REJECTED":
        return "border-red-400/20 bg-red-400/10 text-red-300";

      default:
        return "border-white/10 bg-white/5 text-gray-400";
    }
  })();

  const latestSubmission = assignment.submissions[0];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#07111f]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">

        {/* BACK TO MY WORK */}
        <Link
          href="/worker/my-work"
          className="inline-flex items-center text-sm text-gray-500 transition hover:text-white"
        >
          ← Back to My Work
        </Link>

        {/* TASK HEADER */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                {assignment.task.category}
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {assignment.task.title}
              </h1>

              <p className="mt-2 text-gray-500">
                {assignment.task.project.title}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusClass}`}
            >
              {statusLabel}
            </span>

          </div>

          {/* TASK STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Reward
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-300">
                ${reward}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Deadline
              </p>

              <p className="mt-2 font-semibold">
                {formatDate(assignment.task.deadline)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Assigned
              </p>

              <p className="mt-2 font-semibold">
                {formatDate(assignment.assignedAt)}
              </p>
            </div>

          </div>
        </div>

        {/* TASK INSTRUCTIONS */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

          <h2 className="text-xl font-bold">
            Task Instructions
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Read the instructions carefully before completing the task.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
              {assignment.task.description}
            </p>

          </div>

        </section>

        {/* LATEST SUBMISSION */}
        {latestSubmission && (
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-xl font-bold">
                  Latest Submission
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Submitted{" "}
                  {formatDate(latestSubmission.submittedAt)}
                </p>
              </div>

              <span className="w-fit rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-300">
                {latestSubmission.status.replaceAll("_", " ")}
              </span>

            </div>

            {latestSubmission.content && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-5">

                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                  {latestSubmission.content}
                </p>

              </div>
            )}

          </section>
        )}

        {/* NEXT STEP */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

          <h2 className="text-xl font-bold">
            Next Step
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your available action depends on the current assignment status.
          </p>

          <div className="mt-6">

            {/* PENDING */}
            {assignment.status === "PENDING" && (
              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">

                <p className="font-semibold text-yellow-300">
                  Assignment is pending
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Your task has been claimed successfully.
                  Start the assignment when you are ready.
                </p>

                <div className="mt-5">
                  <StartWorkButton
                    assignmentId={assignment.id}
                  />
                </div>

              </div>
            )}

            {/* ACCEPTED */}
            {assignment.status === "ACCEPTED" && (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

                <p className="font-semibold text-cyan-300">
                  Ready to start
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Start working on this assignment when you are ready.
                </p>

                <div className="mt-5">
                  <StartWorkButton
                    assignmentId={assignment.id}
                  />
                </div>

              </div>
            )}

            {/* IN PROGRESS */}
            {assignment.status === "IN_PROGRESS" && (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

                <div>
                  <p className="font-semibold text-cyan-300">
                    Work in progress
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Complete the task according to the instructions.
                    When you are finished, submit your work for review.
                  </p>
                </div>

                <div className="mt-6">
                  <SubmitWorkForm
                    assignmentId={assignment.id}
                  />
                </div>

              </div>
            )}

            {/* SUBMITTED */}
            {assignment.status === "SUBMITTED" && (
              <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-400/10 text-purple-300">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-purple-300">
                      Submission under review
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      Your work has been submitted successfully.
                      A reviewer will evaluate it and provide a result.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* COMPLETED */}
            {assignment.status === "COMPLETED" && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-emerald-300">
                      Task completed
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      Your submission has been approved and this
                      assignment is now complete.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* REJECTED */}
            {assignment.status === "REJECTED" && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">

                <p className="font-semibold text-red-300">
                  Assignment rejected
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Your assignment was rejected. Check the reviewer
                  feedback and follow the required next steps.
                </p>

              </div>
            )}

            {/* CANCELLED */}
            {assignment.status === "CANCELLED" && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

                <p className="font-semibold text-gray-300">
                  Assignment cancelled
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  This assignment is no longer active.
                </p>

              </div>
            )}

          </div>

        </section>

      </div>
    </div>
  );
}