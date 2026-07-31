"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetServiceSongs, archiveService, unarchiveService } from "@/lib/actions";

export default function ServiceActionsMenu({
  serviceId,
  archived,
}: {
  serviceId: string;
  archived: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleReset() {
    setOpen(false);
    if (!confirm("Reset this service's setlist? This removes every song added to it.")) {
      return;
    }
    if (!confirm("Are you sure? This can't be undone.")) {
      return;
    }
    startTransition(() => {
      resetServiceSongs(serviceId);
    });
  }

  function handleArchiveToggle() {
    setOpen(false);
    startTransition(async () => {
      if (archived) {
        await unarchiveService(serviceId);
      } else {
        await archiveService(serviceId);
        router.push("/services");
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="rounded-md border border-border-strong px-3 py-2 text-sm font-medium disabled:opacity-50"
      >
        Actions ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-44 rounded-md border border-border bg-surface-2 py-1 shadow-lg">
            <button
              onClick={handleArchiveToggle}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-surface"
            >
              {archived ? "Unarchive" : "Archive"}
            </button>
            <button
              onClick={handleReset}
              className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-surface"
            >
              Reset Lineup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
