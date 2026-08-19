"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: string;
  deadline: string | null;
};

type Project = {
  id: string;
  title: string;
  client: {
    id: string;
    name: string;
  };
  category: string;
  description: string;
  budget: string;
  status: string;
  deadline: string | null;
  tasks: {
    total: number;
    available: number;
  };
  pay: {
    minimum: string;
    maximum: string;
    currency: string;
  };
  taskList: Task[];
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();

  const projectId =
    typeof params.id === "string" ? params.id : "";

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/worker/projects/${projectId}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load project."
          );
        }

        setProject(data.project);
      } catch (err) {
        console.error("Load project error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-4xl animate-pulse">⏳</div>

          <h1 className="text-2xl font-bold mt-5">
            Loading project...
          </h1>

          <p className="text-gray-500 mt-2">
            Getting the project details and available tasks.
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <Link
            href="/worker/projects"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Projects
          </Link>

          <div className="mt-10 rounded-3xl border border-red-400/20 bg-red-400/5 p-12 text-center">
            <div className="text-4xl">⚠️</div>

            <h1 className="text-2xl font-bold mt-5">
              Unable to load project
            </h1>

            <p className="text-gray-500 mt-2">
              {error || "Project not found."}
            </p>

            <button
              onClick={() => router.push("/worker/projects")}
              className="mt-6 px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const minimum = Number(project.pay.minimum);
  const maximum = Number(project.pay.maximum);

  const pay =
    minimum === maximum
      ? `$${minimum.toFixed(2)}`
      : `$${minimum.toFixed(2)}–$${maximum.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* BACK */}
        <Link
          href="/worker/projects"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition"
        >
          ← Back to Projects
        </Link>

        {/* HEADER */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium">
                {project.category}
              </span>

              <h1 className="text-3xl md:text-5xl font-bold mt-5">
                {project.title}
              </h1>

              <p className="text-gray-500 mt-3">
                Client: {project.client.name}
              </p>
            </div>

            <span className="self-start px-4 py-2 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 text-sm">
              {project.status}
            </span>
          </div>

          <p className="text-gray-300 leading-relaxed mt-8 max-w-4xl">
            {project.description}
          </p>

          {/* PROJECT STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <p className="text-xs text-gray-500">
                Task Reward
              </p>

              <p className="text-xl font-bold text-cyan-400 mt-2">
                {pay}
              </p>
            </div>

            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <p className="text-xs text-gray-500">
                Available Tasks
              </p>

              <p className="text-xl font-bold mt-2">
                {project.tasks.available}
              </p>
            </div>

            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <p className="text-xs text-gray-500">
                Total Tasks
              </p>

              <p className="text-xl font-bold mt-2">
                {project.tasks.total}
              </p>
            </div>

            <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
              <p className="text-xs text-gray-500">
                Deadline
              </p>

              <p className="text-sm font-semibold mt-2">
                {project.deadline
                  ? new Date(
                      project.deadline
                    ).toLocaleDateString()
                  : "No deadline"}
              </p>
            </div>
          </div>
        </div>

        {/* TASKS */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Available Tasks
              </h2>

              <p className="text-gray-500 mt-2">
                Choose a task you are qualified to complete.
              </p>
            </div>

            <span className="text-cyan-400 text-sm">
              {project.taskList.length} available
            </span>
          </div>

          {project.taskList.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
              <div className="text-4xl">📭</div>

              <h3 className="text-xl font-bold mt-5">
                No tasks available
              </h3>

              <p className="text-gray-500 mt-2">
                New tasks may become available later.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {project.taskList.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClaimed={() => {
                    window.location.reload();
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* INFO */}
        <section className="mt-10 rounded-3xl border border-purple-400/20 bg-purple-400/5 p-8">
          <div className="flex gap-5">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
              💡
            </div>

            <div>
              <h3 className="text-lg font-bold">
                Before claiming a task
              </h3>

              <p className="text-gray-400 mt-2 leading-relaxed">
                Read the task instructions carefully and make sure
                you understand the requirements before starting.
                Once claimed, the task becomes assigned to you.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function TaskCard({
  task,
  onClaimed,
}: {
  task: Task;
  onClaimed: () => void;
}) {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  async function claimTask() {
    try {
      setClaiming(true);
      setError("");

      const response = await fetch(
        `/api/worker/tasks/${task.id}/claim`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to claim task."
        );
      }

      onClaimed();
    } catch (err) {
      console.error("Claim task error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to claim task."
      );
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 hover:bg-white/[0.06] transition">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs">
              {task.category}
            </span>

            <span className="px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-xs">
              Available
            </span>
          </div>

          <h3 className="text-xl font-bold mt-4">
            {task.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <span className="px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-cyan-400 text-sm font-semibold">
              ${Number(task.reward).toFixed(2)}
            </span>

            {task.deadline && (
              <span className="px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-gray-400 text-sm">
                Deadline{" "}
                {new Date(
                  task.deadline
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-4">
              {error}
            </p>
          )}
        </div>

        <div className="lg:w-44">
          <button
            onClick={claimTask}
            disabled={claiming}
            className="w-full px-5 py-3 rounded-xl bg-cyan-400 text-[#06101d] font-bold text-sm hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {claiming ? "Claiming..." : "Claim Task →"}
          </button>
        </div>

      </div>
    </div>
  );
}
