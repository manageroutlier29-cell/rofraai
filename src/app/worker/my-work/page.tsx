import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MyWorkPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6 sm:p-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="mt-3 text-gray-400">
            Please sign in to view your assigned work.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-[#06101d] hover:bg-cyan-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      workerId: session.user.id,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const pending = assignments.filter(
    (item) => item.status === "PENDING"
  );

  const active = assignments.filter(
    (item) => item.status === "ACCEPTED" || item.status === "IN_PROGRESS"
  );

  const submitted = assignments.filter(
    (item) => item.status === "SUBMITTED"
  );

  const completed = assignments.filter(
    (item) => item.status === "COMPLETED"
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "No deadline";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "ACCEPTED":
        return "Ready";
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
        return status;
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";

      case "SUBMITTED":
        return "bg-purple-400/10 text-purple-300 border-purple-400/20";

      case "IN_PROGRESS":
      case "ACCEPTED":
        return "bg-cyan-400/10 text-cyan-300 border-cyan-400/20";

      case "PENDING":
        return "bg-yellow-400/10 text-yellow-300 border-yellow-400/20";

      default:
        return "bg-white/5 text-gray-400 border-white/10";
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#07111f]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Worker Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              My Work
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Manage the tasks you have claimed, continue active work,
              and track submitted assignments.
            </p>
          </div>

          <Link
            href="/worker/tasks"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#06101d] transition hover:bg-cyan-300"
          >
            Browse Tasks →
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Assignments"
            value={assignments.length}
            icon="◈"
          />

          <StatCard
            label="Pending"
            value={pending.length}
            icon="◷"
          />

          <StatCard
            label="In Progress"
            value={active.length}
            icon="⚡"
          />

          <StatCard
            label="Completed"
            value={completed.length}
            icon="✓"
          />
        </div>

        {/* Active work */}
        <section className="mt-10">
          <SectionHeading
            title="Active Work"
            description="Tasks currently assigned to you."
            count={active.length}
          />

          {active.length === 0 ? (
            <EmptyState
              title="No active work"
              text="Claim an available task to start building your work history."
              href="/worker/tasks"
              button="Find Tasks"
            />
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {active.map((assignment) => (
                <WorkCard
                  key={assignment.id}
                  assignment={assignment}
                  formatDate={formatDate}
                  statusLabel={statusLabel}
                  statusClass={statusClass}
                  action="Continue Work"
                />
              ))}
            </div>
          )}
        </section>

        {/* Pending */}
        <section className="mt-10">
          <SectionHeading
            title="Pending Assignments"
            description="Assignments waiting to be started."
            count={pending.length}
          />

          {pending.length === 0 ? (
            <EmptyState
              title="Nothing waiting"
              text="You don't have any pending assignments."
            />
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {pending.map((assignment) => (
                <WorkCard
                  key={assignment.id}
                  assignment={assignment}
                  formatDate={formatDate}
                  statusLabel={statusLabel}
                  statusClass={statusClass}
                  action="Start Work"
                />
              ))}
            </div>
          )}
        </section>

        {/* Submitted */}
        <section className="mt-10">
          <SectionHeading
            title="Submitted Work"
            description="Assignments currently going through review."
            count={submitted.length}
          />

          {submitted.length === 0 ? (
            <EmptyState
              title="No submitted work"
              text="Completed submissions will appear here while they are being reviewed."
            />
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {submitted.map((assignment) => (
                <WorkCard
                  key={assignment.id}
                  assignment={assignment}
                  formatDate={formatDate}
                  statusLabel={statusLabel}
                  statusClass={statusClass}
                  action="View Submission"
                />
              ))}
            </div>
          )}
        </section>

        {/* Completed */}
        <section className="mt-10">
          <SectionHeading
            title="Completed Work"
            description="Your successfully completed assignments."
            count={completed.length}
          />

          {completed.length === 0 ? (
            <EmptyState
              title="No completed work yet"
              text="Your completed assignments will appear here."
            />
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {completed.map((assignment) => (
                <WorkCard
                  key={assignment.id}
                  assignment={assignment}
                  formatDate={formatDate}
                  statusLabel={statusLabel}
                  statusClass={statusClass}
                  action="View Details"
                />
              ))}
            </div>
          )}
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
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  );
}

function SectionHeading({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
        {count}
      </span>
    </div>
  );
}

function EmptyState({
  title,
  text,
  href,
  button,
}: {
  title: string;
  text: string;
  href?: string;
  button?: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl text-gray-500">
        ◈
      </div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        {text}
      </p>

      {href && button && (
        <Link
          href={href}
          className="mt-5 inline-flex rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/20"
        >
          {button}
        </Link>
      )}
    </div>
  );
}

function WorkCard({
  assignment,
  formatDate,
  statusLabel,
  statusClass,
  action,
}: {
  assignment: {
    id: string;
    status: string;
    task: {
      id: string;
      title: string;
      description: string;
      category: string;
      reward: unknown;
      deadline: Date | null;
      project: {
        title: string;
      };
    };
  };
  formatDate: (date: Date | null) => string;
  statusLabel: (status: string) => string;
  statusClass: (status: string) => string;
  action: string;
}) {
  const reward = Number(assignment.task.reward).toFixed(2);

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/20 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
            {assignment.task.category}
          </p>

          <h3 className="mt-2 text-lg font-bold">
            {assignment.task.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {assignment.task.project.title}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
            assignment.status
          )}`}
        >
          {statusLabel(assignment.status)}
        </span>
      </div>

      <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-gray-400">
        {assignment.task.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="text-xs text-gray-500">Reward</p>
          <p className="mt-1 font-semibold text-emerald-300">
            ${reward}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Deadline</p>
          <p className="mt-1 text-sm font-medium">
            {formatDate(assignment.task.deadline)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={`/worker/my-work/${assignment.id}`}
          className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
        >
          {action} →
        </Link>
      </div>
    </div>
  );
}