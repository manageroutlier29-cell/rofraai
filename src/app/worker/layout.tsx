"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/worker", icon: "⌂" },
  { name: "Profile", href: "/worker/profile", icon: "◯" },
  { name: "Skills", href: "/worker/skills", icon: "✦" },
  { name: "Assessments", href: "/worker/assessments", icon: "✓" },
  { name: "Projects", href: "/worker/projects", icon: "▣" },
  { name: "Tasks", href: "/worker/tasks", icon: "☷" },
  { name: "My Work", href: "/worker/my-work", icon: "◈" },
  { name: "Submissions", href: "/worker/submissions", icon: "↑" },
  { name: "Reviews", href: "/worker/reviews", icon: "★" },
  { name: "Earnings", href: "/worker/earnings", icon: "$" },
  { name: "Settings", href: "/worker/settings", icon: "⚙" },
];

export default function WorkerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-[#081321] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black text-[#06101d]">
              R
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                ROFRA<span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Worker Portal
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Workspace
            </p>

            <div className="space-y-1">
              {navigation.map((item) => {
                const active =
                  item.href === "/worker"
                    ? pathname === "/worker"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-base ${
                        active
                          ? "bg-cyan-400/15 text-cyan-300"
                          : "bg-white/5 text-gray-500 group-hover:text-gray-300"
                      }`}
                    >
                      {item.icon}
                    </span>

                    {item.name}

                    {item.name === "Tasks" && (
                      <span className="ml-auto rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-bold text-[#06101d]">
                        24
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Worker profile */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 font-bold">
                RW
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  Worker Account
                </p>
                <p className="text-xs text-gray-500">Freelancer</p>
              </div>

              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#07111f]/90 px-5 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-gray-300 hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">Worker Portal</p>
            <p className="font-semibold">Your workspace</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              🔔
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
            </button>

            <div className="hidden h-8 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">Worker</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-sm font-bold">
                W
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
