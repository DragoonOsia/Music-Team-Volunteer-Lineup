"use client";

import { useState, useTransition } from "react";
import { addSong } from "@/lib/actions";
import KeyPicker from "@/components/KeyPicker";
import BpmStepper from "@/components/BpmStepper";
import TimeSignatureInput from "@/components/TimeSignatureInput";

export default function AddSongModal({
  serviceId,
  triggerLabel = "Add Song",
  triggerClassName = "rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover",
}: {
  serviceId: string;
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [key, setKey] = useState<string | null>(null);
  const [bpm, setBpm] = useState<number | null>(null);
  const [timeSignature, setTimeSignature] = useState({ numerator: 4, denominator: 4 });

  function handleSubmit(formData: FormData) {
    if (key) formData.set("key", key);
    if (bpm !== null) formData.set("bpm", String(bpm));
    formData.set("time_signature_numerator", String(timeSignature.numerator));
    formData.set("time_signature_denominator", String(timeSignature.denominator));
    startTransition(async () => {
      await addSong(serviceId, formData);
      setOpen(false);
      setKey(null);
      setBpm(null);
      setTimeSignature({ numerator: 4, denominator: 4 });
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClassName}>
        {triggerLabel}
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
            <h2 className="mb-4 text-lg font-semibold">Add Song</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="s-name" className="mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="s-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="s-singer" className="mb-1 block text-sm font-medium">
                  Singer / Band
                </label>
                <input
                  id="s-singer"
                  name="singer_or_band"
                  type="text"
                  className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="s-version" className="mb-1 block text-sm font-medium">
                  Version <span className="text-muted">(if available)</span>
                </label>
                <input
                  id="s-version"
                  name="version"
                  type="text"
                  className="w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="s-url" className="mb-1 block text-sm font-medium">
                  URL Reference
                </label>
                <input
                  id="s-url"
                  name="url"
                  type="url"
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
              <div>
                <span className="mb-1 block text-sm font-medium">Time Signature</span>
                <TimeSignatureInput
                  numerator={timeSignature.numerator}
                  denominator={timeSignature.denominator}
                  onChange={setTimeSignature}
                />
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
