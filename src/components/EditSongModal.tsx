"use client";

import { useState, useTransition } from "react";
import { updateSong } from "@/lib/actions";
import KeyPicker from "@/components/KeyPicker";
import BpmStepper from "@/components/BpmStepper";

type Song = {
  id: string;
  name: string;
  singer_or_band: string | null;
  version: string | null;
  url: string | null;
  key: string | null;
  bpm: number | null;
};

export default function EditSongModal({
  serviceId,
  song,
}: {
  serviceId: string;
  song: Song;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [key, setKey] = useState<string | null>(song.key);
  const [bpm, setBpm] = useState<number | null>(song.bpm);

  function handleSubmit(formData: FormData) {
    if (key) formData.set("key", key);
    if (bpm !== null) formData.set("bpm", String(bpm));
    startTransition(async () => {
      await updateSong(serviceId, song.id, formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium hover:bg-surface"
      >
        Edit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-border bg-surface-2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Edit Song</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor={`es-name-${song.id}`} className="mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id={`es-name-${song.id}`}
                  name="name"
                  type="text"
                  defaultValue={song.name}
                  required
                  className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor={`es-singer-${song.id}`} className="mb-1 block text-sm font-medium">
                  Singer / Band
                </label>
                <input
                  id={`es-singer-${song.id}`}
                  name="singer_or_band"
                  type="text"
                  defaultValue={song.singer_or_band ?? ""}
                  className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor={`es-version-${song.id}`} className="mb-1 block text-sm font-medium">
                  Version <span className="text-muted">(if available)</span>
                </label>
                <input
                  id={`es-version-${song.id}`}
                  name="version"
                  type="text"
                  defaultValue={song.version ?? ""}
                  className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor={`es-url-${song.id}`} className="mb-1 block text-sm font-medium">
                  URL Reference
                </label>
                <input
                  id={`es-url-${song.id}`}
                  name="url"
                  type="url"
                  defaultValue={song.url ?? ""}
                  placeholder="https://..."
                  className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium">Key</span>
                <KeyPicker value={key} onSelect={setKey} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium">BPM</span>
                <BpmStepper value={bpm} onChange={setBpm} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-4 py-2 text-sm text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover disabled:opacity-50"
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
