import { prisma } from "@/lib/prisma";
import CreateProjectModal from "./CreateProjectModal";
import DeleteProjectButton from "./DeleteProjectButton";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      budget: true,
      status: true,
      deadline: true,
      createdAt: true,
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
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const totalProjects = projects.length;

  const openProjects = projects.filter(
    (project) => project.status === "OPEN"
  ).length;

  const activeProjects = projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
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
            Projects
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor and manage projects across the ROFRAAI marketplace.
          </p>
        </div>

        <CreateProjectModal />

      </div>

      {/* STATISTICS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          label="Total Projects"
          value={totalProjects}
        />

        <Stat
          label="Open"
          value={openProjects}
        />

        <Stat
          label="In Progress"
          value={activeProjects}
        />

        <Stat
          label="Completed"
          value={completedProjects}
        />

      </div>

      {/* PROJECT TABLE */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-bold">
              Marketplace Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Projects submitted by ROFRAAI clients
            </p>
          </div>

          <input
            type="search"
            placeholder="Search projects..."
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left">

            <thead className="border-b border-white/10 bg-white/[0.02]">

              <tr className="text-xs uppercase tracking-wider text-gray-500">

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
                  Budget
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

              {projects.map((project) => (

                <tr
                  key={project.id}
                  className="transition hover:bg-white/[0.02]"
                >

                  {/* PROJECT */}

                  <td className="px-6 py-5">

                    <div className="max-w-xs">

                      <p className="font-semibold">
                        {project.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {project.description}
                      </p>

                    </div>

                  </td>

                  {/* CLIENT */}

                  <td className="px-6 py-5">

                    <div>

                      <p className="font-medium">

                        {project.client.clientProfile?.companyName ||
                          `${project.client.firstName} ${project.client.lastName}`}

                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {project.client.email}
                      </p>

                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td className="px-6 py-5">

                    <span className="rounded-full bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-400">
                      {project.category}
                    </span>

                  </td>

                  {/* BUDGET */}

                  <td className="px-6 py-5">

                    <span className="font-semibold text-cyan-400">
                      ${Number(project.budget).toLocaleString()}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-5">

                    <StatusBadge status={project.status} />

                  </td>

                  {/* DEADLINE */}

                  <td className="px-6 py-5 text-sm text-gray-400">

                    {project.deadline
                      ? new Date(
                          project.deadline
                        ).toLocaleDateString()
                      : "No deadline"}

                  </td>

                  {/* ACTION */}

                  <td className="px-6 py-5 text-right">

                    <button className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/[0.05] hover:text-white">
                      View
                    </button>

                    <DeleteProjectButton
    projectId={project.id}
    projectTitle={project.title}
  />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY STATE */}

        {projects.length === 0 && (

          <div className="px-6 py-16 text-center">

            <div className="text-4xl">
              ◈
            </div>

            <h3 className="mt-4 font-semibold">
              No projects yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Client projects will appear here once they are created.
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
    OPEN: "bg-cyan-400/10 text-cyan-400",
    IN_PROGRESS: "bg-blue-400/10 text-blue-400",
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
