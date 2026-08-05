"use client";

import { useState, useTransition } from "react";
import { updatePlaylist } from "@/lib/actions";
import Modal from "@/components/Modal";

const FIELD_LABEL =
  "mb-1 block font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase";
const FIELD_INPUT =
  "w-full rounded-in border border-rule bg-transparent px-3 py-2 text-base sm:text-sm";

export default function EditPlaylistModal({
  serviceId,
  playlist,
}: {
  serviceId: string;
  playlist: { id: string; url: string };
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updatePlaylist(serviceId, playlist.id, formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong sm:min-h-0"
      >
        Edit
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Playlist">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`ep-url-${playlist.id}`} className={FIELD_LABEL}>
              Playlist URL
            </label>
            <input
              id={`ep-url-${playlist.id}`}
              name="url"
              type="url"
              required
              defaultValue={playlist.url}
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
