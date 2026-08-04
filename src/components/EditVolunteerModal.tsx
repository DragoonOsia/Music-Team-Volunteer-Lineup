"use client";

import { useState, useTransition } from "react";
import { updateVolunteer } from "@/lib/actions";

const INSTRUMENTS = [
  "Electric Guitar",
  "Acoustic Guitar",
  "Drums",
  "Bass Guitar",
  "Keyboard",
  "Vocals",
  "Musical Director",
];

type Volunteer = {
  id: string;
  name: string;
  nickname: string | null;
  instruments: string[];
};

export default function EditVolunteerModal({ volunteer }: { volunteer: Volunteer }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateVolunteer(volunteer.id, formData);
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

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-rule border-t-2 border-t-rule-strong bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Edit Volunteer</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor={`ev-name-${volunteer.id}`} className="mb-1 block text-sm font-medium">
                  Name
                </label>
                <input
                  id={`ev-name-${volunteer.id}`}
                  name="name"
                  type="text"
                  defaultValue={volunteer.name}
                  required
                  className="w-full rounded-in border border-rule bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor={`ev-nickname-${volunteer.id}`} className="mb-1 block text-sm font-medium">
                  Nickname <span className="text-ink3">(optional)</span>
                </label>
                <input
                  id={`ev-nickname-${volunteer.id}`}
                  name="nickname"
                  type="text"
                  defaultValue={volunteer.nickname ?? ""}
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
                      <input
                        type="checkbox"
                        name="instruments"
                        value={inst}
                        defaultChecked={volunteer.instruments.includes(inst)}
                      />
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
