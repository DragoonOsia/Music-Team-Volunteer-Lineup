"use client";

import { useState, useTransition } from "react";
import { addSong } from "@/lib/actions";
import Modal from "@/components/Modal";
import KeyPicker from "@/components/KeyPicker";
import BpmStepper from "@/components/BpmStepper";
import TimeSignatureInput from "@/components/TimeSignatureInput";

const FIELD_LABEL =
  "mb-1 block font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase";
const FIELD_INPUT =
  "w-full rounded-in border border-rule bg-transparent px-3 py-2 text-base sm:text-sm";

export default function AddSongModal({ serviceId }: { serviceId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [key, setKey] = useState<string | null>(null);
  const [altKey, setAltKey] = useState<string | null>(null);
  const [bpm, setBpm] = useState<number | null>(120);
  const [timeSignature, setTimeSignature] = useState({ numerator: 4, denominator: 4 });

  function handleSubmit(formData: FormData) {
    if (key) formData.set("key", key);
    if (altKey) formData.set("alt_key", altKey);
    if (bpm !== null) formData.set("bpm", String(bpm));
    formData.set("time_signature_numerator", String(timeSignature.numerator));
    formData.set("time_signature_denominator", String(timeSignature.denominator));
    startTransition(async () => {
      await addSong(serviceId, formData);
      setOpen(false);
      setKey(null);
      setAltKey(null);
      setBpm(120);
      setTimeSignature({ numerator: 4, denominator: 4 });
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center rounded-btn bg-accent px-4 py-2 font-mono text-xs font-medium tracking-[0.14em] text-accent-foreground uppercase hover:opacity-90 sm:min-h-0"
      >
        Add Song
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Song">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="s-name" className={FIELD_LABEL}>
              Name
            </label>
            <input id="s-name" name="name" type="text" required className={FIELD_INPUT} />
          </div>
          <div>
            <label htmlFor="s-singer" className={FIELD_LABEL}>
              Singer / Band
            </label>
            <input id="s-singer" name="singer_or_band" type="text" className={FIELD_INPUT} />
          </div>
          <div>
            <label htmlFor="s-version" className={FIELD_LABEL}>
              Version <span className="normal-case text-ink3">(if available)</span>
            </label>
            <input id="s-version" name="version" type="text" className={FIELD_INPUT} />
          </div>
          <div>
            <label htmlFor="s-url" className={FIELD_LABEL}>
              URL Reference
            </label>
            <input
              id="s-url"
              name="url"
              type="url"
              placeholder="https://..."
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <span className={FIELD_LABEL}>Key</span>
            <KeyPicker value={key} onSelect={setKey} disabledValue={altKey} />
          </div>
          <div>
            <span className={FIELD_LABEL}>
              Alternate Key <span className="normal-case text-ink3">(optional)</span>
            </span>
            <KeyPicker
              value={altKey}
              onSelect={(k) => setAltKey(k === altKey ? null : k)}
              disabledValue={key}
            />
          </div>
          <div>
            <span className={FIELD_LABEL}>BPM</span>
            <BpmStepper value={bpm} onChange={setBpm} />
          </div>
          <div>
            <span className={FIELD_LABEL}>Time Signature</span>
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
