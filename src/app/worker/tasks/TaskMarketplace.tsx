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

type Access = {
  isUnlocked: boolean;
  freeTaskLimit: number;
  tasksClaimed: number;
  tasksRemaining: number | null;
  unlockFee: string;
};

export default function TaskMarketplace({
  tasks,
  access,
}: {
  tasks: Task[];
  access: Access | null;
}) {
  const [items, setItems] = useState(tasks);
  const [loading, setLoading] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
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
        if (data.requiresUnlock) {
          setMessage(
            "You have used your free tasks. Unlock marketplace access to continue."
          );
        } else {
          setMessage(
            data.error || "Unable to claim task."
          );
        }

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

  async function unlockMarketplace() {
    setUnlocking(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/worker/access/unlock",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Unable to create marketplace payment."
        );
        return;
      }

      if (data.alreadyUnlocked) {
        window.location.reload();
        return;
      }

      if (!data.checkoutUrl) {
        setMessage(
          "Payment checkout was not returned. Please try again."
        );
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setMessage(
        "Unable to start payment. Please try again."
      );
    } finally {
      setUnlocking(false);
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

      {access && (
        <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Marketplace Access
              </p>

              {access.isUnlocked ? (
                <>
                  <h2 className="mt-1 text-lg font-bold">
                    Marketplace unlocked
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    You can claim available tasks without the free-task limit.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-1 text-lg font-bold">
                    {access.tasksRemaining} free{" "}
                    {access.tasksRemaining === 1
                      ? "task"
                      : "tasks"}{" "}
                    remaining
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    After your free tasks, unlock marketplace access to continue claiming work.
                  </p>
                </>
              )}
            </div>

            {!access.isUnlocked &&
              access.tasksRemaining === 0 && (
                <button
                  type="button"
                  onClick={unlockMarketplace}
                  disabled={unlocking}
                  className="shrink-0 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {unlocking
                    ? "Opening Payment..."
                    : `Unlock Access — $${access.unlockFee}`}
                </button>
              )}
          </div>
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-300">
          {message}

          {message.includes("free tasks") &&
            access &&
            !access.isUnlocked &&
            access.tasksRemaining === 0 && (
              <button
                type="button"
                onClick={unlockMarketplace}
                disabled={unlocking}
                className="ml-3 font-bold text-cyan-200 underline hover:text-white disabled:opacity-50"
              >
                {unlocking
                  ? "Opening..."
                  : "Unlock now"}
              </button>
            )}
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
