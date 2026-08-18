"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState("WORKER");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute right-[-200px] top-[-100px] h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[140px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black">
                R
              </div>

              <span className="text-2xl font-bold">
                ROFRA<span className="text-cyan-400">AI</span>
              </span>
            </Link>

            <div className="max-w-xl">
              <p className="font-semibold text-cyan-400">
                JOIN ROFRAAI
              </p>

              <h1 className="mt-4 text-5xl font-black leading-tight">
                Build the workforce behind
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  intelligent systems.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                Whether you are a skilled professional looking for
                opportunities or a business looking for specialized talent,
                ROFRAAI connects you to the right ecosystem.
              </p>

              <div className="mt-10 space-y-4">
                <Benefit text="Access specialized AI projects" />
                <Benefit text="Build your professional reputation" />
                <Benefit text="Connect with global opportunities" />
              </div>
            </div>

            <p className="text-sm text-gray-500">
              © 2026 ROFRAAI. All rights reserved.
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black">
                R
              </div>

              <span className="text-2xl font-bold">
                ROFRA<span className="text-cyan-400">AI</span>
              </span>
            </Link>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl md:p-10">
              <h2 className="text-3xl font-bold">
                Create your account
              </h2>

              <p className="mt-2 text-gray-400">
                Join the ROFRAAI ecosystem.
              </p>

              {/* ROLE */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-gray-300">
                  I want to...
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <RoleButton
                    active={role === "WORKER"}
                    title="Find Work"
                    description="I'm a freelancer"
                    onClick={() => setRole("WORKER")}
                  />

                  <RoleButton
                    active={role === "CLIENT"}
                    title="Hire Talent"
                    description="I'm a client"
                    onClick={() => setRole("CLIENT")}
                  />
                </div>
              </div>

              {/* FORM */}
              <form className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      First name
                    </label>

                    <input
                      type="text"
                      placeholder="Robert"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Last name
                    </label>

                    <input
                      type="text"
                      placeholder="Waweru"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Email address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 pr-20 outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                  />

                  <span>
                    I agree to the ROFRAAI{" "}
                    <span className="text-cyan-400">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-cyan-400">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 py-3.5 font-bold text-[#06101d] transition hover:bg-cyan-300"
                >
                  Create Account
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-white"
              >
                ← Back to ROFRAAI
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function RoleButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-cyan-400/50 bg-cyan-400/10"
          : "border-white/10 bg-black/20 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>

        <span
          className={`h-3 w-3 rounded-full ${
            active ? "bg-cyan-400" : "bg-white/10"
          }`}
        />
      </div>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </button>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-300">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
        ✓
      </span>

      <span>{text}</span>
    </div>
  );
}