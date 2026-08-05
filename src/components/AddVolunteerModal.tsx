"use client";

import { useState, useTransition } from "react";
import { addVolunteer } from "@/lib/actions";
import Modal from "@/components/Modal";

const INSTRUMENTS: [string, string][] = [
  ["Electric Guitar", "EG"],
  ["Acoustic Guitar", "AG"],
  ["Drums", "DR"],
  ["Bass Guitar", "BG"],
  ["Keyboard", "KB"],
  ["Vocals", "VOX"],
  ["Musical Director", "MD"],
];

const FIELD_LABEL =
  "mb-1 block font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase";
const FIELD_INPUT =
  "w-full rounded-in border border-rule bg-transparent px-3 py-2 text-base sm:text-sm";

export default function AddVolunteerModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addVolunteer(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center rounded-btn bg-accent px-4 py-2 font-mono text-xs font-medium tracking-[0.14em] text-accent-foreground uppercase hover:opacity-90 sm:min-h-0"
      >
        + Add
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Volunteer">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="v-name" className={FIELD_LABEL}>
              Name
            </label>
            <input id="v-name" name="name" type="text" required className={FIELD_INPUT} />
          </div>
          <div>
            <label htmlFor="v-nickname" className={FIELD_LABEL}>
              Nickname <span className="normal-case text-ink3">(optional)</span>
            </label>
            <input id="v-nickname" name="nickname" type="text" className={FIELD_INPUT} />
          </div>
          <div>
            <span className={FIELD_LABEL}>Instruments / Vocals</span>
            <div className="grid grid-cols-2 gap-2">
              {INSTRUMENTS.map(([inst, code]) => (
                <label key={inst} className="flex items-center gap-2 py-0.5">
                  <input
                    type="checkbox"
                    name="instruments"
                    value={inst}
                    className="h-[18px] w-[18px] accent-accent"
                  />
                  <span className="font-mono text-xs font-semibold tracking-[0.08em] text-ink">
                    {code}
                  </span>
                  <span className="text-sm text-ink2">{inst}</span>
                </label>
              ))}
            </div>
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
