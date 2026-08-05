"use client";

import { useState, useTransition } from "react";
import { updateSong } from "@/lib/actions";
import Modal from "@/components/Modal";
import KeyPicker from "@/components/KeyPicker";
import BpmStepper from "@/components/BpmStepper";
import TimeSignatureInput from "@/components/TimeSignatureInput";

const FIELD_LABEL =
  "mb-1 block font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase";
const FIELD_INPUT =
  "w-full rounded-in border border-rule bg-transparent px-3 py-2 text-base sm:text-sm";

type Song = {
  id: string;
  name: string;
  singer_or_band: string | null;
  version: string | null;
  url: string | null;
  key: string | null;
  alt_key: string | null;
  bpm: number | null;
  time_signature_numerator: number;
  time_signature_denominator: number;
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
  const [altKey, setAltKey] = useState<string | null>(song.alt_key);
  const [bpm, setBpm] = useState<number | null>(song.bpm);
  const [timeSignature, setTimeSignature] = useState({
    numerator: song.time_signature_numerator,
    denominator: song.time_signature_denominator,
  });

  function handleSubmit(formData: FormData) {
    if (key) formData.set("key", key);
    if (altKey) formData.set("alt_key", altKey);
    if (bpm !== null) formData.set("bpm", String(bpm));
    formData.set("time_signature_numerator", String(timeSignature.numerator));
    formData.set("time_signature_denominator", String(timeSignature.denominator));
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
        className="inline-flex min-h-11 items-center rounded-btn border border-rule px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink uppercase hover:border-rule-strong sm:min-h-0"
      >
        Edit
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Song">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`es-name-${song.id}`} className={FIELD_LABEL}>
              Name
            </label>
            <input
              id={`es-name-${song.id}`}
              name="name"
              type="text"
              defaultValue={song.name}
              required
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <label htmlFor={`es-singer-${song.id}`} className={FIELD_LABEL}>
              Singer / Band
            </label>
            <input
              id={`es-singer-${song.id}`}
              name="singer_or_band"
              type="text"
              defaultValue={song.singer_or_band ?? ""}
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <label htmlFor={`es-version-${song.id}`} className={FIELD_LABEL}>
              Version <span className="normal-case text-ink3">(if available)</span>
            </label>
            <input
              id={`es-version-${song.id}`}
              name="version"
              type="text"
              defaultValue={song.version ?? ""}
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <label htmlFor={`es-url-${song.id}`} className={FIELD_LABEL}>
              URL Reference
            </label>
            <input
              id={`es-url-${song.id}`}
              name="url"
              type="url"
              defaultValue={song.url ?? ""}
              placeholder="https://..."
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <span className={FIELD_LABEL}>Key</span>
            <KeyPicker value={key} onSelect={setKey} />
          </div>
          <div>
            <span className={FIELD_LABEL}>
              Alternate Key <span className="normal-case text-ink3">(optional)</span>
            </span>
            <KeyPicker value={altKey} onSelect={(k) => setAltKey(k === altKey ? null : k)} />
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
