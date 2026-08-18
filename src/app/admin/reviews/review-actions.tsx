"use client";

import { useState } from "react";

type ReviewActionsProps = {
  submissionId: string;
};

export default function ReviewActions({
  submissionId,
}: ReviewActionsProps) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitReview(status: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/reviews/${submissionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            score: score ? Number(score) : null,
            feedback: feedback || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process review");
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          {open ? "Close Review" : "Open Review"}
        </button>

        {!open && (
          <>
            <button
              type="button"
              onClick={() => submitReview("APPROVED")}
              disabled={loading}
              className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-400/20 disabled:opacity-50"
            >
              Approve
            </button>

            <button
              type="button"
              onClick={() => submitReview("REVISION_REQUIRED")}
              disabled={loading}
              className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-400/20 disabled:opacity-50"
            >
              Request Revision
            </button>

            <button
              type="button"
              onClick={() => submitReview("REJECTED")}
              disabled={loading}
              className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-400/20 disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}
      </div>

      {open && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#050d18] p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Score
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="0 - 100"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Decision
              </label>

              <div className="mt-2 text-sm text-gray-400">
                Choose an action below after entering your evaluation.
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Feedback
            </label>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              placeholder="Provide feedback to the worker..."
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-cyan-400/50"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submitReview("APPROVED")}
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Approve Submission"}
            </button>

            <button
              type="button"
              onClick={() => submitReview("REVISION_REQUIRED")}
              disabled={loading}
              className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-400/20 disabled:opacity-50"
            >
              Request Revision
            </button>

            <button
              type="button"
              onClick={() => submitReview("REJECTED")}
              disabled={loading}
              className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-400/20 disabled:opacity-50"
            >
              Reject Submission
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
