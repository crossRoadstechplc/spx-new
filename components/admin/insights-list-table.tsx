"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PopupLoadingAnimation } from "@/components/ui/popup-loading-animation";
import {
  bulkDeleteInsightsAction,
  bulkSetInsightsStatusAction,
  deleteInsightAction,
  setInsightStatusAction,
} from "@/app/admin/insights/actions";

export type AdminInsightListRow = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  updatedAt: string;
  authorName: string | null;
  categoryName: string | null;
  tagCount: number;
};

interface InsightsListTableProps {
  insights: AdminInsightListRow[];
}

export function InsightsListTable({ insights }: InsightsListTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoadingLabel, setBulkLoadingLabel] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const allIds = useMemo(() => insights.map((i) => i.id), [insights]);
  const allSelected = insights.length > 0 && selected.size === insights.length;
  const someSelected = selected.size > 0;

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  }, [allSelected, allIds]);

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const runBulk = async (
    action: "publish" | "draft" | "archive" | "delete"
  ) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;

    const loadingLabel =
      action === "delete"
        ? "Deleting insights…"
        : action === "publish"
          ? "Publishing insights…"
          : action === "draft"
            ? "Moving to draft…"
            : "Archiving insights…";

    if (action === "delete") {
      if (
        !confirm(
          `Delete ${ids.length} insight(s)? This cannot be undone.`
        )
      ) {
        return;
      }
    }

    setBulkLoadingLabel(loadingLabel);
    try {
      if (action === "delete") {
        const result = await bulkDeleteInsightsAction(ids);
        if (!result.success) {
          setToast({
            variant: "error",
            message: result.error || "Bulk delete failed.",
          });
          return;
        }
        const n = result.deleted ?? ids.length;
        setToast({
          variant: "success",
          message:
            n === 1
              ? "Deleted 1 insight."
              : `Deleted ${n} insights.`,
        });
        setSelected(new Set());
        refresh();
        return;
      }

      const status =
        action === "publish"
          ? "PUBLISHED"
          : action === "draft"
            ? "DRAFT"
            : "ARCHIVED";

      const result = await bulkSetInsightsStatusAction(ids, status);
      if (!result.success) {
        setToast({
          variant: "error",
          message: result.error || "Bulk update failed.",
        });
        return;
      }

      const updated = result.updated ?? 0;
      const label =
        status === "PUBLISHED"
          ? "published"
          : status === "DRAFT"
            ? "draft"
            : "archived";
      if (updated === 0) {
        setToast({
          variant: "success",
          message: `No changes needed — selected insights were already ${label}.`,
        });
      } else {
        setToast({
          variant: "success",
          message:
            updated === 1
              ? `Updated 1 insight to ${label}.`
              : `Updated ${updated} insights to ${label}.`,
        });
      }
      setSelected(new Set());
      refresh();
    } finally {
      setBulkLoadingLabel(null);
    }
  };

  const onStatusChange = async (
    id: string,
    value: string
  ): Promise<void> => {
    if (value !== "DRAFT" && value !== "PUBLISHED" && value !== "ARCHIVED") {
      return;
    }
    const result = await setInsightStatusAction(id, value);
    if (!result.success) {
      alert(result.error || "Could not update status.");
      return;
    }
    refresh();
  };

  const onDeleteRow = async (id: string) => {
    if (!confirm("Delete this insight? This action cannot be undone.")) {
      return;
    }
    const result = await deleteInsightAction(id);
    if (!result.success) {
      alert(result.error || "Failed to delete insight.");
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    refresh();
  };

  const tableBusy = Boolean(bulkLoadingLabel) || isPending;

  return (
    <div className="space-y-3">
      {bulkLoadingLabel ? (
        <PopupLoadingAnimation label={bulkLoadingLabel} />
      ) : null}

      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            key={toast.message}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-[110] max-w-md rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.variant === "success"
                ? "border-green-200 bg-green-50 text-green-900 dark:border-green-900/60 dark:bg-green-950/90 dark:text-green-50"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {toast.message}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          <span className="text-muted-foreground font-medium">
            {selected.size} selected
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={tableBusy}
            onClick={() => void runBulk("publish")}
          >
            Publish
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={tableBusy}
            onClick={() => void runBulk("draft")}
          >
            Draft
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={tableBusy}
            onClick={() => void runBulk("archive")}
          >
            Archive
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={tableBusy}
            onClick={() => void runBulk("delete")}
          >
            Delete
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={tableBusy}
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-10 px-3 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={allSelected}
                  disabled={tableBusy}
                  onChange={toggleAll}
                  aria-label="Select all insights"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium">
                Title
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium">
                Author
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium">
                Category
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium min-w-[9rem]">
                Status
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium">
                Updated
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {insights.map((insight) => (
              <tr key={insight.id} className="hover:bg-muted/30">
                <td className="px-3 py-3 align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={selected.has(insight.id)}
                    disabled={tableBusy}
                    onChange={() => toggleOne(insight.id)}
                    aria-label={`Select ${insight.title}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/insights/${insight.id}/edit`}
                    className="font-medium hover:text-primary"
                  >
                    {insight.title}
                  </Link>
                  {insight.tagCount > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {insight.tagCount}{" "}
                      {insight.tagCount === 1 ? "tag" : "tags"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {insight.authorName || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {insight.categoryName || "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="h-9 w-full max-w-[11rem] rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                    value={insight.status}
                    disabled={tableBusy}
                    onChange={(e) => {
                      void onStatusChange(insight.id, e.target.value);
                    }}
                    aria-label={`Status for ${insight.title}`}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(insight.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/insights/${insight.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={tableBusy}
                      onClick={() => void onDeleteRow(insight.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
