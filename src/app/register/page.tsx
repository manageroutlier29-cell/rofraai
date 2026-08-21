"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("WORKER");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Unable to create your account.");
        setLoading(false);
        return;
      }

      /*
       * Registration succeeded.
       * Sign the new user in immediately.
       */
      const loginResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!loginResult || loginResult.error) {
        setError(
          "Your account was created successfully. Please sign in manually."
        );
        setLoading(false);
        return;
      }

      /*
       * Retrieve the newly created session so we can
       * redirect according to the user's platform role.
       */
      const sessionResponse = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });

      if (!sessionResponse.ok) {
        router.push("/login");
        return;
      }

      const session = await sessionResponse.json();
      const userRole = session?.user?.role;

      if (userRole === "WORKER") {
        router.push("/worker");
        return;
      }

      if (userRole === "CLIENT") {
        router.push("/for-clients");
        return;
      }

      if (userRole === "ADMIN") {
        router.push("/admin");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

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
              <p className="font-semibold text-cyan-400">JOIN ROFRAAI</p>

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
              <h2 className="text-3xl font-bold">Create your account</h2>

              <p className="mt-2 text-gray-400">
                Join the ROFRAAI ecosystem.
              </p>

              {error && (
                <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-400">
                  {error}
                </div>
              )}

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
                    disabled={loading}
                  />

                  <RoleButton
                    active={role === "CLIENT"}
                    title="Hire Talent"
                    description="I'm a client"
                    onClick={() => setRole("CLIENT")}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* FORM */}
              <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="Robert"
                      autoComplete="given-name"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none placeholder:text-gray-600 focus:border-cyan-400/50 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Waweru"
                      autoComplete="family-name"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none placeholder:text-gray-600 focus:border-cyan-400/50 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none placeholder:text-gray-600 focus:border-cyan-400/50 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 pr-20 outline-none placeholder:text-gray-600 focus:border-cyan-400/50 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white disabled:opacity-50"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* TERMS */}
                <label className="flex items-start gap-3 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    disabled={loading}
                    className="mt-1 h-4 w-4"
                  />

                  <span>
  I agree to the ROFRAAI{" "}
  <Link
    href="/terms"
    target="_blank"
    className="text-cyan-400 hover:text-cyan-300 underline"
  >
    Terms of Service
  </Link>{" "}
  and{" "}
  <Link
    href="/privacy"
    target="_blank"
    className="text-cyan-400 hover:text-cyan-300 underline"
  >
    Privacy Policy
  </Link>
  .
</span>
                </label>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-cyan-400 py-3.5 font-bold text-[#06101d] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
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
  disabled,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-cyan-400/50 bg-cyan-400/10"
          : "border-white/10 bg-black/20 hover:bg-white/5"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>

        <span
          className={`h-3 w-3 rounded-full ${
            active ? "bg-cyan-400" : "bg-white/10"
          }`}
        />
      </div>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </button>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
        ✓
      </div>

      <span className="text-gray-300">{text}</span>
    </div>
  );
}