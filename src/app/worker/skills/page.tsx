"use client";

import { useState } from "react";
import Link from "next/link";

const initialSkills = [
  {
    name: "Accounting",
    category: "Finance",
    level: "Advanced",
    score: 94,
    verified: true,
  },
  {
    name: "Financial Analysis",
    category: "Finance",
    level: "Advanced",
    score: 91,
    verified: true,
  },
  {
    name: "AI Evaluation",
    category: "AI & Data",
    level: "Intermediate",
    score: 88,
    verified: true,
  },
  {
    name: "Data Review",
    category: "AI & Data",
    level: "Intermediate",
    score: 84,
    verified: false,
  },
  {
    name: "Research",
    category: "Research",
    level: "Intermediate",
    score: 82,
    verified: false,
  },
  {
    name: "Excel",
    category: "Business",
    level: "Advanced",
    score: 90,
    verified: true,
  },
];

const recommendedSkills = [
  "Prompt Evaluation",
  "Data Annotation",
  "Financial Modeling",
  "Statistics",
  "AI Safety",
  "Market Research",
];

export default function WorkerSkills() {
  const [skills, setSkills] = useState(initialSkills);
  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [category, setCategory] = useState("Finance");
  const [level, setLevel] = useState("Intermediate");

  function addSkill() {
    const trimmed = newSkill.trim();

    if (!trimmed) return;

    const exists = skills.some(
      (skill) => skill.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) return;

    setSkills([
      ...skills,
      {
        name: trimmed,
        category,
        level,
        score: 0,
        verified: false,
      },
    ]);

    setNewSkill("");
    setShowAdd(false);
  }

  function removeSkill(name: string) {
    setSkills(skills.filter((skill) => skill.name !== name));
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Worker / Skills</p>

            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Skills & Expertise
            </h1>
          </div>

          <Link
            href="/worker"
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition text-sm"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* INTRO */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-7 md:p-9">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-cyan-400/10 blur-3xl rounded-full" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
                🧠 Skill profile
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mt-4">
                Show what you can do.
              </h2>

              <p className="text-gray-400 max-w-2xl mt-3 leading-relaxed">
                Your skills help ROFRAAI match you with projects and tasks
                that fit your experience. Add accurate skills and complete
                assessments to become eligible for more opportunities.
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="shrink-0 px-6 py-3.5 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
            >
              + Add Skill
            </button>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="grid sm:grid-cols-3 gap-4 mt-6">
          <SummaryCard
            label="Total Skills"
            value={String(skills.length)}
            icon="🧠"
          />

          <SummaryCard
            label="Verified Skills"
            value={String(skills.filter((skill) => skill.verified).length)}
            icon="✓"
          />

          <SummaryCard
            label="Profile Match"
            value="87%"
            icon="⚡"
          />
        </section>

        {/* SKILLS */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                Your expertise
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Current skills
              </h2>
            </div>

            <span className="text-sm text-gray-500">
              {skills.length} skills added
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-7">
            {skills.map((skill) => (
              <SkillCard
                key={skill.name}
                {...skill}
                onRemove={() => removeSkill(skill.name)}
              />
            ))}
          </div>
        </section>

        {/* RECOMMENDED */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
          <div>
            <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
              Recommended
            </p>

            <h2 className="text-2xl font-bold mt-1">
              Skills that could unlock more work
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Based on the types of projects available on ROFRAAI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {recommendedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setNewSkill(skill);
                  setShowAdd(true);
                }}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:bg-cyan-400/5 transition text-sm text-gray-300"
              >
                + {skill}
              </button>
            ))}
          </div>
        </section>

        {/* VERIFICATION */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center text-green-400 text-xl">
              ✓
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Verified skills get priority
              </h2>

              <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
                Some ROFRAAI projects require verified expertise. Complete
                assessments associated with your skills to demonstrate your
                knowledge and unlock additional project categories.
              </p>

              <Link
                href="/worker/assessments"
                className="inline-block mt-5 px-5 py-2.5 rounded-xl border border-green-400/20 bg-green-400/5 text-green-400 hover:bg-green-400/10 transition text-sm font-semibold"
              >
                View Assessments →
              </Link>
            </div>
          </div>
        </section>

        {/* ADD SKILL MODAL */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b1728] shadow-2xl p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                    Add expertise
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Add a new skill
                  </h2>
                </div>

                <button
                  onClick={() => setShowAdd(false)}
                  className="w-9 h-9 rounded-lg hover:bg-white/10 text-gray-400"
                >
                  ✕
                </button>
              </div>

              <div className="mt-7">
                <label className="text-sm text-gray-400">
                  Skill name
                </label>

                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. Financial Modeling"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] outline-none focus:border-cyan-400/50 transition"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="text-sm text-gray-400">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-white/10 bg-[#101d30] outline-none"
                  >
                    <option>Finance</option>
                    <option>AI & Data</option>
                    <option>Research</option>
                    <option>Business</option>
                    <option>Technology</option>
                    <option>Languages</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Experience level
                  </label>

                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-white/10 bg-[#101d30] outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/[0.06] transition font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={addSkill}
                  className="flex-1 px-5 py-3 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 transition font-bold"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-white/10 flex justify-between text-xs text-gray-600">
          <span>ROFRAAI Worker Platform</span>
          <span>Skills & Expertise</span>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>

        <span className="text-xs text-gray-600">Updated now</span>
      </div>

      <p className="text-sm text-gray-500 mt-5">{label}</p>

      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
}

function SkillCard({
  name,
  category,
  level,
  score,
  verified,
  onRemove,
}: {
  name: string;
  category: string;
  level: string;
  score: number;
  verified: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-black/10 p-5 hover:border-cyan-400/20 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
            {name.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{name}</h3>

              {verified && (
                <span className="text-green-400 text-xs">✓</span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {category} • {level}
            </p>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition text-sm"
          title="Remove skill"
        >
          ✕
        </button>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-500">
            {verified ? "Verified proficiency" : "Assessment required"}
          </span>

          <span className="text-gray-400">
            {score > 0 ? `${score}%` : "Not assessed"}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}