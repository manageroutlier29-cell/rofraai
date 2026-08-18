import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const totalUsers = users.length;
  const workers = users.filter((user) => user.role === "WORKER").length;
  const clients = users.filter((user) => user.role === "CLIENT").length;
  const pending = users.filter((user) => user.status === "PENDING").length;

  return (
    <div className="p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>
          <p className="text-sm text-gray-500">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Users
          </h1>

          <p className="mt-2 text-gray-400">
            Manage workers, clients and platform accounts.
          </p>
        </div>

        <button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300">
          + Add User
        </button>

      </div>

      {/* STATISTICS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          label="Total Users"
          value={totalUsers}
        />

        <Stat
          label="Workers"
          value={workers}
        />

        <Stat
          label="Clients"
          value={clients}
        />

        <Stat
          label="Pending"
          value={pending}
        />

      </div>

      {/* USERS TABLE */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-bold">
              Platform Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest registered accounts
            </p>
          </div>

          <input
            type="search"
            placeholder="Search users..."
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="border-b border-white/10 bg-white/[0.02]">

              <tr className="text-xs uppercase tracking-wider text-gray-500">

                <th className="px-6 py-4">
                  User
                </th>

                <th className="px-6 py-4">
                  Role
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

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="transition hover:bg-white/[0.02]"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 font-bold text-[#07111f]">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>

                      <div>

                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {user.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "CLIENT"
                          ? "bg-purple-400/10 text-purple-400"
                          : user.role === "ADMIN"
                            ? "bg-cyan-400/10 text-cyan-400"
                            : "bg-blue-400/10 text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : user.status === "SUSPENDED"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {user.status}
                    </span>

                  </td>

                  <td className="px-6 py-5 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

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

        {users.length === 0 && (
          <div className="px-6 py-16 text-center">

            <div className="text-4xl">
              ◉
            </div>

            <h3 className="mt-4 font-semibold">
              No users yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Registered users will appear here.
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
