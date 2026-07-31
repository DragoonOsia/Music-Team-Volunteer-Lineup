"use client";

import { useState, useTransition } from "react";
import { resetServiceSongs } from "@/lib/actions";

export default function ServiceActionsMenu({ serviceId }: { serviceId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="rounded-md border border-black/15 px-3 py-2 text-sm font-medium disabled:opacity-50 dark:border-white/15"
      >
        Actions ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-44 rounded-md border border-black/10 bg-white py-1 shadow-lg dark:border-white/15 dark:bg-black">
            <button
              onClick={handleReset}
              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Reset Lineup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
