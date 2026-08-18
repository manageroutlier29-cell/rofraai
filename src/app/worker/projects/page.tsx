"use client";

import { useState } from "react";
import Link from "next/link";

const projects = [
  {
    title: "AI Response Evaluation",
    client: "AI Research Project",
    category: "AI Training",
    description:
      "Evaluate AI-generated responses for accuracy, relevance, reasoning and overall quality.",
    pay: "$18–$25/hr",
    tasks: "120 tasks available",
    difficulty: "Intermediate",
    skills: ["AI Evaluation", "English", "Critical Thinking"],
    recommended: true,
  },
  {
    title: "Financial Reasoning Review",
    client: "Finance AI Research",
    category: "Finance",
    description:
      "Review AI answers to financial questions and evaluate calculations, assumptions and reasoning.",
    pay: "$22–$35/hr",
    tasks: "68 tasks available",
    difficulty: "Advanced",
    skills: ["Finance", "Accounting", "Economics"],
    recommended: true,
  },
  {
    title: "Data Quality Assessment",
    client: "Data Intelligence",
    category: "Data",
    description:
      "Review datasets and identify errors, inconsistencies and quality issues.",
    pay: "$12–$18/hr",
    tasks: "240 tasks available",
    difficulty: "Beginner",
    skills: ["Data Review", "Attention to Detail"],
    recommended: false,
  },
  {
    title: "Business Research Project",
    client: "Market Intelligence",
    category: "Research",
    description:
      "Research companies, markets and industries and organize findings into structured datasets.",
    pay: "$15–$24/hr",
    tasks: "94 tasks available",
    difficulty: "Intermediate",
    skills: ["Research", "Business", "Analysis"],
    recommended: false,
  },
  {
    title: "AI Writing Quality Review",
    client: "Language AI",
    category: "AI Training",
    description:
      "Review AI-generated content for clarity, grammar, accuracy and usefulness.",
    pay: "$14–$21/hr",
    tasks: "185 tasks available",
    difficulty: "Intermediate",
    skills: ["Writing", "English", "AI Evaluation"],
    recommended: false,
  },
  {
    title: "Accounting Question Generation",
    client: "Finance Dataset Project",
    category: "Finance",
    description:
      "Create high-quality accounting and finance questions for training AI systems.",
    pay: "$20–$30/hr",
    tasks: "52 tasks available",
    difficulty: "Advanced",
    skills: ["Accounting", "Finance", "GAAP"],
    recommended: false,
  },
];

const categories = [
  "All",
  "AI Training",
  "Finance",
  "Data",
  "Research",
];

export default function ProjectsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      category === "All" || project.category === category;

    const searchText =
      `${project.title} ${project.description} ${project.category} ${project.skills.join(
        " "
      )}`.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <Link
              href="/worker"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              ← Worker Dashboard
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mt-4">
              Find Projects
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Discover projects that match your skills, experience and
              assessment results.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs text-gray-500">Available Projects</p>
              <p className="text-2xl font-bold mt-1">
                {projects.length}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
              <p className="text-xs text-gray-500">Your Match</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                87%
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                🔎
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, skills or categories..."
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-400/50 placeholder:text-gray-600"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                    category === item
                      ? "bg-cyan-400 text-[#06101d]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* RECOMMENDED */}
        {category === "All" && search === "" && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Recommended for You
                </h2>

                <p className="text-gray-500 mt-1">
                  Projects selected based on your skills and assessments.
                </p>
              </div>

              <span className="text-cyan-400 text-sm">
                2 matches
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {projects
                .filter((project) => project.recommended)
                .map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                  />
                ))}
            </div>
          </section>
        )}

        {/* ALL PROJECTS */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {category === "All"
                  ? "All Projects"
                  : `${category} Projects`}
              </h2>

              <p className="text-gray-500 mt-1">
                {filteredProjects.length} projects found
              </p>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-16 text-center">
              <div className="text-4xl">🔎</div>

              <h3 className="text-xl font-bold mt-5">
                No projects found
              </h3>

              <p className="text-gray-500 mt-2">
                Try another search term or category.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                />
              ))}
            </div>
          )}
        </section>

        {/* INFO */}
        <section className="mt-12 rounded-3xl border border-purple-400/20 bg-purple-400/5 p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-2xl">
              💡
            </div>

            <div>
              <h3 className="text-xl font-bold">
                Improve your project matches
              </h3>

              <p className="text-gray-400 mt-2">
                Complete more assessments and keep your skills profile
                updated to unlock projects that better match your expertise.
              </p>
            </div>

            <Link
              href="/worker/skills"
              className="md:ml-auto whitespace-nowrap px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Update Skills
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 hover:bg-white/[0.07] hover:border-cyan-400/30 transition">

      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium">
            {project.category}
          </span>

          <h3 className="text-xl font-bold mt-4">
            {project.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {project.client}
          </p>
        </div>

        {project.recommended && (
          <span className="px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 text-xs whitespace-nowrap">
            Recommended
          </span>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-sm leading-relaxed mt-5">
        {project.description}
      </p>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="rounded-xl bg-black/20 border border-white/10 p-4">
          <p className="text-xs text-gray-500">
            Estimated Pay
          </p>

          <p className="text-cyan-400 font-bold mt-1">
            {project.pay}
          </p>
        </div>

        <div className="rounded-xl bg-black/20 border border-white/10 p-4">
          <p className="text-xs text-gray-500">
            Availability
          </p>

          <p className="text-white font-semibold mt-1">
            {project.tasks}
          </p>
        </div>
      </div>

      {/* SKILLS */}
      <div className="flex flex-wrap gap-2 mt-5">
        {project.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 text-xs"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/10">
        <span className="text-xs text-gray-500">
          Difficulty:{" "}
          <span className="text-gray-300">
            {project.difficulty}
          </span>
        </span>

        <button className="px-5 py-2.5 rounded-xl bg-cyan-400 text-[#06101d] font-bold text-sm hover:bg-cyan-300 transition">
          View Project →
        </button>
      </div>
    </div>
  );
}