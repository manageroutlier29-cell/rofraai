"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  clientProfile: {
    companyName: string | null;
  } | null;
};

export default function CreateProjectModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    clientId: "",
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
  });

  useEffect(() => {
    if (!open) return;

    async function loadClients() {
      setLoadingClients(true);
      setError("");

      try {
        const response = await fetch("/api/admin/clients");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load clients."
          );
        }

        setClients(data.clients || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load clients."
        );
      } finally {
        setLoadingClients(false);
      }
    }

    loadClients();
  }, [open]);

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function closeModal() {
    if (submitting) return;

    setOpen(false);
    setError("");

    setForm({
      clientId: "",
      title: "",
      description: "",
      category: "",
      budget: "",
      deadline: "",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!form.clientId) {
      setError("Please select a client.");
      return;
    }

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Project category is required.");
      return;
    }

    const budget = Number(form.budget);

    if (!Number.isFinite(budget) || budget <= 0) {
      setError("Budget must be greater than 0.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: form.clientId,
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category.trim(),
          budget,
          deadline: form.deadline || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create project."
        );
      }

      closeModal();

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300"
      >
        + Create Project
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b1424] shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>
                <p className="text-sm text-gray-500">
                  Administration
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  Create Project
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg px-3 py-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="max-h-[80vh] overflow-y-auto p-6"
            >

              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="grid gap-5">

                {/* CLIENT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Client
                  </label>

                  <select
                    value={form.clientId}
                    onChange={(event) =>
                      updateField(
                        "clientId",
                        event.target.value
                      )
                    }
                    disabled={loadingClients || submitting}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                  >
                    <option value="">
                      {loadingClients
                        ? "Loading clients..."
                        : "Select a client"}
                    </option>

                    {clients.map((client) => {
                      const name =
                        client.clientProfile?.companyName ||
                        `${client.firstName} ${client.lastName}`;

                      return (
                        <option
                          key={client.id}
                          value={client.id}
                        >
                          {name} — {client.email}
                        </option>
                      );
                    })}
                  </select>

                  {!loadingClients &&
                    clients.length === 0 && (
                      <p className="mt-2 text-xs text-amber-400">
                        No active clients are available.
                      </p>
                    )}
                </div>

                {/* TITLE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Project Title
                  </label>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="e.g. AI Response Evaluation"
                    disabled={submitting}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Describe the project..."
                    rows={4}
                    disabled={submitting}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                  />
                </div>

                {/* CATEGORY + BUDGET */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Category
                    </label>

                    <input
                      type="text"
                      value={form.category}
                      onChange={(event) =>
                        updateField(
                          "category",
                          event.target.value
                        )
                      }
                      placeholder="e.g. AI Evaluation"
                      disabled={submitting}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Budget (USD)
                    </label>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.budget}
                      onChange={(event) =>
                        updateField(
                          "budget",
                          event.target.value
                        )
                      }
                      placeholder="1000.00"
                      disabled={submitting}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                    />
                  </div>

                </div>

                {/* DEADLINE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Deadline
                    <span className="ml-2 text-xs text-gray-600">
                      Optional
                    </span>
                  </label>

                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(event) =>
                      updateField(
                        "deadline",
                        event.target.value
                      )
                    }
                    disabled={submitting}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                  />
                </div>

              </div>

              {/* FOOTER */}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    loadingClients ||
                    clients.length === 0
                  }
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Creating..."
                    : "Create Project"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
