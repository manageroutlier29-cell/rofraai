"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-xl">
              R
            </div>
            <span className="text-2xl font-bold tracking-tight">
              ROFRA<span className="text-cyan-400">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#how" className="hover:text-white transition">
              How it works
            </a>
            <a href="#workers" className="hover:text-white transition">
              For Workers
            </a>
            <a href="#clients" className="hover:text-white transition">
              For Clients
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 transition">
              Login
            </button>

            <button className="px-5 py-2.5 rounded-xl bg-cyan-400 text-[#06101d] font-semibold hover:bg-cyan-300 transition">
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-5 flex flex-col gap-4 text-gray-300">
            <a href="#how">How it works</a>
            <a href="#workers">For Workers</a>
            <a href="#clients">For Clients</a>
            <a href="#about">About</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 text-sm mb-7">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              The AI work platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
              Powering the
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                future of AI.
              </span>
            </h1>

            <p className="mt-7 text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              ROFRAAI connects businesses with skilled people who help
              evaluate, improve and train the next generation of artificial
              intelligence.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <button className="px-7 py-4 rounded-2xl bg-cyan-400 text-[#06101d] font-bold hover:bg-cyan-300 transition shadow-lg shadow-cyan-400/20">
                Start Working →
              </button>

              <button className="px-7 py-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition font-semibold">
                Hire AI Talent
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm text-gray-400">
              <div>
                <strong className="block text-white text-2xl">10K+</strong>
                Workers
              </div>

              <div>
                <strong className="block text-white text-2xl">500+</strong>
                Projects
              </div>

              <div>
                <strong className="block text-white text-2xl">40+</strong>
                Countries
              </div>
            </div>
          </div>

          {/* HERO DASHBOARD CARD */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Worker Dashboard</p>
                  <h3 className="text-xl font-bold mt-1">
                    Welcome back 👋
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
                  <p className="text-gray-400 text-sm">Available Tasks</p>
                  <p className="text-3xl font-bold mt-2">128</p>
                </div>

                <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
                  <p className="text-gray-400 text-sm">Your Earnings</p>
                  <p className="text-3xl font-bold mt-2">$842</p>
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <p className="font-semibold">Recommended Tasks</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on your skills
                    </p>
                  </div>

                  <span className="text-cyan-400 text-sm">View all</span>
                </div>

                <div className="space-y-3">
                  <Task
                    title="AI Response Evaluation"
                    category="AI Training"
                    reward="$18.50"
                  />

                  <Task
                    title="Financial Reasoning Review"
                    category="Finance"
                    reward="$24.00"
                  />

                  <Task
                    title="Data Quality Assessment"
                    category="Data"
                    reward="$12.75"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-gray-500 text-sm mb-6">
            BUILT FOR THE NEXT GENERATION OF AI
          </p>

          <div className="flex flex-wrap justify-center gap-10 md:gap-20 text-gray-400 font-semibold">
            <span>AI TRAINING</span>
            <span>DATA</span>
            <span>FINANCE</span>
            <span>RESEARCH</span>
            <span>QUALITY</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-28">
        <div className="max-w-2xl">
          <p className="text-cyan-400 font-semibold">HOW IT WORKS</p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            One platform.
            <br />
            Endless possibilities.
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Whether you're looking for work or building AI products, ROFRAAI
            gives you the tools to get things done.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          <Feature
            number="01"
            title="Join"
            text="Create your profile and tell us about your skills and expertise."
          />

          <Feature
            number="02"
            title="Work"
            text="Discover projects and complete tasks that match your abilities."
          />

          <Feature
            number="03"
            title="Earn"
            text="Get rewarded for high-quality work and build your reputation."
          />
        </div>
      </section>

      {/* TWO SIDES */}
      <section className="max-w-7xl mx-auto px-6 pb-28 grid lg:grid-cols-2 gap-6">
        <div
          id="workers"
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-10"
        >
          <div className="text-cyan-400 text-4xl mb-6">◉</div>

          <h3 className="text-3xl font-bold">For Workers</h3>

          <p className="text-gray-400 mt-4 leading-relaxed">
            Turn your knowledge into income. Work on AI evaluation, data
            annotation, finance, research and other specialized projects.
          </p>

          <button className="mt-7 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
            Become a Worker
          </button>
        </div>

        <div
          id="clients"
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-10"
        >
          <div className="text-purple-400 text-4xl mb-6">◆</div>

          <h3 className="text-3xl font-bold">For Clients</h3>

          <p className="text-gray-400 mt-4 leading-relaxed">
            Access skilled talent to evaluate AI systems, create datasets,
            review products and complete specialized business tasks.
          </p>

          <button className="mt-7 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
            Start a Project
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-cyan-400/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to build the future?
            </h2>

            <p className="text-gray-400 mt-5 max-w-xl mx-auto">
              Join ROFRAAI and become part of a global network powering the
              next generation of artificial intelligence.
            </p>

            <button className="mt-8 px-8 py-4 rounded-2xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition">
              Get Started →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="about"
        className="border-t border-white/10 py-10"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="font-bold text-xl">
              ROFRA<span className="text-cyan-400">AI</span>
            </div>

            <p className="text-gray-500 text-sm mt-2">
              Building the workforce behind AI.
            </p>
          </div>

          <div className="text-gray-500 text-sm">
            © 2026 ROFRAAI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

function Task({
  title,
  category,
  reward,
}: {
  title: string;
  category: string;
  reward: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{category}</p>
      </div>

      <span className="text-cyan-400 font-semibold text-sm whitespace-nowrap">
        {reward}
      </span>
    </div>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:bg-white/[0.06] transition">
      <div className="text-cyan-400 text-sm font-bold">{number}</div>

      <h3 className="text-2xl font-bold mt-8">{title}</h3>

      <p className="text-gray-400 mt-4 leading-relaxed">{text}</p>
    </div>
  );
}