import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import TaskMarketplace from "./TaskMarketplace";

export default async function WorkerTasksPage() {
  const session = await auth();

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

  let access = null;

  if (session?.user?.id && session.user.role === "WORKER") {
    const workerAccess = await prisma.workerAccess.findUnique({
      where: {
        workerId: session.user.id,
      },
      select: {
        isUnlocked: true,
        freeTaskLimit: true,
        tasksClaimed: true,
        unlockFee: true,
      },
    });

    if (workerAccess) {
      access = {
        isUnlocked: workerAccess.isUnlocked,
        freeTaskLimit: workerAccess.freeTaskLimit,
        tasksClaimed: workerAccess.tasksClaimed,
        tasksRemaining: workerAccess.isUnlocked
          ? null
          : Math.max(
              workerAccess.freeTaskLimit -
                workerAccess.tasksClaimed,
              0
            ),
        unlockFee: workerAccess.unlockFee.toString(),
      };
    }
  }

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
          <p className="text-sm font-semibold text-cyan-400">
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
          <span className="text-sm text-gray-500">
            Available
          </span>

          <span className="ml-2 font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <TaskMarketplace
        tasks={serializedTasks}
        access={access}
      />
    </div>
  );
}
