"use client";

import { useState, useTransition } from "react";
import { addPlaylist } from "@/lib/actions";
import Modal from "@/components/Modal";

const FIELD_LABEL =
  "mb-1 block font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase";
const FIELD_INPUT =
  "w-full rounded-in border border-rule bg-transparent px-3 py-2 text-base sm:text-sm";

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
        className="inline-flex min-h-11 items-center rounded-btn border border-rule px-4 py-2 font-mono text-xs font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong sm:min-h-0"
      >
        Add Playlist
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Playlist">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="p-url" className={FIELD_LABEL}>
              Playlist URL
            </label>
            <input
              id="p-url"
              name="url"
              type="url"
              required
              placeholder="https://..."
              className={FIELD_INPUT}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center rounded-btn px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink3 uppercase hover:text-ink sm:min-h-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-11 items-center rounded-btn bg-accent px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-accent-foreground uppercase hover:opacity-90 disabled:opacity-60 sm:min-h-0"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
