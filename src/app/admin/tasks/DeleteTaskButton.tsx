"use client";

import { useState } from "react";

export default function DeleteTaskButton({
  taskId,
  taskTitle,
}: {
  taskId: string;
  taskTitle: string;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${taskTitle}"?\n\nThis permanently deletes the task. Tasks with worker assignments, submissions, or earnings cannot be deleted.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.error || "Unable to delete task.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Task deletion failed:", error);
      window.alert("Unable to delete task.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="ml-2 rounded-lg border border-red-400/20 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
