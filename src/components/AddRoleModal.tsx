"use client";

import { useState, useTransition } from "react";
import { addRole } from "@/lib/actions";
import Modal from "@/components/Modal";

const INSTRUMENTS = [
  "Musical Director",
  "Vocals",
  "Acoustic Guitar",
  "Electric Guitar",
  "Keyboard",
  "Bass Guitar",
  "Drums",
];

const FIELD_LABEL =
  "mb-1 block font-mono text-[10px] font-medium tracking-[0.18em] text-ink3 uppercase";

type Team = { id: string; name: string };

function optionClass(active: boolean) {
  return `min-h-11 rounded-in border px-2 py-1.5 text-sm font-medium sm:min-h-0 ${
    active
      ? "border-accent bg-accent text-accent-foreground"
      : "border-rule bg-transparent text-ink hover:border-rule-strong"
  }`;
}

export default function AddRoleModal({
  open,
  onClose,
  teams,
}: {
  open: boolean;
  onClose: () => void;
  teams: Team[];
}) {
  const [isPending, startTransition] = useTransition();
  const [instrument, setInstrument] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  function reset() {
    setInstrument(null);
    setTeamId(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!instrument || !teamId) return;
    startTransition(async () => {
      await addRole(instrument, teamId);
      reset();
      onClose();
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Role">
      <div className="space-y-4">
        <div>
          <span className={FIELD_LABEL}>Role</span>
          <div className="grid grid-cols-2 gap-1.5">
            {INSTRUMENTS.map((inst) => (
              <button
                key={inst}
                type="button"
                onClick={() => setInstrument(inst)}
                className={optionClass(inst === instrument)}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className={FIELD_LABEL}>Team</span>
          <div className="flex flex-wrap gap-1.5">
            {teams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setTeamId(team.id)}
                className={`${optionClass(team.id === teamId)} font-mono text-xs uppercase`}
              >
                {team.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex min-h-11 items-center rounded-btn px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink3 uppercase hover:text-ink sm:min-h-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || !instrument || !teamId}
            className="inline-flex min-h-11 items-center rounded-btn bg-accent px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-accent-foreground uppercase hover:opacity-90 disabled:opacity-60 sm:min-h-0"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
