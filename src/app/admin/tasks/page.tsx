import { prisma } from "@/lib/prisma";

export default async function AdminTasksPage() {
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      reward: true,
      status: true,
      deadline: true,
      createdAt: true,
      project: {
        select: {
          id: true,
          title: true,
          client: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              clientProfile: {
                select: {
                  companyName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const total = tasks.length;

  const available = tasks.filter(
    (task) => task.status === "AVAILABLE"
  ).length;

  const assigned = tasks.filter(
    (task) => task.status === "ASSIGNED"
  ).length;

  const review = tasks.filter(
    (task) => task.status === "REVIEW"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return (
    <div className="p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm text-gray-500">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Task Operations
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor, manage and distribute work across the ROFRAAI network.
          </p>
        </div>

        <button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300">
          + Create Task
        </button>

      </div>

      {/* STATS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <Stat
          label="Total Tasks"
          value={total}
        />

        <Stat
          label="Available"
          value={available}
        />

        <Stat
          label="Assigned"
          value={assigned}
        />

        <Stat
          label="In Review"
          value={review}
        />

        <Stat
          label="Completed"
          value={completed}
        />

      </div>

      {/* TASK TABLE */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-bold">
              Task Queue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All tasks currently managed by ROFRAAI.
            </p>
          </div>

          <input
            type="search"
            placeholder="Search tasks..."
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px] text-left">

            <thead className="border-b border-white/10 bg-white/[0.02]">

              <tr className="text-xs uppercase tracking-wider text-gray-500">

                <th className="px-6 py-4">
                  Task
                </th>

                <th className="px-6 py-4">
                  Project
                </th>

                <th className="px-6 py-4">
                  Client
                </th>

                <th className="px-6 py-4">
                  Category
                </th>

                <th className="px-6 py-4">
                  Reward
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Deadline
                </th>

                <th className="px-6 py-4 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-white/10">

              {tasks.map((task) => {

                const clientName =
                  task.project.client.clientProfile?.companyName ||
                  `${task.project.client.firstName} ${task.project.client.lastName}`;

                return (
                  <tr
                    key={task.id}
                    className="transition hover:bg-white/[0.02]"
                  >

                    {/* TASK */}

                    <td className="px-6 py-5">

                      <div className="max-w-xs">

                        <p className="font-semibold">
                          {task.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {task.description}
                        </p>

                      </div>

                    </td>

                    {/* PROJECT */}

                    <td className="px-6 py-5">

                      <p className="max-w-[180px] truncate text-sm text-gray-300">
                        {task.project.title}
                      </p>

                    </td>

                    {/* CLIENT */}

                    <td className="px-6 py-5">

                      <div>

                        <p className="text-sm font-medium">
                          {clientName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {task.project.client.email}
                        </p>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="px-6 py-5">

                      <span className="rounded-full bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-400">
                        {task.category}
                      </span>

                    </td>

                    {/* REWARD */}

                    <td className="px-6 py-5">

                      <span className="font-semibold text-cyan-400">
                        ${Number(task.reward).toFixed(2)}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <StatusBadge status={task.status} />

                    </td>

                    {/* DEADLINE */}

                    <td className="px-6 py-5 text-sm text-gray-400">

                      {task.deadline
                        ? new Date(
                            task.deadline
                          ).toLocaleDateString()
                        : "No deadline"}

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5 text-right">

                      <button className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/[0.05] hover:text-white">
                        View
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* EMPTY STATE */}

        {tasks.length === 0 && (

          <div className="px-6 py-16 text-center">

            <div className="text-4xl">
              ◇
            </div>

            <h3 className="mt-4 font-semibold">
              No tasks yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Tasks created under projects will appear here.
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
    DRAFT: "bg-gray-400/10 text-gray-400",
    AVAILABLE: "bg-cyan-400/10 text-cyan-400",
    ASSIGNED: "bg-blue-400/10 text-blue-400",
    IN_PROGRESS: "bg-indigo-400/10 text-indigo-400",
    SUBMITTED: "bg-purple-400/10 text-purple-400",
    REVIEW: "bg-amber-400/10 text-amber-400",
    COMPLETED: "bg-emerald-400/10 text-emerald-400",
    CANCELLED: "bg-red-400/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-400/10 text-gray-400"
      }`}
    >
      {status.replace("_", " ")}
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
        {value.toLocaleString()}
      </p>

    </div>
  );
}
