"use client";

import { useState } from "react";

type Project = {
  id: string;
  title: string;
  status: string;
};

export default function CreateTaskButton() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    category: "",
    reward: "",
    deadline: "",
  });

  async function openModal() {
    setError("");
    setOpen(true);

    if (projects.length === 0) {
      setLoadingProjects(true);

      try {
        const response = await fetch("/api/admin/tasks");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load projects.");
        }

        setProjects(data.projects || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load projects."
        );
      } finally {
        setLoadingProjects(false);
      }
    }
  }

  function closeModal() {
    if (saving) return;

    setOpen(false);
    setError("");
  }

  async function submitTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: form.projectId,
          title: form.title,
          description: form.description,
          category: form.category,
          reward: Number(form.reward),
          deadline: form.deadline || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create task.");
      }

      setForm({
        projectId: "",
        title: "",
        description: "",
        category: "",
        reward: "",
        deadline: "",
      });

      setOpen(false);

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create task."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300"
      >
        + Create Task
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b1625] shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <h2 className="text-xl font-bold">
                  Create Task
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new task to an active project.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-xl text-gray-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={submitTask}
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Project
                </label>

                <select
                  required
                  value={form.projectId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      projectId: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="">
                    {loadingProjects
                      ? "Loading projects..."
                      : "Select project"}
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.title} — {project.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Task Title
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Evaluate AI responses"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe exactly what the worker needs to do..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <input
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    placeholder="AI Evaluation"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Worker Reward
                  </label>

                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={form.reward}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reward: e.target.value,
                      })
                    }
                    placeholder="5.00"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Deadline
                  </label>

                  <input
                    type="datetime-local"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        deadline: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400/40"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || loadingProjects}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Task"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
