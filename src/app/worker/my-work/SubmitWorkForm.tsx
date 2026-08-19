"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SubmitWorkFormProps = {
  assignmentId: string;
};

export default function SubmitWorkForm({
  assignmentId,
}: SubmitWorkFormProps) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!content.trim()) {
      setError("Please enter your completed work before submitting.");
      return;
    }

    if (content.trim().length < 10) {
      setError("Your submission is too short.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/worker/assignments/${assignmentId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to submit your work.");
        return;
      }

      setSuccess(
        data.message || "Work submitted successfully."
      );

      setContent("");

      router.refresh();
    } catch (error) {
      console.error("Submit work error:", error);

      setError(
        "Something went wrong while submitting your work. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="submission-content"
          className="mb-2 block text-sm font-semibold text-gray-300"
        >
          Your Completed Work
        </label>

        <textarea
          id="submission-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={loading}
          placeholder="Enter your completed work, analysis, answer, or evaluation here..."
          rows={12}
          className="w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>
            Minimum 10 characters
          </span>

          <span>
            {content.length} characters
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-cyan-400 px-5 py-3.5 font-bold text-[#06101d] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Work →"}
      </button>
    </form>
  );
}