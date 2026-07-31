"use client";

import { useMemo, useState } from "react";

type Volunteer = { id: string; name: string };

export default function VolunteerCombobox({
  value,
  volunteers,
  onChange,
  disabled,
}: {
  value: string | null;
  volunteers: Volunteer[];
  onChange: (personId: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedName = volunteers.find((v) => v.id === value)?.name ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return volunteers;
    return volunteers.filter((v) => v.name.toLowerCase().includes(q));
  }, [query, volunteers]);

  function pick(personId: string) {
    onChange(personId);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative min-w-[180px]">
      <input
        type="text"
        disabled={disabled}
        value={open ? query : selectedName}
        placeholder="— Unassigned —"
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => setOpen(false)}
        className="w-full rounded-md border border-border-strong bg-transparent px-3 py-1.5 text-sm disabled:opacity-50"
      />
      {open && (
        <div className="absolute right-0 left-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-md border border-border bg-surface-2 py-1 shadow-lg">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              pick("");
            }}
            className="block w-full px-3 py-1.5 text-left text-sm text-muted hover:bg-surface"
          >
            — Unassigned —
          </button>
          {filtered.map((v) => (
            <button
              key={v.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                pick(v.id);
              }}
              className="block w-full px-3 py-1.5 text-left text-sm hover:bg-surface"
            >
              {v.name}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-1.5 text-sm text-muted">No matches.</p>
          )}
        </div>
      )}
    </div>
  );
}
