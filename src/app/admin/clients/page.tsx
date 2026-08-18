import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage() {
  const clients = await prisma.clientProfile.findMany({
    select: {
      id: true,
      companyName: true,
      website: true,
      description: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const totalClients = clients.length;

  const activeClients = clients.filter(
    (client) => client.user.status === "ACTIVE"
  ).length;

  const pendingClients = clients.filter(
    (client) => client.user.status === "PENDING"
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
            Clients
          </h1>

          <p className="mt-2 text-gray-400">
            Manage businesses using ROFRAAI to access specialized talent.
          </p>
        </div>

        <button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300">
          + Add Client
        </button>

      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <Stat
          label="Total Clients"
          value={totalClients}
        />

        <Stat
          label="Active Clients"
          value={activeClients}
        />

        <Stat
          label="Pending"
          value={pendingClients}
        />

      </div>

      {/* CLIENT TABLE */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-bold">
              Client Accounts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Businesses registered on the platform
            </p>
          </div>

          <input
            type="search"
            placeholder="Search clients..."
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="border-b border-white/10 bg-white/[0.02]">

              <tr className="text-xs uppercase tracking-wider text-gray-500">

                <th className="px-6 py-4">
                  Client
                </th>

                <th className="px-6 py-4">
                  Company
                </th>

                <th className="px-6 py-4">
                  Website
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Joined
                </th>

                <th className="px-6 py-4 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-white/10">

              {clients.map((client) => (

                <tr
                  key={client.id}
                  className="transition hover:bg-white/[0.02]"
                >

                  {/* CLIENT */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-blue-600 font-bold">
                        {client.user.firstName.charAt(0)}
                        {client.user.lastName.charAt(0)}
                      </div>

                      <div>

                        <p className="font-semibold">
                          {client.user.firstName}{" "}
                          {client.user.lastName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {client.user.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* COMPANY */}
                  <td className="px-6 py-5">

                    <div>

                      <p className="font-medium">
                        {client.companyName || "Individual Client"}
                      </p>

                      {client.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                          {client.description}
                        </p>
                      )}

                    </div>

                  </td>

                  {/* WEBSITE */}
                  <td className="px-6 py-5">

                    {client.website ? (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        Visit website →
                      </a>
                    ) : (
                      <span className="text-sm text-gray-600">
                        Not provided
                      </span>
                    )}

                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        client.user.status === "ACTIVE"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : client.user.status === "SUSPENDED"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {client.user.status}
                    </span>

                  </td>

                  {/* JOINED */}
                  <td className="px-6 py-5 text-sm text-gray-400">

                    {new Date(
                      client.createdAt
                    ).toLocaleDateString()}

                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-right">

                    <button className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/[0.05] hover:text-white">
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY STATE */}
        {clients.length === 0 && (

          <div className="px-6 py-16 text-center">

            <div className="text-4xl">
              ◆
            </div>

            <h3 className="mt-4 font-semibold">
              No clients yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Registered client accounts will appear here.
            </p>

          </div>

        )}

      </div>

    </div>
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
