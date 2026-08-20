"use client";

import { useState } from "react";

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${projectTitle}"?\n\nThis will permanently delete the project and any tasks that have no worker activity.\n\nProjects with worker submissions or earnings will be protected from deletion.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.error || "Unable to delete project.");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Project deletion failed:", error);
      window.alert("Unable to delete project.");
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
