"use client";

import { useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: string;
  deadline: string | null;
  projectTitle: string;
  projectCategory: string;
};

export default function TaskMarketplace({
  tasks,
}: {
  tasks: Task[];
}) {
  const [items, setItems] = useState(tasks);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function claimTask(taskId: string) {
    setLoading(taskId);
    setMessage("");

    try {
      const response = await fetch(
        `/api/worker/tasks/${taskId}/claim`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Unable to claim task."
        );
        return;
      }

      setItems((current) =>
        current.filter((task) => task.id !== taskId)
      );

      setMessage("Task claimed successfully.");
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

        <div className="text-5xl">
          ✓
        </div>

        <h2 className="mt-5 text-2xl font-bold">
          No tasks available
        </h2>

        <p className="mt-2 text-gray-500">
          New opportunities will appear here when clients publish tasks.
        </p>

      </div>
    );
  }

  return (
    <div className="mt-8">

      {message && (
        <div className="mb-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-300">
          {message}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">

        {items.map((task) => (

          <div
            key={task.id}
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/20 hover:bg-white/[0.05]"
          >

            <div className="flex items-start justify-between gap-5">

              <div className="min-w-0">

                <p className="text-xs uppercase tracking-wider text-cyan-400">
                  {task.projectTitle}
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {task.title}
                </h2>

              </div>

              <div className="shrink-0 rounded-xl bg-cyan-400/10 px-3 py-2 text-right">

                <p className="text-xs text-gray-500">
                  Reward
                </p>

                <p className="font-bold text-cyan-400">
                  ${task.reward}
                </p>

              </div>

            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {task.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-400">
                {task.category}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-400">
                {task.projectCategory}
              </span>

              {task.deadline && (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-400">
                  Due{" "}
                  {new Date(
                    task.deadline
                  ).toLocaleDateString()}
                </span>
              )}

            </div>

            <div className="mt-6 border-t border-white/10 pt-5">

              <button
                onClick={() => claimTask(task.id)}
                disabled={loading === task.id}
                className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === task.id
                  ? "Claiming..."
                  : "Claim Task →"}
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
