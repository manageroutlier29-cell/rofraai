"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute left-[-200px] top-[-100px] h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[140px]" />

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
                WELCOME BACK
              </p>

              <h1 className="mt-4 text-5xl font-black leading-tight">
                Continue building the
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  future of AI.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                Access your projects, tasks, workforce and opportunities from
                one powerful platform.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <InfoCard value="10K+" label="Workers" />
                <InfoCard value="500+" label="Projects" />
              </div>
            </div>

            <p className="text-sm text-gray-500">
              © 2026 ROFRAAI. All rights reserved.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
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
              <div>
                <h2 className="text-3xl font-bold">
                  Welcome back
                </h2>

                <p className="mt-2 text-gray-400">
                  Sign in to your ROFRAAI account.
                </p>
              </div>

              <form className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Email address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
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

                <label className="flex items-center gap-3 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-black/20"
                  />

                  Remember me
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 py-3.5 font-bold text-[#06101d] transition hover:bg-cyan-300"
                >
                  Sign In
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-gray-600">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 font-medium transition hover:bg-white/10">
                <span className="text-lg">G</span>
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Create one
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

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}