"use client";

import { useState, useTransition } from "react";
import { addPlaylist } from "@/lib/actions";

export default function AddPlaylistModal({ serviceId }: { serviceId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addPlaylist(serviceId, formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/15"
      >
        Add Playlist
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-white p-6 dark:bg-black dark:border dark:border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Add Playlist</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="p-url" className="mb-1 block text-sm font-medium">
                  Playlist URL
                </label>
                <input
                  id="p-url"
                  name="url"
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-4 py-2 text-sm text-black/60 dark:text-white/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
