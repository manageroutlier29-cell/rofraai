import { prisma } from "@/lib/prisma";
import TaskMarketplace from "./TaskMarketplace";

export default async function WorkerTasksPage() {
  const tasks = await prisma.task.findMany({
    where: {
      status: "AVAILABLE",
    },
    include: {
      project: {
        select: {
          title: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    reward: task.reward.toString(),
    deadline: task.deadline?.toISOString() ?? null,
    projectTitle: task.project.title,
    projectCategory: task.project.category,
  }));

  return (
    <div className="p-6 lg:p-8">

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm text-cyan-400 font-semibold">
            MARKETPLACE
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Available Tasks
          </h1>

          <p className="mt-2 text-gray-400">
            Find projects that match your skills and start earning.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="text-gray-500 text-sm">
            Available
          </span>

          <span className="ml-2 font-bold">
            {tasks.length}
          </span>
        </div>

      </div>

      <TaskMarketplace tasks={serializedTasks} />

    </div>
  );
}