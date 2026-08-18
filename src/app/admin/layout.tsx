"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "⌂",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: "◉",
  },
  {
    name: "Clients",
    href: "/admin/clients",
    icon: "◆",
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: "▣",
  },
  {
    name: "Tasks",
    href: "/admin/tasks",
    icon: "✓",
  },
  {
    name: "Assessments",
    href: "/admin/assessments",
    icon: "◈",
  },
  {
    name: "Quality",
    href: "/admin/quality",
    icon: "★",
  },
  {
  name: "Reviews",
  href: "/admin/reviews",
  icon: "✎",
},
  {
    name: "Payments",
    href: "/admin/payments",
    icon: "$",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-[#081321] lg:block">

        {/* LOGO */}
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black">
            R
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight">
              ROFRA<span className="text-cyan-400">AI</span>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Admin Console
            </p>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="px-4 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            Management
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >

                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                      active
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "bg-white/[0.03] text-gray-500 group-hover:text-gray-300"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {item.name}

                </Link>
              );
            })}

          </div>

        </nav>

        {/* ADMIN PROFILE */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 font-bold text-[#07111f]">
              A
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold">
                Administrator
              </p>

              <p className="truncate text-xs text-gray-500">
                Platform Admin
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#07111f]/95 px-5 backdrop-blur-xl lg:hidden">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 font-black">
            R
          </div>

          <div>
            <span className="font-bold">
              ROFRA<span className="text-cyan-400">AI</span>
            </span>

            <span className="ml-2 text-xs text-gray-500">
              Admin
            </span>
          </div>

        </div>

      </header>

      {/* MAIN */}
      <div className="lg:ml-64">

        <main className="min-h-screen">
          {children}
        </main>

      </div>

    </div>
  );
}
