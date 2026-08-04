"use client";

import { useState, useTransition } from "react";
import { addVolunteer } from "@/lib/actions";

const INSTRUMENTS = [
  "Electric Guitar",
  "Acoustic Guitar",
  "Drums",
  "Bass Guitar",
  "Keyboard",
  "Vocals",
  "Musical Director",
];

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
        className="rounded-btn bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
      >
        + Add
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-rule border-t-2 border-t-rule-strong bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Add Volunteer</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="v-name" className="mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="v-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-in border border-rule bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="v-nickname" className="mb-1 block text-sm font-medium">
                  Nickname <span className="text-ink3">(optional)</span>
                </label>
                <input
                  id="v-nickname"
                  name="nickname"
                  type="text"
                  className="w-full rounded-in border border-rule bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium">
                  Instruments / Vocals
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {INSTRUMENTS.map((inst) => (
                    <label key={inst} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="instruments" value={inst} />
                      {inst}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-btn px-4 py-2 text-sm text-ink3 hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-btn bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
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
