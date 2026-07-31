"use client";

import { useMemo, useState, useTransition } from "react";

type Volunteer = { id: string; name: string; nickname: string | null };

function displayName(v: Volunteer) {
  return v.nickname || v.name;
}

export default function VolunteerCombobox({
  value,
  volunteers,
  onChange,
}: {
  value: string | null;
  volunteers: Volunteer[];
  onChange: (personId: string) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Optimistic override so the UI updates the instant you pick someone,
  // instead of waiting for the server round-trip. Cleared once the
  // server-confirmed value prop catches up.
  const [optimisticValue, setOptimisticValue] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  // Reset the optimistic override once the server-confirmed value prop
  // catches up to it, without an Effect (React's "adjust state during
  // render" pattern - safe because it bails out before committing).
  const [lastSeenValue, setLastSeenValue] = useState(value);
  if (value !== lastSeenValue) {
    setLastSeenValue(value);
    setOptimisticValue(undefined);
  }

  const effectiveValue = optimisticValue !== undefined ? optimisticValue : value;
  const selected = volunteers.find((v) => v.id === effectiveValue);
  const selectedName = selected ? displayName(selected) : "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return volunteers;
    return volunteers.filter(
      (v) => v.name.toLowerCase().includes(q) || (v.nickname ?? "").toLowerCase().includes(q)
    );
  }, [query, volunteers]);

  function pick(personId: string) {
    setOptimisticValue(personId);
    setQuery("");
    setOpen(false);
    startTransition(() => {
      onChange(personId);
    });
  }

  return (
    <div className="relative w-full sm:w-auto sm:min-w-[180px]">
      <input
        type="text"
        disabled={isPending}
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
              {displayName(v)}
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
