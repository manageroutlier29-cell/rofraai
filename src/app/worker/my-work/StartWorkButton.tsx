"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartWorkButton({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startWork() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/worker/assignments/${assignmentId}/start`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to start work.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startWork}
        disabled={loading}
        className="w-full rounded-xl bg-cyan-400 px-5 py-3.5 font-bold text-[#06101d] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Starting Work..." : "Start Work →"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
