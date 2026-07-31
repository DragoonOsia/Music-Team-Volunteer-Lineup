"use client";

import { useState, useTransition } from "react";
import { updateSongKey } from "@/lib/actions";
import KeyPicker from "@/components/KeyPicker";

export default function SongKeyModal({
  serviceId,
  songId,
  currentKey,
}: {
  serviceId: string;
  songId: string;
  currentKey: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function pick(key: string) {
    startTransition(() => {
      updateSongKey(serviceId, songId, key);
    });
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="rounded bg-surface px-1.5 py-0.5 text-xs font-medium text-foreground underline decoration-dotted underline-offset-2 hover:bg-surface-2 disabled:opacity-50"
      >
        {currentKey ?? "Set key"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-lg border border-border bg-surface-2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Change key</h2>
            <KeyPicker value={currentKey} onSelect={pick} />
          </div>
        </div>
      )}
    </>
  );
}
