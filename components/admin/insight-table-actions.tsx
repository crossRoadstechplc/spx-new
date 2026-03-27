"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteInsightAction } from "@/app/admin/insights/actions";

interface InsightTableActionsProps {
  insightId: string;
}

export function InsightTableActions({ insightId }: InsightTableActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this insight? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteInsightAction(insightId);
    if (!result.success) {
      alert(result.error || "Failed to delete insight.");
      setIsDeleting(false);
      return;
    }

    window.location.reload();
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/admin/insights/${insightId}/edit`}>Edit</Link>
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}

