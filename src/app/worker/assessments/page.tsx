"use client";

import Link from "next/link";

const assessments = [
  {
    title: "AI Response Evaluation",
    category: "AI Training",
    difficulty: "Intermediate",
    questions: 20,
    duration: "25 min",
    status: "Available",
  },
  {
    title: "Financial Reasoning",
    category: "Finance",
    difficulty: "Advanced",
    questions: 25,
    duration: "35 min",
    status: "Available",
  },
  {
    title: "Data Quality Assessment",
    category: "Data",
    difficulty: "Beginner",
    questions: 15,
    duration: "20 min",
    status: "Available",
  },
];

export default function AssessmentsPage() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link
              href="/worker"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              ← Worker Dashboard
            </Link>

            <h1 className="text-4xl font-bold mt-4">
              Assessments
            </h1>

            <p className="text-gray-400 mt-2">
              Complete assessments to unlock more projects and increase your earning opportunities.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-6 py-4">
            <p className="text-sm text-gray-400">
              Your assessment score
            </p>
            <p className="text-3xl font-bold text-cyan-400 mt-1">
              86%
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-semibold">
                Worker Qualification Progress
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Complete assessments to unlock specialized projects.
              </p>
            </div>

            <span className="text-cyan-400 font-semibold">
              3 / 5
            </span>
          </div>

          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[60%] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
          </div>
        </div>

        {/* ASSESSMENTS */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Available Assessments
              </h2>
              <p className="text-gray-500 mt-1">
                Choose an assessment that matches your skills.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {assessments.length} available
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 hover:bg-white/[0.07] hover:border-cyan-400/30 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 text-xl">
                    ✓
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs bg-green-400/10 text-green-400 border border-green-400/20">
                    {assessment.status}
                  </span>
                </div>

                <p className="text-cyan-400 text-sm font-medium mt-6">
                  {assessment.category}
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {assessment.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">
                    {assessment.difficulty}
                  </span>

                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">
                    {assessment.questions} questions
                  </span>

                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">
                    {assessment.duration}
                  </span>
                </div>

                <button className="w-full mt-7 py-3 rounded-xl bg-cyan-400 text-[#06101d] font-bold hover:bg-cyan-300 transition">
                  Start Assessment →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Assessment History
          </h2>

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden">
            <div className="grid grid-cols-4 px-6 py-4 border-b border-white/10 text-sm text-gray-500">
              <span>Assessment</span>
              <span>Score</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            <div className="grid grid-cols-4 px-6 py-5 text-sm">
              <span>English Communication</span>
              <span className="text-cyan-400 font-semibold">92%</span>
              <span className="text-gray-400">Aug 15, 2026</span>
              <span className="text-green-400">Passed</span>
            </div>

            <div className="grid grid-cols-4 px-6 py-5 border-t border-white/10 text-sm">
              <span>AI Fundamentals</span>
              <span className="text-cyan-400 font-semibold">84%</span>
              <span className="text-gray-400">Aug 12, 2026</span>
              <span className="text-green-400">Passed</span>
            </div>
          </div>
        </section>

        {/* INFO */}
        <div className="mt-10 rounded-3xl border border-purple-400/20 bg-purple-400/5 p-7">
          <h3 className="font-bold text-lg">
            Why assessments matter
          </h3>

          <p className="text-gray-400 mt-2 leading-relaxed">
            Assessments help ROFRAAI match you with projects that fit your
            expertise. Higher qualification levels can unlock specialized
            projects, higher-value tasks and more earning opportunities.
          </p>
        </div>

      </div>
    </div>
  );
}